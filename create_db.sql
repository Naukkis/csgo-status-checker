DROP DATABASE IF EXISTS statuschecker;
CREATE DATABASE statuschecker;

\c statuschecker;

CREATE TABLE matches(
	id SERIAL PRIMARY KEY,
	players	TEXT[] NOT NULL,
	end_score TEXT NOT NULL
);

CREATE TABLE users (
	 user_id TEXT UNIQUE PRIMARY KEY,
	 steamid64 TEXT NOT NULL,
	 username TEXT,
	 email TEXT
);

CREATE TABLE saved_matches (
	id SERIAL PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users(user_id),
	match_id INTEGER NOT NULL REFERENCES matches(id)
);