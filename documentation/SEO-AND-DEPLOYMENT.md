GitHub Pages release: follow [GITHUB-PAGES.md](GITHUB-PAGES.md) for the supported deployment workflow.

# SEO and deployment guide

## Implemented

Every HTML page has a unique title and description, one primary H1, language and viewport declarations, an absolute canonical URL, Open Graph and social-card metadata. Crawlable HTML contains the primary content. The site has descriptive internal links, breadcrumbs on inner pages, a linked HTML directory, an XML sitemap and a custom 404 document. JSON-LD describes the organisation, website, page and visible breadcrumbs; service pages also describe their service.

The internship overview deliberately has no JobPosting schema because it is not a confirmed vacancy. No review ratings, invented address, certifications, social accounts or fabricated customer claims are marked up. FAQs are visible HTML; no promise of FAQ rich results is made. Search rankings and rich results are not guaranteed.

## Confirmed website domain

The user-confirmed URL base is `https://injivadigitalsytems.com`, using the exact supplied spelling. The internship mailbox is `internships@injivadigitalsystems.com`; the general mailbox remains `info@injivadigitalsystems.com`. These are intentionally distinct. DNS, ownership, HTTPS and email delivery still require deployment verification. If the website URL changes later, update canonical, social, JSON-LD and sitemap URLs and recalculate the JSON-LD CSP hashes. Do not change email addresses merely because a website domain changes.

These canonical URLs assume hosting at the domain root. For a project subdirectory, adjust all absolute SEO URLs to that path. Relative navigation already supports opening the extracted folder locally.

## Search indexing enabled

At the user’s request, all 32 content pages now use `index, follow, max-image-preview:large`. The 404 page retains `noindex, follow` and its path-specific noindex HTTP-header example. robots.txt permits crawling and declares `https://injivadigitalsytems.com/sitemap.xml`. The XML sitemap excludes the 404 page.

After uploading the updated files:

1. Verify the deployed host does not inject a noindex response header or retain a platform-wide indexing block on content pages.
2. Verify canonical URLs and the 32 sitemap URLs resolve on the confirmed domain.
3. Serve unknown pages with a genuine HTTP 404 status. Do not rewrite every missing URL to the homepage.
4. Redirect HTTP to HTTPS and the nonpreferred host to the preferred host. Where supported, redirect /index.html to /.
5. Verify ownership in your chosen search-console tools, submit the sitemap and inspect representative pages. Inclusion and timing are controlled by the search engine, not by these files.
6. Complete the remaining business, security and deployment checks in the launch guide. Indexing permission is not certification of those checks.

For private staging, use authentication and an environment-specific noindex setting. Do not copy that setting into the public content pages. Do not publish documentation/, README.txt, VERIFICATION.txt or FEATURE-ROADMAP.md as website content.

## Host security configuration

`_headers` is an example configuration used by compatible static hosts, not a universal web-server file. On a host that ignores it, configure equivalent actual response headers through its dashboard, reverse proxy or server. GitHub Pages does not apply arbitrary headers from this file. If host-level header control is a release requirement, choose a compatible hosting setup.

The HTML includes a meta CSP as a fallback. Meta CSP cannot enforce every header directive, including frame-ancestors. On a compatible host, the example header configuration adds frame protection, MIME protection, permissions restrictions, referrer policy and HTTPS HSTS. No unsafe-inline or unsafe-eval permission is used. The code has no API calls, so connect-src is none; do not loosen it speculatively.

For HSTS, confirm the chosen host serves working HTTPS first. The supplied value is max-age=31536000 without includeSubDomains or preload. Do not turn on those additional options until every affected hostname is ready.

## Structured-data CSP hashes

Each JSON-LD block has a SHA-256 CSP allowance computed from its exact UTF-8 text. Its page meta CSP contains the corresponding hash, and `_headers` contains all current page hashes. If you edit JSON-LD (including whitespace), update both.

Optional maintenance command, run with Python installed on a maintainer’s computer; Python is not a website runtime dependency:

```python
from pathlib import Path
import base64, hashlib, re
for page in Path('.').glob('*.html'):
    source = page.read_text(encoding='utf-8')
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
    for block in blocks:
        digest = base64.b64encode(hashlib.sha256(block.encode('utf-8')).digest()).decode()
        print(page.name, "'sha256-" + digest + "'")
```

Replace the matching old hash in the page and host configuration; retain 'self'. Recheck the browser console after deployment. If no JSON-LD changed, no recalculation is needed for ordinary text, titles or robots-meta changes.

## Performance and maintenance

Assets are local, scripts deferred, and SVG marks have dimensions. Technology images use lazy loading. No framework, web fonts or analytics requests are needed. Performance targets still require measurements on the real host, compression, caching and real devices. Do not claim a Lighthouse score or Core Web Vitals pass without evidence.

The generic social image is at assets/images/social.png. Check its final public URL and appearance in social previews. Search and social crawlers may cache older versions.

When adding a page, add unique metadata, navigation or relevant inbound links, breadcrumbs, accurate structured data where appropriate and a sitemap entry. Update the 404 policy and active navigation states as needed. When removing a page, decide whether a relevant permanent redirect or genuine 404/410 is appropriate.

Official guidance consulted:

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/search/docs/appearance/structured-data/job-posting
