# Compliance and launch review

Prepared 30 October 2026. Scope: the static INJIVA Digital Systems website and its initial business/internship enquiry tools. This is an implementation review and launch checklist, not a legal opinion, jurisdiction-by-jurisdiction certification, or proof of compliance. The site is not published by this delivery.

## What the implementation provides

- Local email drafting instead of silent form transmission; an explicit distinction between preparing and sending.
- No file uploads, account credentials, payments, analytics, advertising, third-party embeds or persistent application storage.
- Minimum initial internship fields, optional portfolio and availability, no collection of identity numbers or special-category information, and no automated applicant scoring.
- A separate applicant privacy notice at the point of enquiry; no bundled marketing consent or implied talent-pool permission.
- Privacy, cookie, accessibility and terms pages linked throughout the site.
- Native disclosures, keyboard navigation, focus styling, reduced-motion support, responsive layout, labelled fields and direct email/phone alternatives.
- Locally hosted assets, a restrictive CSP, plain-text rendering of user entries, mailto encoding, length limits and host-header guidance.
- Accurate vacancy status: areas for enquiry only. No invented pay, openings, dates, accreditation, hiring guarantees or JobPosting markup.

These are safeguards in the delivered code. They do not establish how company staff, mailboxes, hosting providers or future integrations behave.

## Required business facts before publication

1. Confirm the legal operating entity, registered number and registered/contact address. The existing entity name is retained from supplied context. A street address and registration number have not been invented. Add legally required corporate disclosures and controller contact details to the site.
2. The user confirmed `https://injivadigitalsytems.com` as the website domain. Verify ownership, DNS and HTTPS before deployment; preserve this exact spelling.
3. Verify that `info@injivadigitalsystems.com` handles general enquiries and `internships@injivadigitalsystems.com` handles internship/applicant enquiries. Confirm both are configured, monitored and have the appropriate privacy-request routing. No test message has been sent.
4. Identify hosting, email, security/CDN, backup and support providers; their access, locations, subprocessors, logs and contracts. Update notices with actual arrangements before collecting correspondence.
5. Assign a person responsible for privacy requests, recruitment records, security incidents and accessibility feedback. Determine whether any legally required officer/representative must be appointed or registered. Do not call a person a registered DPO without confirmation.
6. Adopt a retention schedule for business enquiries, rejected/withdrawn applicants, future talent pools (if any), successful placements, access logs and backups. Record the basis, period/criteria and deletion method. Generic website wording is not a mailbox retention policy.
7. Document processing purposes, lawful bases, access permissions and data flows. Assess any legitimate-interest basis rather than assuming it universally applies. Consent is not a substitute for another missing legal requirement.
8. Establish rights-request verification, handling, deadlines, exceptions, escalation and records. A working contact link alone does not fulfil a request.
9. Confirm cross-border transfer mechanisms and data-residency requirements for each provider and customer. Access by remote staff can also matter.
10. Approve internship descriptions and the actual selection process, including pay/allowances, employment status, supervision, hours, health and safety, eligibility, age/safeguarding, reasonable adjustments and institution arrangements.
11. Check logo permissions and remove brands that are not relevant. A third-party icon repository licence does not itself grant trademark permission.
12. Obtain a qualified local legal review for the business’s actual target markets and services, and a separate accessibility review. Keep the approval record and review date.

## Regional applicability review

A website being accessible worldwide does not automatically make every country’s law applicable. Conversely, a Zimbabwe operator can acquire foreign obligations by targeting customers, establishing operations, handling particular data or using particular providers. Establish the facts for each market before launch there. This is a selected-market triage, not an exhaustive global survey.

### Zimbabwe — immediate home-jurisdiction review

Review the Cyber and Data Protection Act and S.I. 155 of 2024, including controller licensing/exemptions, officer requirements, security, notices, data-subject rights, transfers and incident duties. Confirm the entity’s actual registration and licence position with POTRAZ. A privacy notice is not a controller licence. Add the actual controller address and required business disclosures. Separately review applicable employment, contract, consumer, company and intellectual-property obligations.

Source: [POTRAZ — S.I. 155 of 2024](https://www.potraz.gov.zw/wp-content/uploads/2025/02/sI-155-of-2024-Cyber-and-Data-Protection-Normal_240913_1250178.pdf). [Cyber and Data Protection Act text](https://zimlii.org/akn/zw/act/2021/5/eng%402022-03-11).

### European Union / EEA

Assess establishment, targeting of goods/services and monitoring before deciding GDPR applicability. If applicable, map lawful bases, transparency, rights, processors, security, transfers and any representative/DPO requirement. Consider national device-storage/marketing rules and applicable consumer, employment and accessibility requirements separately. Do not assume every commercial brochure site falls within every accessibility regime, or that a consent checkbox satisfies GDPR.

Source: [European Commission — application of GDPR](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/application-gdpr_en).

### United Kingdom

Assess UK data-protection and electronic-communications obligations for the actual activities. Recruitment requires its own transparency and proportional collection. Do not perform undisclosed background, credit or sensitive-data checks. Review the current rules before adding analytics or marketing; the present site code contains neither. Review UK employment and accessibility/equality obligations separately if targeting this market.

Sources: [ICO — cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/); [ICO — pre-employment vetting](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/recruitment-and-selection/pre-employment-vetting-of-candidates/).

### South Africa

Assess POPIA territorial applicability and the business’s processing circumstances. Where applicable, address notices, responsible-party accountability, Information Officer arrangements, rights, security, operator agreements and international transfers. Consider PAIA obligations and any required manual separately. Additional authorisation may apply to certain higher-risk processing; it is not created by publishing a notice.

Sources: [Information Regulator — privacy notice and section 18 context](https://inforegulator.org.za/privacy-notice/); [prior authorisation](https://eservices.inforegulator.org.za/priorauthorisation/default.aspx).

### United States

Do not treat the United States as one privacy regime. Assess state thresholds, residents, activities and sector-specific rules. For California, determine whether CCPA/CPRA applies and then implement the required notices, rights and opt-out handling. This code has no advertising sale/sharing flow; do not add a fictitious opt-out control. Adding ad technology requires a fresh review, including applicable preference signals. Review recruitment, discrimination, accessibility and marketing obligations separately.

Sources: [California Attorney General — CCPA](https://www.oag.ca.gov/privacy/ccpa?version=published); [US DOJ — web accessibility](https://www.ada.gov/assets/pdfs/web-guidance.pdf).

### Canada

Assess PIPEDA, relevant provincial privacy laws and cross-border commercial activity. Where applicable, address accountability, identified purposes, consent/other permitted processing, limited collection and retention, safeguards, openness and access. Employment data can have different coverage depending on the organisation and province. Review anti-spam obligations before introducing promotional email.

Source: [Office of the Privacy Commissioner — PIPEDA requirements](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief/).

### Brazil

Assess LGPD applicability for the actual offering and processing. International transfers need an applicable lawful basis and transfer mechanism; publishing an English notice is not enough. Review language, local contact, rights and any representative/officer requirements with relevant counsel before targeting Brazil.

Source: [ANPD — international transfer regulation, Resolution 19](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024).

### India

Review the DPDP Act, notified 2025 Rules and the commencement schedule relevant to launch. Do not rely on the January 2025 draft or assume all obligations began together. The official ministry report describes a phased implementation. Have local counsel confirm the provisions currently in force, notice/consent, children’s data, rights, safeguards and overseas processing for the planned activity.

Source: [MeitY annual report referencing notified rules and phased implementation](https://www.meity.gov.in/static/uploads/2026/04/46face7d48c8f6a97030f713ad5fdab4.pdf).

### Singapore

Assess the PDPA’s relevance to the activity. Review accountability, purposes, consent and exceptions, access/correction, safeguards, retention, transfers and breach processes. Confirm current commencement of any phased obligation; not every item in a framework is necessarily in force at the same time. Do not name a DPO or promise a response deadline without establishing the operating process.

Source: [PDPC — data protection obligations](https://www.pdpc.gov.sg/-/media/Files/PDPC/PDF-Files/Resource-for-Organisation/Data-Protection-Obligations-under-the-PDPA.ashx?la=en).

### Other markets

Australia, New Zealand, other African countries, China, Japan, South Korea, the Middle East and other regions have not received a complete jurisdiction-specific assessment in this work. Before deliberately targeting any unreviewed market, obtain a scoped review of privacy, localisation/transfers, consumer disclosures, accessibility, employment, marketing, tax and sector requirements. Record an explicit decision and owner. Do not infer approval from absence in this checklist.

## Recruitment process controls outside the website

- Treat the initial message as an enquiry, not consent to screening, reference checks or a permanent talent pool.
- Use role-relevant, consistently applied selection criteria; make necessary accommodations available.
- Do not publish a live vacancy until title, location/remote eligibility, duties, pay disclosures where required, hours, dates, application method and closing status are approved.
- Assess whether an internship is legally employment and whether wages or other protections are required. “Internship” or “unpaid” wording does not determine legal classification.
- Provide a stage-specific notice before collecting CVs, identity/right-to-work documents, references, health information or background checks. Use a secure agreed channel and restrict access.
- Do not automatically add applicants to marketing lists. Any future-role retention needs its own documented basis, notice and retention period.
- Establish handling for minors and institution-sponsored placements before accepting their information.
- Do not use automatic ranking or AI candidate decisions without a separate legal, fairness, security and transparency review.

## Security and operations outside the HTML

- Enforce HTTPS, supported TLS and a single canonical host. Configure HSTS only on the intended HTTPS host after testing; the supplied example does not preload or include all subdomains.
- Apply host-level CSP, frame protection, MIME-type protection, referrer policy and permissions policy. Verify actual response headers; a file named `_headers` is ignored by unsupported hosts.
- Protect hosting, DNS, Git and mail accounts with MFA, least privilege and recovery procedures. Do not publish secrets in repositories or client-side code.
- Configure domain email authentication and test deliverability. Do not treat a mailto link as a secure upload channel.
- Inventory provider logs and backups; enforce approved retention and access restrictions. Assess the deployed host’s cookies independently.
- Maintain an incident process with jurisdiction-specific reporting triggers and deadlines; avoid assuming one global “72-hour rule”. Retain evidence and assign on-call ownership.
- Review third-party assets and dependencies, changes, link integrity and backups. This package has no runtime package dependency, but hosting still requires maintenance.
- If forms later post to a server, implement server validation, abuse controls, safe output handling, appropriate CSRF protections, encryption, logging minimisation and tested failure handling. Client-side validation alone is not a security boundary.

## Accessibility release evidence

Use WCAG 2.2 AA as the design/testing target. Complete keyboard-only operation, screen-reader tests on desktop/mobile, focus visibility, accessible names, validation announcements, contrast, 200%/400% zoom, 320 CSS-pixel reflow and reduced-motion checks. Test with disabled JavaScript and relevant assistive technologies. An automated scan cannot establish full conformance. Update the accessibility statement with actual findings and a remediation owner, not a blanket pass claim.

Source: [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Launch approval record to complete

- Legal/entity/address verified by: ______ Date: ______
- Privacy owner and processing inventory approved by: ______
- Target jurisdictions and legal review recorded by: ______
- Provider contracts, transfer and retention arrangements approved by: ______
- Recruitment terms and process approved by: ______
- Accessibility review and remaining issues accepted by: ______
- Domain, HTTPS, email and host headers verified by: ______
- SEO indexing changes and sitemap checked by: ______

Open items are not resolved by downloading this package. Public-content indexing is enabled at the user’s request. Keep separate staging environments private and noindex; complete the relevant operational and deployment checks before production publication.
