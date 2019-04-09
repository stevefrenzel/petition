DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- and get info from joining w/ users table
