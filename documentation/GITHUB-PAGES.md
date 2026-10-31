# GitHub Pages deployment and operations

This release is a static website. Runtime files are HTML, CSS, JavaScript and
local media. Node.js 24 and jsdom are development/test tools only.

## 1. Upload the repository

Extract the ZIP. Open its `injiva-digital-systems` folder in VS Code. Put its
contents at the repository root: `index.html`, `assets`, `package.json`,
`package-lock.json`, `tests`, `scripts`, and **`.github`** must be siblings.
Do not commit `node_modules` or `_site`. A `.gitignore` is included.

Create or select your intended GitHub repository. Commit and push to `main`.
If you use a different default branch, change both branch filters and the
`refs/heads/main` deployment condition in `.github/workflows/pages.yml`.
Never commit mailbox passwords, API keys, applicant CVs or production records.

## 2. Enable Pages

In the repository, open **Settings → Pages → Build and deployment → Source**
and choose **GitHub Actions**. Enable Actions if the organisation blocks them.
The included workflow tests pull requests without deploying them. Pushes to
`main` deploy only after all tests and the high/critical dependency audit pass.
Deployment has Pages write and OIDC permissions; the test job has read-only
repository access. Action versions are pinned to upstream commit SHAs.

Use branch protection/rulesets to require the `test` job and a review before
merging. Restrict the `github-pages` environment to the main branch. Enable MFA
and keep recovery methods for GitHub, the domain registrar and mail provider.
Dependabot opens weekly npm and GitHub Action update PRs; review and test them.

## 3. Connect the confirmed custom domain

The source `CNAME` contains **injivadigitalsytems.com**, exactly as supplied.
This differs from the mailbox domain **injivadigitalsystems.com**.

Add `injivadigitalsytems.com` in Settings → Pages → Custom domain. Verify domain
ownership in GitHub and configure the DNS records required by GitHub's current
custom-domain instructions. Do not overwrite MX/TXT records used for email.
Use only the current addresses/verification values from GitHub documentation or
its dashboard; do not guess the account-specific verification value.

Wait for GitHub's DNS and certificate checks, then enable **Enforce HTTPS**.
If you serve `www`, configure it according to GitHub's custom-domain guidance
and verify that it redirects to the selected domain. Avoid wildcard DNS records.

The SEO canonicals and sitemap intentionally target the custom-domain root.
A temporary `username.github.io/repository/` URL is useful for QA but is not a
second SEO production address. Relative links work there; the build rewrites
404 resource paths using GitHub's `base_path` output. If you permanently change
the public domain/path, update canonicals, OG, JSON-LD, robots and sitemap, then
refresh CSP hashes and tests. `CNAME` alone does not configure DNS or HTTPS.

## 4. What gets deployed

`scripts/build.cjs` copies only HTML, assets, robots.txt, sitemap.xml, CNAME and
.nojekyll to `_site`. Tests, documentation, package files and `_headers` are
excluded. Public assets include required third-party licence notices.
`.nojekyll` avoids unintended Jekyll processing for manual static deployments.
The custom 404 has root-relative resources so nested unknown paths still work.

## 5. Verify the release

The workflow automatically requests the deployed URL after deployment. It
checks key pages/assets, HTTPS, public indexability and a genuine custom 404.
It retries transient propagation failures twice. A failed post-deployment check
marks the workflow failed, but does **not** automatically undo the deployment.
Investigate promptly and revert if required.

Locally, use Node.js 24:

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run check:live -- https://injivadigitalsytems.com/
```

Open Actions → Test and deploy GitHub Pages and confirm every job succeeds.
Check mobile and desktop rendering, keyboard navigation, reduced motion and
forms. Verify enquiry delivery by deliberately sending a test from your email
app to each mailbox and checking receipt. This package has sent no messages.
Submit `https://injivadigitalsytems.com/sitemap.xml` in Google Search Console
once domain verification is complete. Search inclusion is not guaranteed.

## 6. Enquiries on static hosting

The tools prepare drafts in the visitor's browser. Visitors choose Copy,
Download draft or Open email app; they must send the message themselves. No
website message submission, CV upload or automatic acknowledgement occurs.
Long mailto drafts fall back to copy/download so messages are not truncated.
The site does not claim delivery or persist form contents.

GitHub Pages cannot execute a backend. If direct submissions are required,
provision an external endpoint, agree its processing terms, update notices and
CSP, then add server-side validation, abuse limits, safe error handling and
real delivery tests. Do not put provider secret keys in public JavaScript.

## 7. Security limits of GitHub Pages

The HTML meta CSP restricts scripts, styles, images, connections and submissions.
Its JSON-LD hashes are tested. `_headers` is only an example for other hosts:
GitHub Pages does not apply it. Meta CSP cannot implement `frame-ancestors` or
other HTTP-only protections. Arbitrary response headers, redirects, cache policy
and HSTS settings require host support or a properly configured proxy. Verify
actual responses before claiming any of those protections. HTTPS settings are
configured in GitHub, not in the ZIP. Do not add analytics or embeds without
reviewing CSP, data handling and consent requirements for the actual deployment.

## 8. Monitoring and rollback

After launch, create a repository Actions variable `LIVE_SITE_URL` with the
final HTTPS URL. The included health-check workflow then runs daily at 06:23 UTC
(08:23 CAT), and can be run manually. It makes only read requests. Without the
variable it skips. Enable GitHub Actions failure notifications and assign an
owner; notifications are not configured by this ZIP. Scheduled runs may be
delayed or disabled by GitHub and are not a 24/7 monitoring SLA.

Tag known-good releases and keep a repository backup. If a release fails,
revert the offending commit with `git revert <commit-sha>` and push the revert
to main. The same test/build/deploy workflow runs. Re-run live smoke checks.
For emergency recovery, use a verified known-good commit through the normal
workflow; do not disable tests to force a broken release. Verify rollback in a
test repository before relying on the procedure. No rollback drill has been
performed against your account here.

Review broken external links, article currency, recruitment wording, mailbox
ownership, dependency alerts and privacy contacts at least monthly. Record
accessibility findings and business approvals in the launch checklist.

## Official references

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site
