(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const { requireLoggedInUser } = require("./middleware");

    app.get("/signers", requireLoggedInUser, (req, res) => {
        db.getAmountOfSigners()
            .then(data => {
                let userNames = data.rows;
                res.render("signers", {
                    title: "Signers",
                    layout: "main",
                    userData: userNames
                });
            })
            .catch(err => {
                console.log("GET /signers getAmountOfSigners() error:", err);
            });
    });

    // GET FOR CITY NAMES
    // app.get("/signers/:city", (req, res) => {});
})();
