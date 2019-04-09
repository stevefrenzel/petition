(function() {
    "use strict";

    const express = require("express");
    const app = express();
    const db = require("./db");
    const hb = require("express-handlebars");
    const cookieSession = require("cookie-session");
    const bodyParser = require("body-parser");
    const auth = require("./bcrypt.js");
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

    ////////////////////////////////////////////////////////////
    ///////     /REGISTER GET & POST            ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/register", (req, res) => {
        res.render("register", {
            title: "Register",
            layout: "main"
        });
    });

    app.post("/register", (req, res) => {
        auth.hashPassword(req.body.password).then(hash => {
            db.registerInfo(
                req.body.firstName,
                req.body.lastName,
                req.body.emailAddress,
                hash
            )
                .then(() => {
                    console.log("POST FOR /register");
                    // if first time, redirect to /profile
                    // else redirect to /petition
                })
                .catch(err => {
                    console.log("hashPassword() ERROR: ", err);
                });
        });
    });

    ////////////////////////////////////////////////////////////
    ///////     /PROFILE GET & POST             ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/profile", (req, res) => {
        res.render("profile", {
            title: "Profile",
            layout: "main"
        });
    });

    app.post("/profile", (req, res) => {
        res.render("profile", {
            title: "Profile",
            layout: "main"
        });
    });

    ////////////////////////////////////////////////////////////
    ///////     /PETITION GET & POST            ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/petition", (req, res) => {
        res.render("petition", {
            title: "Petition",
            layout: "main"
        });
    });

    app.post("/petition", (req, res) => {
        db.addUserData(
            // req.body.firstName,
            // req.body.lastName,
            req.body.signature
        )
            .then(() => {
                console.log("POST FOR /petition");
            })
            .catch(err => {
                console.log("addUserData() ERROR: ", err);
            });
    });

    ////////////////////////////////////////////////////////////
    ///////     /LOGIN GET & POST               ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/login", (req, res) => {
        res.render("login", {
            title: "Login",
            layout: "main"
        });
    });

    app.post("/login", (req, res) => {
        // db.hashPassword(req.body.password).then(hash => {
        //     auth.checkPassword(req.body.password, hash).then(doesMatch => {
        //         if (doesMatch) {
        //             req.session.user = {
        //                 userId: data.rows[0].id,
        //                 signatureId: id
        //             };
        //             res.redirect("/petition");
        //         }
        //     });
        // });
    });

    ////////////////////////////////////////////////////////////
    ///////     /CREDITS GET                    ////////////////
    ////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////
    ///////     /EDIT GET                       ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/edit", (req, res) => {
        res.render("edit", {
            title: "Edit",
            layout: "main"
        });
    });

    ////////////////////////////////////////////////////////////
    ///////     /SIGNERS GET & POST             ////////////////
    ////////////////////////////////////////////////////////////

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

    // GET FOR CITY NAMES
    // app.get("/cities/:city", (req, res) => {});

    app.listen(8080, () => {
        console.log("S E R V E R  I S  O N L I N E");
    });
})();
