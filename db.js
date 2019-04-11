(function() {
    "use strict";

    const spicedPg = require("spiced-pg");
    const db = spicedPg(
        process.env.DATABASE_URL ||
            "postgres:postgres:postgres@localhost:5432/tabasco-petition"
    );

    exports.addUserData = function addUserData(userId, signature) {
        let query = `INSERT INTO signatures (userId, signature) VALUES ($1, $2) RETURNING id;`;
        let parameters = [userId || null, signature || null];
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

    exports.checkIfSigned = function checkIfSigned(userId) {
        let query = `SELECT id FROM signatures WHERE userId = $1`;
        let parameters = [userId || null];
        return db.query(query, parameters);
    };
})();
