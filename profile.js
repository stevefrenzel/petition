(function() {
    "use strict";

    const { app } = require("./index");
    const { requireLoggedInUser, requireNoSignature } = require("./middleware");
    const db = require("./db");
    const urlCleaner = require("./urlCleaner");

    app.get("/profile", requireLoggedInUser, requireNoSignature, (req, res) => {
        res.render("profile", {
            title: "Profile",
            layout: "main"
        });
    });

    app.post("/profile", (req, res) => {
        let cleanUrl = urlCleaner.urlCleaner(req.body.signersHomepage);
        db.updateAgeCityUrl(
            req.body.signersAge,
            req.body.signersCity,
            cleanUrl,
            req.session.userId
        );
        res.redirect("/petition");
    });
})();
