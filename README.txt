INJIVA DIGITAL SYSTEMS — GITHUB PAGES RELEASE
Release 1.1.0 • 31 October 2026

START HERE: documentation/GITHUB-PAGES.md

33 pages in pure HTML, CSS and vanilla JavaScript. No runtime framework,
webfont, CDN, database or backend. Font Awesome Free SVGs are hosted locally.
32 content pages permit indexing; 404 is noindex. Indexing is not guaranteed.

Upload the CONTENTS of this folder to your GitHub repository root, including
.github/. Do not upload only the ZIP. Select GitHub Actions as the Pages
publishing source. Push to main: tests and dependency checks run before the
public-only _site artifact is built and deployed. No credentials are included.

MAINTAINER COMMANDS (Node.js 24)
  npm ci --ignore-scripts
  npm test
  npm run build
  npm run check:live -- https://injivadigitalsytems.com/
Node/npm are for checks and packaging only, not visitor runtime.

LOCAL VIEWING
Open index.html or serve the built _site directory with a local static server.
The 404 page intentionally uses root paths for missing nested URLs.

ENQUIRIES
All enquiry tools explicitly prepare local drafts; they do not submit messages.
Visitors can copy, download or open a draft in their email app, then send it.
No email credentials or fake submission confirmations are present.
GitHub Pages cannot run a submission backend. Any future form service requires
an approved provider, endpoint, updated privacy notice/CSP and server-side tests.

PRODUCTION DOMAIN AND CONTACTS
Website: https://injivadigitalsytems.com (exact user-confirmed spelling)
General: info@injivadigitalsystems.com
Internships: internships@injivadigitalsystems.com
Phone: +263771050052
The website and mailbox domains intentionally differ. Verify both in operation.

RELEASE CONTENTS
Responsive navigation, service enquiry context, solution explorer, five industry
pages, internship learning guides, careers filters, four technical articles,
project brief generation, company profile PDF, FAQs, privacy/legal/accessibility
pages, reduced-motion support and local Font Awesome icons.

TEST AND DEPLOYMENT EVIDENCE
Read documentation/TEST-REPORT.md. Tests cover structural and DOM behaviour,
not full browser layout, screen-reader conformance, legal compliance or uptime.
See documentation/GITHUB-PAGES.md for DNS/HTTPS setup, smoke checks and rollback.
See documentation/COMPLIANCE-AND-LAUNCH.md for unresolved company/operating facts.
The package has not been deployed to your GitHub account by this delivery.

SECURITY
The meta CSP is enforced by browsers. GitHub Pages ignores the example _headers
file, which the build excludes. Custom response headers need a compatible proxy
or different hosting configuration; do not claim those headers are active.
No analytics, uploads, cookies or persistent form storage are added by site code.
Protect GitHub, DNS and mail accounts with MFA and protect the main branch.

EDITING
Content: *.html; presentation: assets/css/style.css; behaviour: assets/js/main.js.
After editing JSON-LD, update its exact CSP hash. npm test catches stale hashes,
broken internal links, duplicate metadata and other regressions. Add new pages to
sitemap.xml and sitemap.html; update the intentional page-count assertion.
Keep leadership quotes, programmes and vacancy status approved and current.
Only confirmed vacancies should be advertised as available jobs.

LICENSES
Font Awesome license and icon map: assets/images/icons/.
Technology mark attribution: assets/images/technology/.
Technology marks are illustrative; no partnership/certification claim is implied.
