CREATE TABLE establishments (
  id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id         TEXT           NOT NULL UNIQUE,
  name             TEXT           NOT NULL,
  address          TEXT           NOT NULL,
  lat              DOUBLE PRECISION NOT NULL,
  lng              DOUBLE PRECISION NOT NULL,
  type             TEXT           NOT NULL DEFAULT 'other',
  hours            JSONB,
  phone            TEXT,
  website          TEXT,
  google_rating    NUMERIC(2,1),
  google_data_json JSONB,
  community_rating NUMERIC(2,1),
  rating_count     INTEGER        NOT NULL DEFAULT 0,
  location         GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  ) STORED,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX establishments_location_idx ON establishments USING GIST(location);
CREATE INDEX establishments_place_id_idx ON establishments(place_id);
CREATE INDEX establishments_type_idx     ON establishments(type);

CREATE TRIGGER establishments_updated_at
  BEFORE UPDATE ON establishments
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
