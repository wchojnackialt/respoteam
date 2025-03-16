-- Create tables for our research platform

-- Research Rooms
CREATE TABLE research_rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('moderator', 'respondent')),
  research_room_id INTEGER REFERENCES research_rooms(id),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Discussions
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  type TEXT NOT NULL DEFAULT 'close-ended' CHECK (type IN ('open-ended', 'close-ended', 'concept-rating')),
  allow_multiple BOOLEAN DEFAULT FALSE,
  ask_for_comments BOOLEAN DEFAULT TRUE,
  show_other_responses BOOLEAN DEFAULT FALSE,
  research_room_id INTEGER REFERENCES research_rooms(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Answers (options for discussions)
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  discussion_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Responses
CREATE TABLE responses (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Response Answers (junction table for responses and answers)
CREATE TABLE response_answers (
  response_id INTEGER REFERENCES responses(id) ON DELETE CASCADE NOT NULL,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (response_id, answer_id)
);

-- Create RLS policies
ALTER TABLE research_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for research_rooms
CREATE POLICY "Research rooms are viewable by authenticated users"
  ON research_rooms FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for discussions
CREATE POLICY "Discussions are viewable by authenticated users"
  ON discussions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert discussions for their research room"
  ON discussions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'moderator'
      AND profiles.research_room_id = research_room_id
    )
  );

-- Create policies for answers
CREATE POLICY "Answers are viewable by authenticated users"
  ON answers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert answers"
  ON answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      JOIN discussions ON discussions.research_room_id = profiles.research_room_id
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'moderator'
      AND discussions.id = discussion_id
    )
  );

-- Create policies for responses
CREATE POLICY "Responses are viewable by authenticated users"
  ON responses FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own responses"
  ON responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for response_answers
CREATE POLICY "Response answers are viewable by authenticated users"
  ON response_answers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own response answers"
  ON response_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM responses
      WHERE responses.id = response_id
      AND responses.user_id = auth.uid()
    )
  );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_research_rooms_updated_at
BEFORE UPDATE ON research_rooms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON discussions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at
BEFORE UPDATE ON responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

