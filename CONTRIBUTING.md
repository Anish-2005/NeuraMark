# Contributing to NeuraMark

Thanks for contributing. This document explains how to contribute safely and consistently.

## Ground Rules

- Keep changes scoped and reviewable.
- Preserve the established UI/design language unless the task requires redesign.
- Prefer typed, explicit code over quick patches.
- Do not commit secrets or API keys.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with required variables (see `README.md`).
4. Run locally:
   ```bash
   npm run dev
   ```

## Branch Naming

Use clear branch names:

- `feat/<short-feature-name>`
- `fix/<short-bug-name>`
- `docs/<short-doc-change>`
- `refactor/<short-area>`

Examples:

- `feat/seo-metadata-upgrade`
- `fix/exams-filter-state`

## Commit Style

Use concise, imperative commit messages.

Recommended format:

- `feat: add route-level metadata for public pages`
- `fix: resolve stale exam list effect dependency`
- `docs: rewrite readme and contributing guide`

## Pull Request Checklist

Before opening a PR:

- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`) or known warnings are documented
- [ ] No unrelated files are changed
- [ ] UI screenshots included for visual changes
- [ ] README/docs updated if behavior changed
- [ ] Environment/config changes documented

## Code Quality Expectations

- Prefer reusable helpers in `app/lib` for shared logic.
- Keep components focused; avoid monolithic files for new work.
- Handle loading, error, and empty states explicitly.
- Add accessibility attributes (`aria-*`, semantic tags) when relevant.

## Documentation Changes

If you introduce:

- new environment variables
- new routes
- new background jobs/APIs
- deployment behavior changes

update `README.md` in the same PR.

## Security

If you discover a security issue, do not open a public issue with exploit details.
Share a minimal report privately with the maintainers first.
