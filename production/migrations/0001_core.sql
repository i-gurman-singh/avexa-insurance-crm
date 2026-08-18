BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id),
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','invited')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE lookup_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  code text NOT NULL,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  color text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(category, code)
);

CREATE TABLE pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  sort_order integer NOT NULL,
  color text,
  is_terminal boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES pipeline_stages(id),
  assigned_user_id uuid REFERENCES users(id),
  full_name text,
  phone_e164 text NOT NULL UNIQUE,
  email citext,
  date_of_birth date,
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  marital_status text,
  lead_source_code text,
  status text NOT NULL DEFAULT 'active',
  custom_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  licence_number_encrypted bytea,
  licence_number_hash text,
  licence_class text,
  licence_expiry date,
  licensing_dates jsonb NOT NULL DEFAULT '{}'::jsonb,
  training jsonb NOT NULL DEFAULT '{}'::jsonb,
  experience jsonb NOT NULL DEFAULT '{}'::jsonb,
  convictions jsonb NOT NULL DEFAULT '[]'::jsonb,
  claims jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  vin text,
  year smallint,
  make text,
  model text,
  ownership text,
  usage text,
  annual_kilometres integer,
  winter_tires boolean,
  lienholder text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE client_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  from_stage_id uuid REFERENCES pipeline_stages(id),
  to_stage_id uuid NOT NULL REFERENCES pipeline_stages(id),
  changed_by uuid REFERENCES users(id),
  source text NOT NULL CHECK (source IN ('manual','rule','ai_suggestion_approved')),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_conversation_id text,
  unread_count integer NOT NULL DEFAULT 0,
  requires_response boolean NOT NULL DEFAULT false,
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_conversation_id)
);

CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  UNIQUE(provider, provider_event_id)
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_message_id text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('in','out')),
  kind text NOT NULL CHECK (kind IN ('text','image','document','audio','system')),
  body text,
  provider_media_id text,
  original_payload jsonb NOT NULL,
  delivery_status text,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_message_id)
);

CREATE TABLE message_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  intent text NOT NULL,
  confidence numeric(5,4) NOT NULL,
  structured_facts jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggestions jsonb NOT NULL DEFAULT '{}'::jsonb,
  model text NOT NULL,
  schema_version text NOT NULL,
  requires_human_review boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  message_id uuid REFERENCES messages(id),
  document_type_code text,
  object_key text NOT NULL UNIQUE,
  object_version_id text,
  original_filename text,
  content_type text NOT NULL,
  byte_size bigint NOT NULL,
  source text NOT NULL,
  processing_status text NOT NULL DEFAULT 'pending',
  verification_status text NOT NULL DEFAULT 'unverified',
  received_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE document_extractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  predicted_type text,
  type_confidence numeric(5,4),
  extracted_fields jsonb NOT NULL,
  model text NOT NULL,
  schema_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE document_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  extraction_id uuid NOT NULL REFERENCES document_extractions(id) ON DELETE CASCADE,
  verified_by uuid NOT NULL REFERENCES users(id),
  verified_fields jsonb NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES users(id),
  company_code text NOT NULL,
  quoted_at timestamptz NOT NULL,
  monthly_premium numeric(12,2),
  annual_premium numeric(12,2),
  coverage jsonb NOT NULL DEFAULT '{}'::jsonb,
  discounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL,
  expires_at timestamptz,
  is_selected boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  assigned_user_id uuid REFERENCES users(id),
  created_by uuid REFERENCES users(id),
  task_type_code text,
  title text NOT NULL,
  due_at timestamptz,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'todo',
  notes text,
  automation_source jsonb,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id),
  body text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id),
  selected_quote_id uuid REFERENCES quotes(id),
  policy_number_encrypted bytea,
  company_code text NOT NULL,
  status text NOT NULL,
  effective_at timestamptz,
  renewal_at timestamptz,
  completed_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  correlation_id text NOT NULL,
  ip_address inet,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX clients_stage_idx ON clients(stage_id);
CREATE INDEX clients_assignee_idx ON clients(assigned_user_id);
CREATE INDEX clients_name_search_idx ON clients USING gin (to_tsvector('simple', coalesce(full_name,'') || ' ' || coalesce(email::text,'')));
CREATE INDEX drivers_licence_hash_idx ON drivers(licence_number_hash);
CREATE INDEX vehicles_vin_idx ON vehicles(vin);
CREATE INDEX messages_conversation_time_idx ON messages(conversation_id, occurred_at DESC);
CREATE INDEX documents_client_received_idx ON documents(client_id, received_at DESC);
CREATE INDEX quotes_client_date_idx ON quotes(client_id, quoted_at DESC);
CREATE INDEX tasks_assignee_due_idx ON tasks(assigned_user_id, status, due_at);
CREATE INDEX audit_entity_idx ON audit_log(entity_type, entity_id, created_at DESC);

COMMIT;
