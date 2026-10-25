# Portfolio roadmap

## [IN-PROGRESS]
None.

## [PENDING]
None.

## [COMPLETED]
- Accelerate poster hover reveals (2026-10-25): full transition now takes 0.8 seconds with a responsive quadratic curve that accelerates toward the image and reverses continuously.
  - Acceptance Gate: Original frame callback failed the speed check; updated real Three.js material/uniform frame checks pass at 30/60/120 fps for completion, final-quarter acceleration, idle return and interrupted reversal. Production build, targeted ESLint and real browser WebGL hover/pixel-change checks passed with no browser errors.
- Remove navigation italics (2026-10-25): About, Resume and Contact now use normal text in both default and selected states.
  - Acceptance Gate: Passed production build, targeted ESLint and browser-computed font-style assertions for all three links in the default, About, Resume and Contact states.
- Synchronize project titles (2026-10-24): Content Operations App and Enrollment Data Cache now match across posters and case studies.
  - Acceptance Gate: Passed production build, targeted ESLint and automated HTTP checks of both poster titles, case-study h1 headings, browser titles, Open Graph titles and Twitter titles.
- Migrate all 13 About videos to Oracle at `https://assets.alexya.ng/about/` (2026-10-24), removing 709,668,039 bytes of MP4s from the current repository tree.
  - Acceptance Gate: Passed independent SHA-256 verification, public HTTPS HEAD and byte-matched beginning/end range requests for every file, production build and targeted ESLint, all 13 legacy URL redirects, and advancing browser playback. GitHub main tree readback confirmed external playlist URLs and no public/about MP4s; unrelated file blobs were preserved.
- Revise the intro and first two posters, and hide Independent Work (2026-10-24).
  - Acceptance Gate: Production build/lint and rendered HTTP checks pass for exact copy and section visibility.
