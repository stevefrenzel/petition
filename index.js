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

    app.get("/", (req, res) => {
        if (req.session.signatureId) {
            res.redirect("/credits");
        } else if (req.session.userId) {
            res.redirect("/petition");
        } else {
            res.redirect("/register");
        }
    });

    ////////////////////////////////////////////////////////////
    ///////     /REGISTER GET & POST            ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/register", (req, res) => {
        if (req.session.signatureId) {
            res.redirect("/credits");
        } else if (req.session.userId) {
            res.redirect("/petition");
        } else {
            res.render("register", {
                title: "Register",
                layout: "main"
            });
        }
    });

    app.post("/register", (req, res) => {
        if (
            req.body.firstName == "" ||
            req.body.lastName == "" ||
            req.body.emailAddress == "" ||
            req.body.password == ""
        ) {
            res.render("register", {
                title: "Register",
                error: "error",
                layout: "main"
            });
        }
        auth.hashPassword(req.body.password).then(hash => {
            db.registerInfo(
                req.body.firstName,
                req.body.lastName,
                req.body.emailAddress,
                hash
            )
                .then(() => {
                    // if (no cookie) {
                    //     res.redirect("/profile");
                    // } else {
                    //     res.redirect("/petition");
                    // }
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });

    ////////////////////////////////////////////////////////////
    ///////     /PROFILE GET & POST             ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/profile", (req, res) => {
        if (req.session.signatureId) {
            res.redirect("/credits");
        } else if (req.session.userId) {
            res.redirect("/petition");
        } else {
            res.render("profile", {
                title: "Profile",
                layout: "main"
            });
        }
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
        if (!req.session.signatureId) {
            res.redirect("/login");
        } else if (req.session.signatureId) {
            res.redirect("/credits");
        } else {
            res.render("petition", {
                title: "Petition",
                layout: "main"
            });
        }
    });

    app.post("/petition", (req, res) => {
        if (req.session.signatureId == "") {
            res.render("petition", {
                title: "Petition",
                error: "error",
                layout: "main"
            });
        }
        db.addUserData(req.body.userId, req.body.signature)
            .then(data => {
                req.session.user = {
                    signatureId: data.rows[0].id
                };
                res.redirect("/credits");
            })
            .catch(err => {
                console.log(err);
            });
    });

    ////////////////////////////////////////////////////////////
    ///////     /LOGIN GET & POST               ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/login", (req, res) => {
        if (req.session.signatureId) {
            res.redirect("/credits");
        } else if (req.session.userId) {
            res.redirect("/petition");
        } else {
            res.render("login", {
                title: "Login",
                layout: "main"
            });
        }
    });

    app.post("/login", (req, res) => {
        db.getHashedPassword(req.body.emailAddress).then(data => {
            auth.checkPassword(req.body.password, data.rows[0].password).then(
                doesMatch => {
                    if (doesMatch) {
                        // enter query to compare id from users table with userId from signatures table
                        // and store information in cookie
                        db.compareIdWithUserId();
                        req.session.user = {
                            userId: data.rows[0].id
                        };
                        res.redirect("/petition");
                    } else {
                        res.render("login", {
                            title: "Login",
                            error: "error",
                            layout: "main"
                        });
                    }
                }
            );
        });
    });

    ////////////////////////////////////////////////////////////
    ///////     /LOGOUT GET                     ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/logout", (req, res) => {
        req.session = null;
        res.redirect("/login");
    });

    ////////////////////////////////////////////////////////////
    ///////     /CREDITS GET                    ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/credits", (req, res) => {
        if (!req.session.signatureId) {
            res.redirect("/petition");
        } else if (!req.session.userId) {
            res.redirect("/login");
        } else {
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
                    console.log(err);
                });
        }
    });

    ////////////////////////////////////////////////////////////
    ///////     /EDIT GET                       ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/edit", (req, res) => {
        if (req.session.signatureId) {
            res.redirect("/credits");
        } else if (req.session.userId) {
            res.redirect("/petition");
        } else {
            res.render("edit", {
                title: "Edit",
                layout: "main"
            });
        }
    });

    ////////////////////////////////////////////////////////////
    ///////     /SIGNERS GET & POST             ////////////////
    ////////////////////////////////////////////////////////////

    app.get("/signers", (req, res) => {
        if (!req.session.signatureId) {
            res.redirect("/petition");
        } else if (!req.session.userId) {
            res.redirect("/login");
        } else {
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
                    console.log(err);
                });
        }
    });

    // GET FOR CITY NAMES
    // app.get("/signers/:city", (req, res) => {});

    app.listen(8080, () => {
        console.log("S E R V E R  I S  O N L I N E");
    });
})();
