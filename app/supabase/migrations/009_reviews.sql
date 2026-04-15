-- Place-level reviews: star rating + optional comment/photo.
-- One row per submission of the contribution modal. Feature votes
-- still live in `contributions` — reviews are the place-level part.

CREATE TABLE reviews (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  establishment_id  UUID        NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  rating            SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment           TEXT,
  photo_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, establishment_id)
);

CREATE INDEX reviews_establishment_idx ON reviews(establishment_id);
CREATE INDEX reviews_user_idx          ON reviews(user_id);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

-- Keep establishments.community_rating / rating_count in sync with reviews.
CREATE OR REPLACE FUNCTION recalculate_establishment_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_establishment_id UUID;
  v_avg              NUMERIC(2,1);
  v_count            INTEGER;
BEGIN
  v_establishment_id := COALESCE(NEW.establishment_id, OLD.establishment_id);

  SELECT ROUND(AVG(rating)::numeric, 1), COUNT(*)
  INTO v_avg, v_count
  FROM reviews
  WHERE establishment_id = v_establishment_id;

  UPDATE establishments
  SET community_rating = v_avg,
      rating_count     = v_count
  WHERE id = v_establishment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE recalculate_establishment_rating();

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all"  ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own"  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own"  ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own"  ON reviews FOR DELETE USING (auth.uid() = user_id);
