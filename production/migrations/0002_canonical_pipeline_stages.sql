BEGIN;

INSERT INTO pipeline_stages (code, label, sort_order, color, is_terminal, is_active)
VALUES
  ('new_lead', 'New Lead', 10, 'slate', false, true),
  ('quote_requested', 'Quote Requested', 20, 'blue', false, true),
  ('quoting', 'Quoting', 30, 'blue', false, true),
  ('quote_provided', 'Quote Provided', 40, 'purple', false, true),
  ('follow_up', 'Follow Up', 50, 'amber', false, true),
  ('interested', 'Interested', 60, 'green', false, true),
  ('ready_to_bind', 'Ready to Bind', 70, 'green', false, true),
  ('documents_requested', 'Documents Requested', 80, 'amber', false, true),
  ('documents_received', 'Documents Received', 90, 'blue', false, true),
  ('binding', 'Binding', 100, 'orange', false, true),
  ('policy_completed', 'Policy Completed', 110, 'green', true, true),
  ('lost', 'Lost', 120, 'red', true, true),
  ('future_follow_up', 'Future Follow Up', 130, 'purple', true, true)
ON CONFLICT (code) DO UPDATE SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order,
  color = EXCLUDED.color,
  is_terminal = EXCLUDED.is_terminal,
  is_active = true;

-- Existing non-canonical stages and client stage_id values are intentionally preserved.
-- Inspect production usage before adding a separate legacy-code remapping migration.

COMMIT;
