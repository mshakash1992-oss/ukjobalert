UKJobAlert demo-data removal

Removed hardcoded job, company, candidate, saved-job and application records. Removed invented homepage counts and dashboard metrics. Fake detail URLs now show unavailable messages. Employer dashboard Supabase queries and verification code were not changed.

IMPORTANT: This is a CLEANUP, not a completed Supabase integration. Public jobs, companies, candidate directory, and job-seeker applications/saved jobs need real database queries before launch. The post-job page in the provided project is still a locked demo form, not a working publisher. Contact form delivery is not implemented.

Extract the full ZIP into a backup/new folder, do not overwrite your only project copy. Then run npm install and npm run build.
