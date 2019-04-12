(function() {
    "use strict";

    const { app } = require("./index");
    const db = require("./db");
    const { requireLoggedInUser } = require("./middleware");
    const urlCleaner = require("./urlCleaner");
    const bcrypt = require("./bcrypt");

    app.get("/edit", requireLoggedInUser, (req, res) => {
        db.getUserInformation(req.session.userId)
            .then(data => {
                let firstName = data.rows[0].first_name;
                let lastName = data.rows[0].last_name;
                let emailAddress = data.rows[0].email_address;
                let age = data.rows[0].age;
                let city = data.rows[0].city;
                let url = data.rows[0].url;
                res.render("edit", {
                    title: "Edit",
                    layout: "main",
                    firstName,
                    lastName,
                    emailAddress,
                    age,
                    city,
                    url
                });
            })
            .catch(err => {
                console.log("GET /edit getUserInformation() error:", err);
            });
    });

    // create two promises

    // first one updates age, city, url

    // second one checks if user entered password
    // if no password UPDATE names and email
    // if password, hash it and enter names, email, hash
    // when done put stuff into promise.all and ONLY redirect when both true

    app.post("/edit", (req, res) => {
        let cleanUrl = urlCleaner(req.body.url);
        let updateUser;

        db.updateAgeCityUrl(
            req.body.signersAge,
            req.body.signersCity,
            req.body.signersHomepage,
            req.session.userId
        );

        if (req.body.password === "") {
            updateUser = db.updateNamesEmail(
                req.body.firstName,
                req.body.LastName,
                req.body.emailAddress
            );
        } else {
            bcrypt.hashPassword(req.body.password).then(hash => {
                db.updateNamesEmailPassword(
                    req.body.firstName,
                    req.body.lastName,
                    req.body.emailAddress,
                    hash
                );
            });
        }
        res.redirect("/credits");

        Promise.all([promise1, promise1]).then(data => {
            console.log(data);
        });
    });
})();
