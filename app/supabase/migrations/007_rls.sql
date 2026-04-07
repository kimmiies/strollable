-- Enable Row Level Security on all tables
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE features       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places   ENABLE ROW LEVEL SECURITY;

-- users: anyone can read; users can only write their own row
CREATE POLICY "users_select_all"   ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_own"   ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own"   ON users FOR UPDATE USING (auth.uid() = id);

-- establishments: anyone can read; authenticated users can create
CREATE POLICY "establishments_select_all"  ON establishments FOR SELECT USING (true);
CREATE POLICY "establishments_insert_auth" ON establishments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- features: anyone can read; only service role (trigger) can write
CREATE POLICY "features_select_all" ON features FOR SELECT USING (true);
-- Feature writes happen via DB trigger (service role) — no client policy needed

-- contributions: anyone can read; users can insert/update their own
CREATE POLICY "contributions_select_all"  ON contributions FOR SELECT USING (true);
CREATE POLICY "contributions_insert_own"  ON contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contributions_update_own"  ON contributions FOR UPDATE
  USING (auth.uid() = user_id);

-- saved_places: users manage only their own saved places
CREATE POLICY "saved_select_own"  ON saved_places FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own"  ON saved_places FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own"  ON saved_places FOR DELETE  USING (auth.uid() = user_id);
