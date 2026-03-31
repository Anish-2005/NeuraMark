<p align="center">
  <img src="public/logo.png" alt="NeuraMark logo" width="120" />
</p>

<h1 align="center">NeuraMark</h1>
<p align="center">
  AI-powered academic progress tracking platform for students.
</p>

<p align="center">
  <a href="https://neuramark.vercel.app">Live Site</a>
  |
  <a href="CONTRIBUTING.md">Contributing</a>
  |
  <a href="LICENSE">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-11.7-FFCA28?logo=firebase&logoColor=000" alt="Firebase" />
  <img src="https://img.shields.io/badge/License-MIT-16a34a" alt="MIT License" />
</p>

---

## Visual Overview

![NeuraMark preview](public/emblem.png)

---

## What NeuraMark Does

NeuraMark helps students plan and track their academic progress in one place:

- syllabus management by branch, year, and semester
- progress tracking at subject/module level
- exam scheduling and timeline management
- analytics dashboards for KPIs/KRAs
- real-time collaboration chat
- AI-assisted syllabus extraction from PDF
- responsive UI with light/dark themes and no-JS static fallback

---

## Product Areas

| Area | Description |
|---|---|
| Dashboard | Progress cards, module completion, semester filters |
| Exams | Add/edit/delete exams, upcoming/past filters, export schedule |
| Analytics | KPI/KRA data visualizations and progress insights |
| Chat | Room-based communication with moderation controls |
| Admin | Subject and user management, PDF processing workflows |
| Auth | Email/password and Google sign-in + profile completion |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS, Framer Motion |
| Language | TypeScript |
| Data/Auth | Firebase (Auth + Firestore) |
| AI | Google Generative AI |
| Charts/Utilities | Recharts, date-fns, react-icons, jspdf |
| Deployment | Vercel |

---

## SEO and Crawl Setup

NeuraMark is configured with:

- typed page metadata and canonical URLs
- `robots.txt` via App Router metadata route
- `sitemap.xml` via App Router metadata route
- Open Graph and Twitter card metadata
- JSON-LD structured data on homepage
- `noindex` for private/auth/admin/chat segments

Production URLs:

- `https://neuramark.vercel.app/robots.txt`
- `https://neuramark.vercel.app/sitemap.xml`
- `https://neuramark.vercel.app/manifest.webmanifest`

---

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+
- Firebase project credentials
- Google AI API key (for PDF processing route)

### Install

```bash
npm install
```

### Configure Environment

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SITE_URL=https://neuramark.vercel.app

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GOOGLE_AI_API_KEY=

# Optional comma-separated allowlist for Next Image optimization
NEXT_PUBLIC_IMAGE_HOSTS=
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # run built app
npm run lint    # lint checks
```

---

## Project Structure

```text
app/
  (auth)/                 auth pages
  (main)/dashboard/       student dashboard and modules
  admin/                  admin tooling
  chat/                   real-time collaboration UI
  api/process-pdf/        AI PDF extraction endpoint
  components/             reusable UI + app components
  context/                auth/theme contexts
  lib/                    shared helpers (auth, rate limit, firebase)
  layout.tsx              root metadata and global shell
  robots.ts               robots metadata route
  sitemap.ts              sitemap metadata route
```

---

## Deployment

Primary deployment target is Vercel.

Recommended production env var:

```bash
NEXT_PUBLIC_SITE_URL=https://neuramark.vercel.app
```

After deploy:

1. Open Google Search Console.
2. Verify the domain property.
3. Submit `https://neuramark.vercel.app/sitemap.xml`.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
