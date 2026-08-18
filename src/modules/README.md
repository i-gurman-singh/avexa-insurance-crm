# Avexa CRM module boundaries

The canonical business modules are:

```text
auth/                 sessions, users, roles, permissions
dashboard/            read models for the broker workspace
clients/              client records and custom fields
drivers/              driver records and insurance history
vehicles/             vehicles, use, ownership, and risk details
quotes/               carrier quotes and comparisons
whatsapp/             provider-neutral messaging plus 360dialog adapter
messages/             normalized messages and conversations
documents/            document metadata and private storage contracts
ai/messages/          message understanding
ai/documents/         document understanding and extraction
workflows/            deterministic rules over normalized events
followups/            scheduled client followups
tasks/                actionable work and assignment
policies/             bound/completed policy records
analytics/            read-only metrics and aggregates
notifications/        in-application staff notifications
users/                staff profiles and status
settings/             configurable lookup values and pipeline labels
```

UI routes may live in `app/`, but provider SDKs and secret access must remain inside their integration modules. Modules depend on contracts, not concrete providers.
