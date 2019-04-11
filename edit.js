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

    app.post("/edit", (req, res) => {
        res.redirect("/credits");
    });
})();
