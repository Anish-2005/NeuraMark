import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFParse } from 'pdf-parse';
import { checkRateLimit } from '@/app/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const MIN_TEXT_LENGTH = 80;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

interface Module {
  name: string;
  topics: string[];
}

interface Subject {
  name: string;
  code: string;
  modules: Module[];
}

interface SyllabusJSON {
  branch: string;
  year: number;
  semester: number;
  subjects: Subject[];
}

const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
};

const noStoreJson = (data: unknown, status = 200): NextResponse =>
  NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
    },
  });

const normalizeSyllabus = (value: Partial<SyllabusJSON>): SyllabusJSON => ({
  branch: value.branch?.trim() || 'Computer Science',
  year: Number.isFinite(value.year) ? Number(value.year) : 1,
  semester: Number.isFinite(value.semester) ? Number(value.semester) : 1,
  subjects: Array.isArray(value.subjects) ? value.subjects : [],
});

const parseModelJson = (rawText: string): SyllabusJSON => {
  const cleanedText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleanedText) as Partial<SyllabusJSON>;
  return normalizeSyllabus(parsed);
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request);
  const limitResult = checkRateLimit({
    key: `process-pdf:${ip}`,
    limit: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!limitResult.allowed) {
    return noStoreJson(
      {
        error: 'Too many requests. Please wait before uploading another file.',
        retryAfterSeconds: Math.max(1, Math.ceil((limitResult.resetAt - Date.now()) / 1000)),
      },
      429
    );
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey === 'your_google_ai_api_key_here') {
    return noStoreJson(
      { error: 'Server configuration error: AI provider is not configured.' },
      500
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!(file instanceof File)) {
      return noStoreJson({ error: 'No PDF file received.' }, 400);
    }

    if (!file.type.toLowerCase().includes('pdf')) {
      return noStoreJson({ error: 'Invalid file type. Please upload a PDF file.' }, 400);
    }

    if (file.size === 0) {
      return noStoreJson({ error: 'Uploaded file is empty.' }, 400);
    }

    if (file.size > MAX_FILE_BYTES) {
      return noStoreJson(
        { error: `File is too large. Maximum allowed size is ${MAX_FILE_BYTES / (1024 * 1024)}MB.` },
        413
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({ data: buffer });
    let pdfText = '';
    try {
      const parsedTextResult = await parser.getText();
      pdfText = parsedTextResult.text?.trim() || '';
    } finally {
      await parser.destroy();
    }

    if (pdfText.length < MIN_TEXT_LENGTH) {
      return noStoreJson(
        {
          error:
            'Could not extract enough text from this PDF. Try a clearer syllabus file with selectable text.',
        },
        400
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analyze this syllabus text and return ONLY a JSON object:
{
  "branch": "Computer Science",
  "year": 1,
  "semester": 1,
  "subjects": [
    {
      "name": "Subject Name",
      "code": "SUB001",
      "modules": [
        {
          "name": "Module Name",
          "topics": ["Topic 1", "Topic 2"]
        }
      ]
    }
  ]
}

Syllabus text:
${pdfText.substring(0, 14000)}

If any field is missing, infer safe defaults.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonResponse = parseModelJson(text);

    if (!jsonResponse.subjects || jsonResponse.subjects.length === 0) {
      return noStoreJson(
        {
          error: 'Could not extract subjects from this PDF. Try another file.',
        },
        400
      );
    }

    return noStoreJson({
      success: true,
      branch: jsonResponse.branch,
      year: jsonResponse.year,
      semester: jsonResponse.semester,
      subjects: jsonResponse.subjects,
      message: `Processed ${jsonResponse.subjects.length} subjects successfully.`,
    });
  } catch (error) {
    return noStoreJson(
      {
        error: 'Failed to process PDF right now. Please retry in a few minutes.',
      },
      500
    );
  }
}
