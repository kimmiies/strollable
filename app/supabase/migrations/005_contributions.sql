CREATE TYPE contribution_type_enum AS ENUM ('report', 'verify', 'scout');

CREATE TABLE contributions (
  id                UUID                     PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID                     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  establishment_id  UUID                     NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  feature_id        UUID                     NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  contribution_type contribution_type_enum   NOT NULL,
  value             TEXT                     NOT NULL,  -- 'yes' | 'no'
  comment           TEXT,
  photo_url         TEXT,
  created_at        TIMESTAMPTZ              NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, feature_id)  -- one vote per user per feature; upsert on change
);

CREATE INDEX contributions_user_idx          ON contributions(user_id);
CREATE INDEX contributions_establishment_idx ON contributions(establishment_id);
CREATE INDEX contributions_feature_idx       ON contributions(feature_id);

-- After each contribution insert/update, recalculate the parent feature's status
CREATE OR REPLACE FUNCTION recalculate_feature_status()
RETURNS TRIGGER AS $$
DECLARE
  v_yes_count   INTEGER;
  v_no_count    INTEGER;
  v_total       INTEGER;
  v_new_status  feature_status_enum;
  v_new_value   TEXT;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE value = 'yes'),
    COUNT(*) FILTER (WHERE value = 'no'),
    COUNT(*)
  INTO v_yes_count, v_no_count, v_total
  FROM contributions
  WHERE feature_id = NEW.feature_id;

  IF v_total = 0 THEN
    v_new_status := 'unknown';
    v_new_value  := NULL;
  ELSIF v_total = 1 THEN
    v_new_status := 'reported';
    v_new_value  := NULL;
  ELSIF v_yes_count >= 2 AND v_yes_count > v_no_count THEN
    v_new_status := 'confirmed';
    v_new_value  := 'yes';
  ELSIF v_no_count >= 2 AND v_no_count > v_yes_count THEN
    v_new_status := 'confirmed';
    v_new_value  := 'no';
  ELSIF v_yes_count >= 2 AND v_no_count >= 2 THEN
    v_new_status := 'disputed';
    v_new_value  := NULL;
  ELSE
    -- Only one side has reached 2+ but there are mixed votes
    IF v_yes_count > v_no_count THEN
      v_new_status := 'confirmed';
      v_new_value  := 'yes';
    ELSIF v_no_count > v_yes_count THEN
      v_new_status := 'confirmed';
      v_new_value  := 'no';
    ELSE
      v_new_status := 'disputed';
      v_new_value  := NULL;
    END IF;
  END IF;

  UPDATE features
  SET
    status       = v_new_status,
    value        = v_new_value,
    report_count = v_total,
    yes_count    = v_yes_count,
    no_count     = v_no_count
  WHERE id = NEW.feature_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_contribution_created
  AFTER INSERT OR UPDATE ON contributions
  FOR EACH ROW EXECUTE PROCEDURE recalculate_feature_status();
