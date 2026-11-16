ALTER TABLE totp_entries ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_totp_entries_user_enabled_sort
  ON totp_entries(user_id, enabled DESC, sort_order ASC, id DESC);
