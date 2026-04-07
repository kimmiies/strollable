CREATE TYPE feature_type_enum AS ENUM (
  'step_free_entrance',
  'accessible_bathroom',
  'change_table'
);

CREATE TYPE feature_status_enum AS ENUM (
  'unknown',
  'reported',
  'confirmed',
  'disputed'
);

CREATE TABLE features (
  id               UUID                 PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID                 NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  feature_type     feature_type_enum    NOT NULL,
  value            TEXT,                -- 'yes' | 'no' | null (winning consensus)
  status           feature_status_enum  NOT NULL DEFAULT 'unknown',
  report_count     INTEGER              NOT NULL DEFAULT 0,
  yes_count        INTEGER              NOT NULL DEFAULT 0,
  no_count         INTEGER              NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  UNIQUE(establishment_id, feature_type)
);

CREATE INDEX features_establishment_idx ON features(establishment_id);
CREATE INDEX features_status_idx        ON features(status);

CREATE TRIGGER features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

-- Auto-seed all 3 feature rows when a new establishment is created
CREATE OR REPLACE FUNCTION seed_establishment_features()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO features (establishment_id, feature_type, status)
  VALUES
    (NEW.id, 'step_free_entrance', 'unknown'),
    (NEW.id, 'accessible_bathroom', 'unknown'),
    (NEW.id, 'change_table',        'unknown');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_establishment_created
  AFTER INSERT ON establishments
  FOR EACH ROW EXECUTE PROCEDURE seed_establishment_features();
