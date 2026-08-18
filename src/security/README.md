# Security boundary

Only server-side code may read `DATABASE_URL`, `D360_API_KEY`, `OPENAI_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, session secrets, or field-encryption keys. Do not use public-prefixed variants for these values, serialize them into page props, or include them in browser bundles and logs.
