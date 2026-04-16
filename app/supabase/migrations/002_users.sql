CREATE TABLE users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT       NOT NULL,
  email       TEXT        NOT NULL,
  avatar_url  TEXT,
  badge_flags JSONB       NOT NULL DEFAULT '{"founding_reporter":false}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

-- Auto-create user profile on signup
-- Also grants founding_reporter badge to the first 100 users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_count INTEGER;
  v_is_founding BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO v_user_count FROM public.users;
  v_is_founding := v_user_count < 100;

  INSERT INTO public.users (id, display_name, email, badge_flags)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    jsonb_build_object('founding_reporter', v_is_founding)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
