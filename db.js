(function() {
    "use strict";

    const spicedPg = require("spiced-pg");
    const db = spicedPg(
        process.env.DATABASE_URL ||
            "postgres:postgres:postgres@localhost:5432/tabasco-petition"
    );

    exports.addUserData = function addUserData(user_id, signature) {
        let query = `INSERT INTO signatures (user_id, signature)
        VALUES ($1, $2)
        RETURNING id;`;
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
        let query = `INSERT INTO users (first_name, last_name, email_address, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;`;
        let parameters = [
            first_name || null,
            last_name || null,
            email_address || null,
            password || null
        ];
        return db.query(query, parameters);
    };

    exports.getHashedPassword = function getHashedPassword(email_address) {
        let query = `SELECT password, id
        FROM users
        WHERE email_address = $1`;
        let parameters = [email_address || null];
        return db.query(query, parameters);
    };

    exports.checkIfSigned = function checkIfSigned(user_id) {
        let query = `SELECT id
        FROM signatures
        WHERE user_id = $1`;
        let parameters = [user_id || null];
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

    exports.getCitySigners = function getCitySigners(city) {
        let query = `SELECT first_name, last_name, age, url
        FROM users
        JOIN signatures
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1);`;
        let params = [city || null];
        return db.query(query, params);
    };

    exports.getUserInformation = function getUserInformation(user_id) {
        let query = `SELECT first_name, last_name, email_address, age, city, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = $1;`;
        let params = [user_id || null];
        return db.query(query, params);
    };

    exports.updateAgeCityUrl = function updateAgeCityUrl(
        age,
        city,
        url,
        user_id
    ) {
        let query = `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $1, city = $2, url = $3
        RETURNING id`;
        let parameters = [
            age || null,
            city || null,
            url || null,
            user_id || null
        ];
        return db.query(query, parameters);
    };

    exports.updateNamesEmail = function updateNamesEmail(
        first_name,
        last_name,
        email_address,
        user_id
    ) {
        let query = `UPDATE users
        SET first_name = $1, last_name = $2, email_address = $3
        WHERE id = $4;`;
        let parameters = [
            first_name || null,
            last_name || null,
            email_address || null,
            user_id || null
        ];
        return db.query(query, parameters);
    };

    exports.updateNamesEmailPassword = function updateNamesEmailPassword(
        first_name,
        last_name,
        email_address,
        password,
        user_id
    ) {
        let query = `UPDATE users
        SET first_name = $1, last_name = $2, email_address = $3, password = $4,
        WHERE id = $5;`;
        let parameters = [
            first_name || null,
            last_name || null,
            email_address || null,
            password || null,
            user_id || null
        ];
        return db.query(query, parameters);
    };

    exports.deleteSignature = function deleteSignature(id) {
        let query = `DELETE FROM signatures WHERE id = $1`;
        let parameters = [id || null];
        return db.query(query, parameters);
    };

    exports.getSignatures = function getSignatures(user_id) {
        let query = `SELECT signature
        FROM signatures
        WHERE user_id = $1;`;
        let parameters = [user_id || null];
        return db.query(query, parameters);
    };
})();
