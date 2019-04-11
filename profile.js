(function() {
    "use strict";

    const { app } = require("./index");
    const { requireLoggedInUser, requireNoSignature } = require("./middleware");
    const db = require("./db");

    app.get("/profile", requireLoggedInUser, requireNoSignature, (req, res) => {
        res.render("profile", {
            title: "Profile",
            layout: "main"
        });
    });

    app.post("/profile", (req, res) => {
        db.sendAdditionalInfo(
            req.body.signersAge,
            req.body.signersCity,
            req.body.signersHomepage,
            req.session.userId
        );
        res.redirect("/petition");
    });
})();
