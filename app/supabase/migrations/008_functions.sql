-- Returns establishments within radius_meters of a point with feature data rolled up as JSONB
CREATE OR REPLACE FUNCTION get_establishments_near(
  p_lat          DOUBLE PRECISION,
  p_lng          DOUBLE PRECISION,
  p_radius       INTEGER DEFAULT 1500,
  p_type         TEXT    DEFAULT NULL
)
RETURNS TABLE (
  id               UUID,
  place_id         TEXT,
  name             TEXT,
  address          TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  type             TEXT,
  hours            JSONB,
  phone            TEXT,
  website          TEXT,
  google_rating    NUMERIC,
  distance_meters  FLOAT,
  features         JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.place_id,
    e.name,
    e.address,
    e.lat,
    e.lng,
    e.type,
    e.hours,
    e.phone,
    e.website,
    e.google_rating,
    ST_Distance(
      e.location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    )::FLOAT AS distance_meters,
    COALESCE(
      jsonb_object_agg(
        f.feature_type,
        jsonb_build_object(
          'id',            f.id,
          'establishment_id', f.establishment_id,
          'feature_type',  f.feature_type,
          'value',         f.value,
          'status',        f.status,
          'report_count',  f.report_count,
          'yes_count',     f.yes_count,
          'no_count',      f.no_count
        )
      ) FILTER (WHERE f.id IS NOT NULL),
      '{}'::jsonb
    ) AS features
  FROM establishments e
  LEFT JOIN features f ON f.establishment_id = e.id
  WHERE ST_DWithin(
    e.location,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    p_radius
  )
  AND (p_type IS NULL OR e.type = p_type)
  GROUP BY e.id, e.place_id, e.name, e.address, e.lat, e.lng,
           e.type, e.hours, e.phone, e.website, e.google_rating, e.location
  ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
