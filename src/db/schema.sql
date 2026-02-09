CREATE TABLE IF NOT EXISTS app_config (
  id integer PRIMARY KEY CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
