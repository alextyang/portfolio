# Portfolio roadmap

## [IN-PROGRESS]
None.

## [PENDING]
None.

## [COMPLETED]
- Rename the homepage section label (2026-10-25): Fellowship @ Center Centre replaces Web & Email Dev @ Center Centre.
  - Acceptance Gate: Production build and targeted ESLint passed; automated checks of generated homepage HTML confirmed the new label and absence of the former label.
- Strengthen acceleration at the very end (2026-10-25): 40% linear/60% cubic progress keeps the initial speed and 0.72-second duration while increasing endpoint speed by 37.5% over the previous curve.
  - Acceptance Gate: Previous curve failed the sharper-final-quarter check; actual Three.js material/uniform frame checks now pass at 30/60/120 fps for completion, initial/end speed and continuous reversal. Production build, targeted ESLint and browser WebGL hover checks passed without errors.
- Add the greeting and soften reveal opening (2026-10-25): tagline starts with Hi!; the 40% linear/60% quadratic curve reduces initial speed by 11.1% while retaining the 0.72-second duration and fast finish.
  - Acceptance Gate: Actual Three.js material/uniform frame checks passed at 30/60/120 fps for completion, softer initial speed, fast endpoint and continuous reversal. Production build, targeted ESLint, rendered greeting and browser WebGL hover checks passed without errors.
- Sharpen the poster reveal finish (2026-10-25): 0.72-second duration with a 45% linear/55% quadratic curve keeps the prior initial speed and raises endpoint speed by 14.8%.
  - Acceptance Gate: Actual Three.js material/uniform frame checks passed at 30/60/120 fps for completion, unchanged initial speed, increased endpoint speed and continuous reversal. Production build, targeted ESLint and browser WebGL hover checks passed without errors.
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
