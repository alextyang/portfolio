# Portfolio

## Stack and commands
Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Mantine, Framer Motion, and Three.js.
Run `npm ci`, `npm run dev`, `npm run build`, and `npm run lint`.

## Boundaries
Pages live in app/, reusable UI in components/, case-study content in content/, and case-study media in public/.
About videos are hosted independently on Oracle at `https://assets.alexya.ng/about/`. Keep MP4s out of public/about/ and use absolute asset URLs in the homepage playlist. next.config.ts redirects legacy /about/ URLs to the asset host.
The Oracle files live at /srv/portfolio-assets/about and are served by the existing Caddy site /etc/caddy/sites-enabled/portfolio-assets.caddy. Deployment and rollback evidence live in the private personal-network operations workspace.
Preserve unrelated changes and current URL/subpage handling. Maintain TODO.md and verify real HTTP/video boundaries. Do not rewrite shared history to remove media without explicit authorization.

Poster reveal timing lives in GlyphImageHoverNoiseMesh. Its elapsed-time progress covers the full reveal duration and follows the same continuous curve when hover reverses.
