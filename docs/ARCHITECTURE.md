# Avexa Insurance CRM architecture

## Deployment shape

Avexa CRM is a modular monolith: one React/vinext Node application on AWS Lightsail, one PostgreSQL database on the same server initially, one background worker process, private Amazon S3 document storage, and Amazon SQS for durable asynchronous work.

Production runs from `/var/www/avexa-crm` as `avexa-crm.service`. Nginx exposes only `https://crm.avexainsurance.ca` and proxies to `127.0.0.1:3000`; port 3000 is not public. The browser never receives database, 360dialog, OpenAI, S3, or AWS credentials.

## Module boundaries

The canonical logical boundaries are under `src/modules`: `auth`, `dashboard`, `clients`, `drivers`, `vehicles`, `quotes`, `whatsapp`, `messages`, `documents`, `ai/messages`, `ai/documents`, `workflows`, `followups`, `tasks`, `policies`, `analytics`, `notifications`, `users`, and `settings`. Framework-required routes and components may remain under `app`.

- Core modules communicate through explicit contracts instead of importing provider SDKs.
- `whatsapp` owns 360dialog-specific transport and maps provider payloads to normalized messages.
- `ai/messages` and `ai/documents` are separate, provider-neutral capabilities.
- `documents` owns private object metadata, access checks, and short-lived download URLs.
- `workflows` consumes normalized facts and suggestions; it does not call OpenAI or 360dialog directly.
- `pipelineStage` is a stable internal code. Human-readable labels are configuration.

Compatibility re-exports remain in `production/integrations/contracts.ts` while integrations move into these boundaries.

## Incoming WhatsApp flow

1. `POST /api/whatsapp/webhook` validates and normalizes the 360dialog payload inside the WhatsApp adapter.
2. PostgreSQL stores the original webhook in `webhook_events` using a unique provider event ID.
3. The same transaction upserts the client, conversation, and original message. A new phone number receives the `new_lead` pipeline stage.
4. The endpoint publishes a small message-ID payload to SQS and returns success immediately.
5. A worker retrieves protected media through the WhatsApp adapter, writes it to private S3, and invokes the message or document AI adapter.
6. Structured AI output is stored separately. Binding, coverage, underwriting, pricing commitments, and uncertain personal-data changes require staff approval.

The production webhook is `https://crm.avexainsurance.ca/api/whatsapp/webhook`. The API key is read only from `D360_API_KEY` on the server.

## Documents and S3

The bucket name is read from `S3_BUCKET_NAME`. Block Public Access must be enabled, with server-side encryption, least-privilege IAM permissions, lifecycle rules, and access logging. PostgreSQL stores object keys and metadata; staff downloads use short-lived presigned URLs after a server-side permission check.

Canonical object prefixes are:

```text
clients/{clientId}/drivers-license/{generatedFileId}
clients/{clientId}/vehicle-ownership/{generatedFileId}
clients/{clientId}/void-cheque/{generatedFileId}
clients/{clientId}/winter-tires/{generatedFileId}
clients/{clientId}/applications/{generatedFileId}
clients/{clientId}/policies/{generatedFileId}
```

Use generated identifiers for `clientId` and filenames. Never place names, licence numbers, policy numbers, addresses, phone numbers, or other personal information in object keys.

## Pipeline stages

`pipeline_stages.code` contains stable identifiers and `pipeline_stages.label` contains editable labels. Migration `0002` seeds the 13 canonical codes with an idempotent upsert. It intentionally does not delete or automatically remap legacy stages because that could move existing clients without review. Legacy codes can be mapped in a later data migration after production data is inspected.

## Security baseline

- Secrets are accessed only through server configuration and never through public-prefixed variables.
- Argon2id password hashing, secure `HttpOnly`/`SameSite` session cookies, CSRF protection, MFA-ready user records, and rate limits protect authentication and webhook routes.
- Authorization is enforced in server services for every client, document, policy, and administrative operation.
- Boundary validation, parameterized SQL, output escaping, and a restrictive content security policy are required.
- Audit events record actor, action, entity, correlation ID, timestamp, and safe change summaries without copying sensitive documents.
- PostgreSQL listens on `127.0.0.1`; automated encrypted backups are copied off-server and regularly restored in a drill.

## Production processes

- `avexa-crm.service`: Node web process on `127.0.0.1:3000` behind Nginx HTTPS.
- `worker`: separate Node process consuming the SQS analysis queue when enabled.
- `postgres`: PostgreSQL database `avexa_crm` owned by `avexa_crm_user`.
- `backup`: scheduled, encrypted database dump and verification job.

Health checks cover the web process, database connectivity, SQS publish access, and webhook freshness without exposing client data.
