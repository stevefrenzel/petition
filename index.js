(function() {
    "use strict";

    const express = require("express");
    const app = express();
    const db = require("./db");
    const hb = require("express-handlebars");
    const cookieSession = require("cookie-session");
    const bodyParser = require("body-parser");
    // const csurf = require("csurf");

    app.engine("handlebars", hb());
    app.set("view engine", "handlebars");
    app.use(express.static("./public"));

    // security measures against clickjacking and CSRF
    // app.use((req, res, next) => {
    //     res.setHeader("x-frame-options", "DENY");
    //     res.locals.csrfToken = req.csrfToken();
    //     next();
    // });

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

    // implenting csurf in order to use it
    // app.use(csurf());

    // GET FOR /PETITION

    app.get("/petition", (req, res) => {
        // req.session = {
        //     userId: data.rows[0].id,
        //     signatureId: id
        // };
        res.render("petition", {
            title: "Petition",
            layout: "main"
        });
    });

    // POST FOR /PETITION

    app.post("/petition", (req, res) => {
        db.addUserData(
            req.body.firstName,
            req.body.lastName,
            req.body.signature
        )
            .then(() => {
                console.log("addUserData() SUCCESFUL");
            })
            .catch(err => {
                console.log("addUserData() ERROR: ", err);
            });
    });

    // GET FOR /CREDITS

    app.get("/credits", (req, res) => {
        db.getNames()
            .then(data => {
                let totalAmountSigners = data.rows.length;
                res.render("credits", {
                    title: "Credits",
                    layout: "main",
                    amountSigners: totalAmountSigners
                });
            })
            .catch(err => {
                console.log("getNames() ERROR: ", err);
            });
    });

    // GET FOR /SIGNERS

    app.get("/signers", (req, res) => {
        db.getNames()
            .then(data => {
                let userNames = data.rows;
                res.render("signers", {
                    title: "Signers",
                    layout: "main",
                    userData: userNames
                });
            })
            .catch(err => {
                console.log("getNames() ERROR: ", err);
            });
    });

    // GET FOR /REGISTER

    app.get("/register", (req, res) => {
        res.render("register", {
            title: "Register",
            layout: "main"
        });
    });

    // GET FOR /LOGIN

    app.get("/login", (req, res) => {
        res.render("login", {
            title: "Login",
            layout: "main"
        });
    });

    app.listen(8080, () => {
        console.log("S E R V E R  I S  O N L I N E");
    });
})();
