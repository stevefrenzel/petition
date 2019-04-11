(function() {
    "use strict";

    const { app } = require("./index");
    const { requireLoggedInUser, requireNoSignature } = require("./middleware");

    app.get("/profile", requireLoggedInUser, requireNoSignature, (req, res) => {
        res.render("profile", {
            title: "Profile",
            layout: "main"
        });
    });

    app.post(
        "/profile",
        requireLoggedInUser,
        requireNoSignature,
        (req, res) => {
            res.redirect("/petition");
        }
    );
})();
