(function() {
    'use strict';

    const { app } = require('./index');
    const db = require('./db');
    const { requireLoggedInUser } = require('./middleware');
    const urlCleaner = require('./urlCleaner');
    const bcrypt = require('./bcrypt');

    app.get('/edit', requireLoggedInUser, (req, res) => {
        db.getUserInformation(req.session.userId)
            .then(data => {
                let firstName = data.rows[0].first_name;
                let lastName = data.rows[0].last_name;
                let emailAddress = data.rows[0].email_address;
                let age = data.rows[0].age;
                let city = data.rows[0].city;
                let url = data.rows[0].url;
                res.render('edit', {
                    title: 'Edit',
                    layout: 'main',
                    firstName,
                    lastName,
                    emailAddress,
                    age,
                    city,
                    url
                });
            })
            .catch(err => {
                console.log('GET /edit getUserInformation() error:', err);
            });
    });

    app.post('/edit', (req, res) => {
        let cleanUrl = urlCleaner.urlCleaner(req.body.signersHomepage);
        let updateUser;

        let updateThreeThings = db.updateAgeCityUrl(
            req.body.signersAge,
            req.body.signersCity,
            cleanUrl,
            req.session.userId
        );

        if (req.body.password === '') {
            updateUser = db.updateNamesEmail(
                req.body.firstName,
                req.body.lastName,
                req.body.emailAddress,
                req.session.userId
            );
        } else {
            updateUser = bcrypt.hashPassword(req.body.password).then(hash => {
                return db.updateNamesEmailPassword(
                    req.body.firstName,
                    req.body.lastName,
                    req.body.emailAddress,
                    hash,
                    req.session.userId
                );
            });
        }

        Promise.all([updateThreeThings, updateUser]).then(data => {
            if (data) {
                res.redirect('/credits');
            }
        });
    });
})();
