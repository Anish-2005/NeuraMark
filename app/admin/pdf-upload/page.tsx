'use client'

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadArea from './components/UploadArea';
import FilePreview from './components/FilePreview';
import ProcessingStatus from './components/ProcessingStatus';
import ErrorDisplay from './components/ErrorDisplay';
import ProcessingResult from './components/ProcessingResult';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload } from 'lucide-react';

export default function PDFUpload() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    interface Subject {
        name: string;
        code: string;
        modules?: string[];
    }

    interface ProcessingResult {
        branch: string;
        year: string;
        semester: string;
        subjects?: Subject[];
    }

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
            setError(null);
            setProcessingResult(null);
        } else {
            setError('Please upload a valid PDF file');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const handleUpload = async () => {
        if (!uploadedFile) return;

        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('pdf', uploadedFile);

            const response = await fetch('/api/process-pdf', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setProcessingResult(result);
            } else {
                setError(result.error || 'Failed to process PDF');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    const resetUpload = () => {
        setUploadedFile(null);
        setProcessingResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--surface-base)' }}>
            {/* Navigation */}
            <nav className="skeu-navbar sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4 min-w-0">
                            <Link
                                href="/dashboard"
                                className="skeu-btn-icon rounded-lg"
                                aria-label="Back to Dashboard"
                            >
                                <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                            </Link>
                            <div className="skeu-inset p-1 rounded-lg">
                                <Image
                                    src="/emblem.png"
                                    alt="NeuraMark Logo"
                                    width={28}
                                    height={28}
                                    className="rounded shrink-0"
                                    priority
                                />
                            </div>
                            <h1 className="text-lg font-bold skeu-text-embossed truncate max-w-[140px] sm:max-w-xs"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                PDF Upload
                            </h1>
                            <span className="skeu-badge hidden sm:inline-block text-[10px]">
                                ADMIN
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-6">
                <div className="skeu-card-static p-6 sm:p-8 rounded-2xl border border-skeu mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="skeu-inset p-3 rounded-xl">
                            <Upload className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold skeu-text-embossed"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                PDF Syllabus Upload
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Upload a PDF syllabus document and let AI extract subjects, modules, and update the database automatically.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <UploadArea getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive} />
                    <FilePreview uploadedFile={uploadedFile} resetUpload={resetUpload} />
                    {uploadedFile && !isProcessing && (
                        <button
                            onClick={handleUpload}
                            className="skeu-btn-primary w-full py-3 px-6 rounded-lg font-medium text-base"
                        >
                            Process PDF with AI
                        </button>
                    )}
                    <ProcessingStatus isProcessing={isProcessing} />
                    <ErrorDisplay error={error} />
                    <ProcessingResult result={processingResult} />
                </div>
            </div>
        </div>
    );
}