(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const bcrypt = require("./bcrypt.js");
    const {
        requireLoggedInUser,
        requireLoggedOutUser,
        requireNoSignature
    } = require("./middleware");

    app.get(
        "/register",
        requireLoggedOutUser,
        requireNoSignature,
        (req, res) => {
            res.render("register", {
                title: "Register",
                layout: "main"
            });
        }
    );

    app.post("/register", (req, res) => {
        res.render("register", {
            title: "Register",
            error: "error",
            layout: "main"
        });
        bcrypt
            .hashPassword(req.body.password)
            .then(hash => {
                db.registerInfo(
                    req.body.firstName,
                    req.body.lastName,
                    req.body.emailAddress,
                    hash
                );
            })
            .catch(err => {
                console.log("POST /register hashPassword() error: ", err);
            });
    });

    app.get("/login", requireLoggedOutUser, (req, res) => {
        res.render("login", {
            title: "Login",
            layout: "main"
        });
    });

    app.post("/login", (req, res) => {
        db.getHashedPassword(req.body.emailAddress)
            .then(data => {
                let id = data.rows[0].id;
                bcrypt
                    .checkPassword(req.body.password, data.rows[0].password)
                    .then(doesMatch => {
                        if (doesMatch) {
                            req.session.userId = id;
                            res.redirect("/petition");
                        } else {
                            res.render("login", {
                                title: "Login",
                                error: "error",
                                layout: "main"
                            });
                        }
                    })
                    .catch(err => {
                        console.log("POST /login checkPassword() error: ", err);
                    });
            })
            .catch(err => {
                console.log("POST /login getHashedPassword() error: ", err);
            });
    });

    app.get("/logout", (req, res) => {
        req.session = null;
        res.redirect("/login");
    });
})();
