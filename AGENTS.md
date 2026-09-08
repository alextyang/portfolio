# Portfolio

## Project summary and quickstart
Next.js portfolio site. Use `npm install`, `npm run dev`, and `npm run build` from this directory.

## Goals and non-goals
Present portfolio work and case studies. Preserve existing design/content changes. Storage maintenance must not rewrite shared history or alter working files without task-specific authorization.

## Rules
Preserve unrelated and uncommitted changes. Maintain TODO.md. Back up Git metadata before destructive history maintenance; verify refs, index, and working-file contents afterward.

## Intended architecture
Next.js App Router pages in app/, reusable components in components/, and media in public/. React renders the UI; next.config.ts configures the app.

## Storage archive
User authorized publishing current work to the GitHub archive/local-work-2026-09-08 branch and recovery history as a release bundle, then removing local Git metadata and its SSD backup. The working files are retained. Do not infer that absence of .git means the files lack a GitHub archive.
