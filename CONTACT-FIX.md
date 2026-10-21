# Contact page and duplicate navigation correction

Extract this patch into F:\ukjobalert-new-theme and replace matching files. Keep your .env.local unchanged.

Stop the running server with Ctrl+C. Run:

    cd /d F:\ukjobalert-new-theme
    if exist .next rmdir /s /q .next
    npm run build
    npm run start

Open http://localhost:3000/contact and refresh with Ctrl+F5.

The contact page now uses only the shared white header, readable field labels, a responsive help sidebar and an enquiry card. Remaining duplicate navigation components have also been removed from FAQ, candidates, policy, guide and legacy account pages. Page titles and dashboard tools are retained.

Email enquiries: the supplied project had no contact delivery endpoint or support address. This patch does not pretend messages have been delivered. The help centre and verification links work independently. To enable opening an email draft in the visitor's email app, add NEXT_PUBLIC_SUPPORT_EMAIL=your-real-support-address to .env.local and rebuild. The visitor still needs to send that draft in their email app; this is not server-side delivery.

Validation: production build and local page HTTP checks are reported in the handoff. Desktop/mobile screenshots were not available in this environment.
