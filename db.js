(function() {
    "use strict";

    const spicedPg = require("spiced-pg");
    const db = spicedPg(
        "postgres:postgres:postgres@localhost:5432/tabasco-petition"
    );

    exports.addUserData = function addUserData(
        first_name,
        last_name,
        signature
    ) {
        let query =
            "INSERT INTO signatures (first_name, last_name, signature) VALUES ($1, $2, $3) RETURNING id;";
        let parameters = [
            first_name || null,
            last_name || null,
            signature || null
        ];
        return db.query(query, parameters);
    };

    exports.getNames = function getNames() {
        let query = "SELECT * FROM signatures;";
        return db.query(query);
    };

    exports.registerInfo = function registerInfo(
        first_name,
        last_name,
        email_address,
        password
    ) {
        let query =
            "INSERT INTO users (first_name, last_name, email_address, password) VALUES ($1, $2, $3, $4) RETURNING id;";
        let parameters = [
            first_name || null,
            last_name || null,
            email_address || null,
            password || null
        ];
        return db.query(query, parameters);
    };
})();
