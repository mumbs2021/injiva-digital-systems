# Release verification — 31 October 2026

Release: 1.1.0, GitHub Pages packaging. Scope: 33 static HTML pages.

## Executed checks

- `npm test`: **25 tests passed, 0 failed, 0 skipped** on Node.js 24.22.1.
- JavaScript syntax check passed for the visitor script.
- `npm audit --audit-level=high`: **0 known vulnerabilities** reported at test time,
  including development dependencies. This is not a security certification.
- Public-only build completed. Workflow and Dependabot YAML parsed successfully.
- Official action refs were resolved to the pinned commit SHAs in this release.

## What the automated tests cover

All pages: unique titles/descriptions, one H1/main landmark, document language,
ID uniqueness, ARIA references, local links and fragments, image alternatives
and dimensions, form labels, canonical/OG consistency, sitemap coverage,
indexing rules, JSON-LD syntax and exact CSP hashes. Security checks reject
inline executable scripts, inline handlers and javascript URLs; the policy
blocks network connections and native form submission in this static release.

Interactions in jsdom: service query selection, ignored untrusted query values,
plain-text handling of markup-like input, native/custom validation, whitespace
rejection, long-mailto fallback, draft invalidation after edits, internship
recipient, career preselection/filtering/empty states, FAQ search/reset,
solution fragment behaviour, brief generation/progress/Blob revocation,
clipboard failure instructions, local text-draft download, mobile menu/Escape,
reduced-motion behaviour and no-JavaScript fallback.

Release checks: public artifact allowlist, project-path 404 resources and active
contact CTA text contrast. Live-check tests use mocked HTTP responses to verify
healthy checks and rejection of HTTP, server errors and soft 404 responses.

## Browser check performed

In a Chromium preview, opened Contact with `?service=data`, entered synthetic
test details, generated a draft and verified service context, draft controls and
explicit unsent status. Inspected the draft panel visually. Found and fixed an
active-navigation colour collision that hid “Let’s talk” against its background;
verified white text on crimson in the browser and added a contrast regression
test. No email was opened or sent. Browser-extension diagnostic errors were
observed; they were not website errors.

## Limits and launch work

jsdom tests simulate DOM behaviour; they are not a full real-browser matrix or
assistive-technology audit. No full WCAG conformance, Lighthouse score, mobile
hardware performance or penetration-testing certification is claimed.

The GitHub Actions workflow has not yet run in the user's repository. Real
GitHub deployment, domain ownership, DNS, HTTPS, hosting responses, live health
checks, mailbox receipt, scheduled notifications and rollback remain unverified
until setup. The included workflow performs HTTP smoke checks after deployment.
An unsuccessful smoke check does not automatically revert the release.

The original content, photographs, company-profile PDF, articles, Font Awesome
icons and animations are preserved. Policy pages still require the business's
actual processing and corporate facts to be reviewed before launch.
