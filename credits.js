(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const { requireLoggedInUser } = require("./middleware");

    app.get("/credits", requireLoggedInUser, (req, res) => {
        Promise.all([
            db.getAmountOfSigners(),
            db.getSignatures(req.session.userId)
        ])
            .then(data => {
                console.log(data);
                let totalAmountSigners = data[0].rows.length;
                // not showing corresponding signature!
                let getSignature = data[1].rows[0].signature;
                console.log(getSignature);
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
