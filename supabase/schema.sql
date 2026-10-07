CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nickname text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  aircraft_type text NOT NULL,
  airline text NOT NULL,
  registration text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL,
  hint text,
  explanation text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL,
  correct_count integer NOT NULL,
  total_questions integer NOT NULL,
  accuracy numeric(5,2) NOT NULL,
  time_taken integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published questions are viewable by everyone" ON questions
FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage questions" ON questions
FOR ALL USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts" ON quiz_attempts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all quiz attempts" ON quiz_attempts
FOR ALL USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE TABLE IF NOT EXISTS aircraft_encyclopedia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  manufacturer text NOT NULL,
  first_flight text,
  typical_capacity text,
  range text,
  facts jsonb,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Encyclopedia data is viewable by everyone" ON aircraft_encyclopedia
FOR SELECT USING (true);
