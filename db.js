(function() {
    "use strict";

    const spicedPg = require("spiced-pg");
    const db = spicedPg(
        process.env.DATABASE_URL ||
            "postgres:postgres:postgres@localhost:5432/tabasco-petition"
    );

    exports.addUserData = function addUserData(user_id, signature) {
        let query = `INSERT INTO signatures (user_id, signature) VALUES ($1, $2) RETURNING id;`;
        let parameters = [user_id || null, signature || null];
        return db.query(query, parameters);
    };

    exports.getAmountOfSigners = function getAmountOfSigners() {
        let query = `SELECT * FROM signatures;`;
        return db.query(query);
    };

    exports.registerInfo = function registerInfo(
        first_name,
        last_name,
        email_address,
        password
    ) {
        let query = `INSERT INTO users (first_name, last_name, email_address, password) VALUES ($1, $2, $3, $4) RETURNING id;`;
        let parameters = [
            first_name || null,
            last_name || null,
            email_address || null,
            password || null
        ];
        return db.query(query, parameters);
    };

    exports.getHashedPassword = function getHashedPassword(email_address) {
        let query = `SELECT password, id FROM users WHERE email_address = $1`;
        let parameters = [email_address || null];
        return db.query(query, parameters);
    };

    exports.checkIfSigned = function checkIfSigned(user_id) {
        let query = `SELECT id FROM signatures WHERE user_id = $1`;
        let parameters = [user_id || null];
        return db.query(query, parameters);
    };

    exports.sendAdditionalInfo = function sendAdditionalInfo(
        age,
        city,
        url,
        user_id
    ) {
        let query = `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id`;
        let parameters = [
            age || null,
            city || null,
            url || null,
            user_id || null
        ];
        return db.query(query, parameters);
    };

    exports.getSignees = function getSignees() {
        let query = `SELECT first_name, last_name, age, city, url
        FROM users
        JOIN signatures
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON users.id  = user_profiles.user_id`;
        return db.query(query);
    };

    // work in progress
    // configure so it deletes signature from table

    exports.deleteSignature = function deleteSignature() {
        let query = `SELECT id FROM signatures WHERE user_id = $1`;
        let parameters = [user_id || null];
        return db.query(query, parameters);
    };
})();
