(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const { requireLoggedInUser } = require("./middleware");

    app.get("/credits", requireLoggedInUser, (req, res) => {
        db.getAmountOfSigners()
            .then(data => {
                let totalAmountSigners = data.rows.length;
                let getSignature = data.rows[0].signature;
                res.render("credits", {
                    title: "Credits",
                    layout: "main",
                    amountSigners: totalAmountSigners,
                    signature: getSignature
                });
            })
            .catch(err => {
                console.log("GET /credits getAmountOfSigners() error: ", err);
            });
    });
})();
