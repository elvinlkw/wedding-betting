CREATE DATABASE weddingbetting;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  question_text VARCHAR(255),
  question_text_fr VARCHAR(255),
  is_enabled BOOLEAN DEFAULT TRUE,
  is_answer_revealed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE question_choices (
  choice_id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
  is_right_answer BOOLEAN DEFAULT FALSE,
  choice_text VARCHAR(255) NOT NULL,
  choice_text_fr VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE user_answers (
  answer_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
  choice_id INT REFERENCES question_choices(choice_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE admin_user (
  admin_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE features (
  feature_id SERIAL PRIMARY KEY,
  feature_key VARCHAR(255) NOT NULL UNIQUE,
  feature_name VARCHAR(255) NOT NULL,
  feature_description VARCHAR(255),
  is_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE guests (
  guest_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  table_number SMALLINT,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO features (feature_key, feature_name, feature_description, is_enabled)
VALUES
  ('admin:questions:create', 'Create Question', 'Allows admin to create questions', TRUE),
  ('admin:questions:delete', 'Delete Question', 'Allows admin to delete questions', TRUE),
  ('admin:questions:update', 'Update Question', 'Allows admin to update questions', TRUE),
  ('public:game:view', 'Play Game', 'Allows public users to view and play the game', TRUE),
  ('public:navbar:login', 'Show Login Icon in Navbar', 'Displays login icon in the navigation bar', TRUE),
  ('public:page:seating', 'Show Seating Chart', 'Displays the seating chart on the public page', TRUE);