# UKJobAlert SEO fixes — 21 October 2026

## Install and run on Windows CMD
1. Back up your current project. Extract this ZIP into a new folder.
2. Copy your existing `.env.local` into the extracted project. Do not share it.
3. Open CMD in the extracted project folder and run:

```bat
npm ci
npm run test:seo
npm run build
npm run start
```

For development, run `npm run dev` instead of build/start.
Keep these existing Vercel environment variables configured:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
Keep all other existing integration variables. The ZIP contains no credentials.
Set `NEXT_PUBLIC_SUPPORT_EMAIL` to a real monitored address if you want the existing contact form enabled.

## Changes
- Server-rendered homepage vacancies using the same verified-employer feed as the public API; existing design and interactions retained.
- Unique homepage and jobs metadata, page-level canonicals, missing privacy/security/site-map metadata, and employer profile metadata.
- Filtered job search URLs use noindex, follow and canonical /jobs. Curated remote/visa landing pages remain indexable.
- Account, employer, admin, candidate and authentication areas have noindex coverage; X-Robots-Tag headers reinforce the page metadata. Robots.txt permits crawling of these pages so crawlers can see noindex. This is not an access-control mechanism.
- /privacy permanently redirects to /privacy-policy.
- Sitemap removes candidate pages, includes existing career/remote/visa/help pages, uses updated_at for modified jobs, and excludes expired/quarantined jobs.
- Three audited test slugs are quarantined in lib/job-publication.ts. Public feeds exclude them; direct URLs return HTTP 410. Database rows are not deleted and remain manageable in the employer dashboard.
- JobPosting employment types normalized (FULL_TIME, PART_TIME, INTERN, etc.); Remote is not misrepresented as an employment type. Schema omitted when location/application route is missing.
- Repetitive placeholder descriptions rejected in create/edit publication endpoints; reopening quarantined records rejected.
- Internal draft/editor notes removed from public privacy/terms pages. Operator-specific privacy details still need the site owner's review; no legal identity, retention period, or support contact has been invented.
- Historical source backups excluded from TypeScript compilation.

## Verification
- npm ci completed using the existing dependency lockfile.
- TypeScript compilation passed.
- Targeted ESLint passed without errors.
- 4 automated SEO/publication tests passed (`npm run test:seo`).
- Production build passed (54 static pages) with local test-only Supabase settings, not production credentials.
- Local production HTTP tests with fixture database responses passed for homepage SSR, jobs/canonical, filtered noindex, valid JobPosting schema, test-record 410, account noindex header, robots, sitemap, public jobs API and privacy content.
- Production database/authentication/email/application workflows were not exercised. Real database credentials were not supplied.

## Deploy checklist
Upload/commit the updated source to your existing Vercel project and deploy with your real environment variables. No deployment has been performed by this task.
After deployment, confirm /account has noindex and the three test URLs return 410. Resubmit https://www.ukjobalert.com/sitemap.xml in Search Console and inspect a real vacancy.
Publish genuine vacancies with accurate descriptions, locations and application destinations. Do not reuse the quarantined test records as real vacancies; create new records.
The live deployment inspected earlier differed from this uploaded ZIP (for example, account noindex already existed in this source), so confirm the correct source folder is deployed.

## Scope and remaining product setup
This is an SEO repair, not a complete product rebuild. Search Console performance data was not available. Ranking improvements are not guaranteed.
The existing Companies directory uses an empty static array; wiring that directory to live company data remains separate product work. Individual company profile pages retain their live data access.
The contact form requires your configured support email. Review final privacy/terms content against your real operation.

## Custom logo repair
- Shared header now uses your existing /ukjobalert-logo.png (dark text for the white header), with responsive dimensions and no cropping. Existing logo image bytes are unchanged.
- Homepage/public API now reads company_logo_url instead of returning an empty logo. Homepage, jobs list and job detail employer card render the uploaded company image.
- Missing or failed company images fall back to company initials.
- Production build passed with local fixture settings. Local HTTP checks passed for the header image, company image markup on all three page types, public API logo value, and the logo asset response. Production records without an uploaded image still show initials.

## Registration layout repair
- Removed secondary desktop/mobile logos from /register; shared header is the only logo.
- Wider form card, larger text/inputs, stronger contrast, responsive stacked layout.
- Accessible native account-type radio buttons with visible checked states and loading lock.
- Associated field labels, visible 8-character password rule and descriptive show/hide button.
- Existing Supabase registration handling retained.
- Production build and targeted lint passed. Local production HTML checks confirmed single logo, radios, associated labels and password help. Browser visual/interaction testing was unavailable because the browser download failed; real signup/email verification was not tested.
