(function() {
    "use strict";

    const express = require("express");
    const app = (exports.app = express());
    const hb = require("express-handlebars");
    const cookieSession = require("cookie-session");
    const bodyParser = require("body-parser");
    const csurf = require("csurf");

    app.engine("handlebars", hb());
    app.set("view engine", "handlebars");
    app.use(express.static("./public"));

    app.use(
        cookieSession({
            maxAge: 1000 * 60 * 60 * 24 * 14,
            secret: `It's a secret!`
        })
    );

    app.use(
        bodyParser.urlencoded({
            extended: false
        })
    );

    app.use(csurf());

    app.use((req, res, next) => {
        res.setHeader("x-frame-options", "DENY");
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    require("./auth");
    require("./petition");
    require("./signers");
    require("./credits");
    require("./profile");
    require("./edit");

    app.get("/", (req, res) => {
        res.redirect("/login");
    });

    app.listen(process.env.PORT || 8080, () => {
        console.log("S E R V E R  I S  O N L I N E");
    });
})();
