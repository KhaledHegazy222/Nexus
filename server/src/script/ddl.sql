-- drop all tables
drop table course_quiz_question;
drop table purchase;
drop table lesson_token;
drop table s3_hidden_video_id;
drop table course;
drop table instructor_contacts;
drop table instructor_data;
drop table reset_password;
drop table verification;
drop table account;

-- Create the 'account' table
CREATE TABLE account (
  id SERIAL PRIMARY KEY,
  active BOOL DEFAULT 'false',
  mail VARCHAR(255) UNIQUE NOT NULL CHECK (mail ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
  role VARCHAR(255) NOT NULL DEFAULT 'student',
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

-- Create the 'verification' table
CREATE TABLE verification (
  account_id INT NOT NULL,
  verification_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES account (id)
);

-- Create the 'reset_password' table
CREATE TABLE reset_password (
  account_id INT NOT NULL,
  reset_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES account (id)
);

-- Create the 'instructor_data' table
CREATE TABLE instructor_data (
  account_id INT NOT NULL,
  pic_id VARCHAR(255),
  bio TEXT,
  contacts JSON,
  FOREIGN KEY (account_id) REFERENCES account (id)
);

-- Create the 'course' table
CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  level VARCHAR(255),
  field VARCHAR(255),
  department VARCHAR(255),
  price NUMERIC NOT NULL,
  description TEXT,
  what_you_will_learn JSON,
  requirements JSON,
  content JSON,
  publish BOOL DEFAULT 'false',
  FOREIGN KEY (author_id) REFERENCES account (id)
);

-- Create the 's3_hidden_video_id' table
CREATE TABLE s3_hidden_video_id (
  public_id VARCHAR(255) UNIQUE NOT NULL,
  hidden_id VARCHAR(255) UNIQUE NOT NULL
);

-- Create the 'lesson_token' table
CREATE TABLE lesson_token (
  token VARCHAR(255) UNIQUE NOT NULL
);

-- Create the 'purchase' table
CREATE TABLE purchase (
  account_id INT NOT NULL,
  course_id INT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES account (id),
  FOREIGN KEY (course_id) REFERENCES course (id)
);

-- Create the 'course_quiz_question' table
CREATE TABLE course_quiz_question (
  id SERIAL PRIMARY KEY,
  quiz_id VARCHAR(255) NOT NULL,
  course_id INT NOT NULL,
  idx_order INT NOT NULL,
  title TEXT NOT NULL,
  answer TEXT NOT NULL,
  options JSON NOT NULL,
  FOREIGN KEY (course_id) REFERENCES course (id)
);
