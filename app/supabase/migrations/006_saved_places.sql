CREATE TABLE saved_places (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  establishment_id UUID        NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, establishment_id)
);

CREATE INDEX saved_places_user_idx ON saved_places(user_id);
