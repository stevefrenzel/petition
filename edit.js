(function() {
    "use strict";

    const { app } = require("./index");
    const { requireLoggedInUser } = require("./middleware");

    app.get("/edit", requireLoggedInUser, (req, res) => {
        res.render("edit", {
            title: "Edit",
            layout: "main"
        });
    });

    app.post("/edit", requireLoggedInUser, (req, res) => {
        res.redirect("/credits");
    });
})();
