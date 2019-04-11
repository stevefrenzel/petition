(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const { requireLoggedInUser, requireSignature } = require("./middleware");

    app.get("/credits", requireLoggedInUser, requireSignature, (req, res) => {
        db.getAmountOfSigners()
            .then(data => {
                let totalAmountSigners = data.rows.length;
                res.render("credits", {
                    title: "Credits",
                    layout: "main",
                    amountSigners: totalAmountSigners
                });
            })
            .catch(err => {
                console.log("GET /credits getAmountOfSigners() error: ", err);
            });
    });
})();
