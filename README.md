# Avexa Insurance CRM

Avexa Insurance CRM (short name: Avexa CRM) is a WhatsApp-first insurance brokerage workspace. This repository contains the interactive React/vinext application, PostgreSQL schema migrations, and provider-neutral integration contracts.

## Canonical production configuration

| Setting | Value |
| --- | --- |
| Repository | `avexa-insurance-crm` |
| Environment | `production` |
| Domain | `https://crm.avexainsurance.ca` |
| Lightsail server | `avexa-insurance-crm-prod` |
| Application directory | `/var/www/avexa-crm` |
| systemd service | `avexa-crm.service` |
| Internal port | `3000` |
| PostgreSQL database | `avexa_crm` |
| PostgreSQL user | `avexa_crm_user` |
| PostgreSQL host/port | `127.0.0.1:5432` |
| AWS region | `ca-central-1` |

Port 3000 is internal only. Nginx terminates HTTPS and proxies the public domain to `127.0.0.1:3000`.

## Required environment variables

Copy `.env.example` to `.env` on the server and fill in secrets there. Never commit `.env` or expose server variables in frontend code.

- Core: `NODE_ENV`, `APP_URL`, `DATABASE_URL`, `SESSION_SECRET`, `FIELD_ENCRYPTION_KEY`
- AWS/S3: `AWS_REGION`, `S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Async processing: `AWS_SQS_ANALYSIS_QUEUE_URL`, `AWS_SQS_ANALYSIS_DLQ_URL`
- WhatsApp: `D360_API_KEY`
- OpenAI: `OPENAI_API_KEY`, `OPENAI_MESSAGE_MODEL`, `OPENAI_DOCUMENT_MODEL`
- Operations: `LOG_LEVEL`, `PRESIGNED_DOCUMENT_TTL_SECONDS`

`DATABASE_URL` uses this format only; replace `PASSWORD` on the server:

```text
postgresql://avexa_crm_user:PASSWORD@127.0.0.1:5432/avexa_crm
```

The WhatsApp webhook endpoint is `POST /api/whatsapp/webhook`, with production URL `https://crm.avexainsurance.ca/api/whatsapp/webhook`.

## Local installation

Prerequisites: Node.js 22.13 or newer and npm.

```bash
npm ci
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`. The current UI uses representative local data; provider credentials are server-only and are not required to review the interface.

## Build and verify

```bash
npm run build
npm test
```

## Database setup and migrations

PostgreSQL initially runs on the same Lightsail instance. Create the database and user as an administrator, using a strong password generated on the server:

```sql
CREATE USER avexa_crm_user WITH PASSWORD 'REPLACE_ON_SERVER';
CREATE DATABASE avexa_crm OWNER avexa_crm_user;
```

After `DATABASE_URL` is set, apply every SQL migration in order:

```bash
npm run db:migrate
```

`production/migrate.sh` records applied migration filenames in `schema_migrations` and does not re-run them. Migration `0002` inserts or updates the canonical pipeline stage codes without changing existing client foreign keys or deleting legacy stages.

## Production deployment on AWS Lightsail

Clone the repository into the canonical directory, install dependencies, build, migrate, and start the service:

```bash
sudo mkdir -p /var/www/avexa-crm
sudo chown -R "$USER":"$USER" /var/www/avexa-crm
git clone https://github.com/YOUR_ORG/avexa-insurance-crm.git /var/www/avexa-crm
cd /var/www/avexa-crm
npm ci
cp .env.example .env
nano .env
npm run build
npm run db:migrate
sudo systemctl enable --now avexa-crm.service
```

The service unit should use `/var/www/avexa-crm` as `WorkingDirectory`, load `/var/www/avexa-crm/.env`, set `PORT=3000`, and run `npm run start`. After updating the repository:

```bash
cd /var/www/avexa-crm
git pull --ff-only
npm ci
npm run build
npm run db:migrate
sudo systemctl restart avexa-crm.service
sudo systemctl status avexa-crm.service --no-pager
```

Configure Nginx to proxy `crm.avexainsurance.ca` to `http://127.0.0.1:3000`, then use Certbot for HTTPS. Do not open port 3000 in the Lightsail firewall.

## Infrastructure dependencies

- AWS Lightsail Ubuntu instance named `avexa-insurance-crm-prod`
- PostgreSQL on `127.0.0.1:5432`, with encrypted backups stored off-server
- Nginx and a trusted HTTPS certificate
- Private Amazon S3 bucket with Block Public Access and server-side encryption
- Amazon SQS analysis queue and dead-letter queue when background AI processing is enabled
- 360dialog WhatsApp account and webhook configured at the canonical endpoint
- OpenAI API access for separate message-understanding and document-understanding adapters
- Least-privilege IAM credentials or an instance role for S3/SQS

## Source organization

Framework routes and UI remain in `app/`. Provider-neutral business boundaries are documented under `src/modules/`; shared runtime configuration is in `src/shared/`, database configuration in `src/database/`, and secret-handling rules in `src/security/`. Detailed architecture and object-key conventions are in `docs/ARCHITECTURE.md`.

The UI is a working interactive prototype. Live PostgreSQL persistence, authentication, the webhook handler, 360dialog messaging, S3 upload/download, SQS workers, and OpenAI adapters still require implementation before production customer data is used.
