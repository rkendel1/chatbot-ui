ALTER TABLE profiles
ADD COLUMN user_city TEXT,
ADD COLUMN user_location TEXT,
ADD COLUMN user_type TEXT,
ADD COLUMN user_sentiment TEXT,
ADD COLUMN inferred_goal TEXT,
ADD COLUMN preferred_tone TEXT,
ADD COLUMN past_reports JSONB;