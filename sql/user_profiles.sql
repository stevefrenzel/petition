DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(300),
    url VARCHAR (600),
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE
);
