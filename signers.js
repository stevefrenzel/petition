(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const { requireLoggedInUser } = require("./middleware");

    app.get("/signers", requireLoggedInUser, (req, res) => {
        db.getSignees()
            .then(data => {
                let userData = data.rows;
                res.render("signers", {
                    title: "Signers",
                    layout: "main",
                    userData
                });
            })
            .catch(err => {
                console.log("GET /signers getAmountOfSigners() error:", err);
            });
    });

    // ignoring stylesheet.css

    app.get("/signers/:city", requireLoggedInUser, (req, res) => {
        let city = req.params.city;
        db.getCitySigners(city).then(data => {
            let userData = data.rows;
            res.render("signers", {
                title: "Signers",
                layout: "main",
                userData
            });
        });
    });
})();
