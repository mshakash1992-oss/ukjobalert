# UKJobAlert — corrected shared theme

## Install in your existing Windows project
Stop npm run dev with Ctrl+C. Back up your project. Extract the UPDATE-ONLY archive into F:\ukjobalert-new-theme and replace matching files. It contains changed source files and assets only. Your .env.local, database configuration, package.json and lockfile stay in place.

In CMD:

    cd /d F:\ukjobalert-new-theme
    if exist .next rmdir /s /q .next
    npm run dev

Open http://localhost:3000 and refresh with Ctrl+F5. For a new folder using the full source archive, also copy your existing .env.local and run npm ci first.

## Corrections
- Homepage components have unique CSS names, so old image overlays, white icons, text shadows and hero underline rules cannot override them.
- Search layout is positioned within its hero container; cards use explicit layout and icon colours.
- Shared white navigation on all routes, with active links and a native mobile menu. Employer/candidate account links and sign-out are preserved in account routes.
- Consistent navy/red/white palette, form styling, spacing and card treatment across page CSS modules: jobs, job details, companies, company profile, candidates, login/register/reset, account screens, employer screens, contact, about, FAQ and policy pages.
- Legacy public-page headers removed so the shared navigation is not duplicated. The candidate dashboard retains its separate profile/menu toolbar.
- Five incorrect external city photos replaced with local Wikimedia photos of the named cities. London uses the existing supplied London image. Credits and licences are available through the homepage footer.
- Footer placeholders replaced with real job posting and job alert links; candidate shortcuts open the correct subpages.

## Verification limits
Production build and TypeScript results are reported in the delivery message. Browser screenshot verification is unavailable in this environment. Live sign-in, application submissions and database writes were not tested or changed. No public deployment was performed.

## Image asset
The previously generated recruitment hero remains at public/images/grow-team-hero.png. Built-in image generation prompt: wide photorealistic Westminster and Big Ben background with three recruiters at a laptop on the right, navy negative space on the left, white curve and red circles; no text or interface.

City image author, source and licence details: public/photo-credits.html.
