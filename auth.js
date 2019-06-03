(function() {
    'use strict';

    const { app } = require('./index');
    const db = require('./db');
    const bcrypt = require('./bcrypt.js');
    const {
        requireLoggedOutUser,
        requireNoSignature
    } = require('./middleware');

    app.get(
        '/register',
        requireLoggedOutUser,
        requireNoSignature,
        (req, res) => {
            res.render('register', {
                title: 'Register',
                layout: 'main'
            });
        }
    );

    app.post('/register', (req, res) => {
        bcrypt
            .hashPassword(req.body.password)
            .then(hash => {
                db.registerInfo(
                    req.body.firstName,
                    req.body.lastName,
                    req.body.emailAddress,
                    hash
                )
                    .then(data => {
                        let id = data.rows[0].id;
                        req.session.userId = id;
                        res.redirect('/profile');
                    })
                    .catch(err => {
                        console.log(
                            'POST /register registerInfo() error: ',
                            err
                        );
                        res.render('register', {
                            title: 'Register',
                            error: 'error',
                            layout: 'main'
                        });
                    });
            })
            .catch(err => {
                console.log('POST /register hashPassword() error: ', err);
                res.render('register', {
                    title: 'Register',
                    error: 'error',
                    layout: 'main'
                });
            });
    });

    app.get('/login', requireLoggedOutUser, requireNoSignature, (req, res) => {
        res.render('login', {
            title: 'Login',
            layout: 'main'
        });
    });

    app.post('/login', (req, res) => {
        db.getHashedPassword(req.body.emailAddress)
            .then(data => {
                let id = data.rows[0].id;
                bcrypt
                    .checkPassword(req.body.password, data.rows[0].password)
                    .then(doesMatch => {
                        if (doesMatch) {
                            req.session.userId = id;
                            db.checkIfSigned(req.session.userId).then(data => {
                                if (data.rows.length > 0) {
                                    req.session.signatureId = data.rows[0].id;
                                    res.redirect('/credits');
                                } else {
                                    res.redirect('/petition');
                                }
                            });
                        } else {
                            res.render('login', {
                                title: 'Login',
                                error: 'error',
                                layout: 'main'
                            });
                        }
                    })
                    .catch(err => {
                        console.log('POST /login checkPassword() error: ', err);
                    });
            })
            .catch(err => {
                console.log('POST /login getHashedPassword() error: ', err);
            });
    });

    app.post('/logout', (req, res) => {
        req.session = null;
        res.redirect('/login');
    });

    app.post('/unsign', (req, res) => {
        db.deleteSignature(req.session.signatureId)
            .then(() => {
                req.session.signatureId = null;
                res.redirect('/petition');
            })
            .catch(err => {
                console.log('POST /unsign deleteSignature() error: ', err);
            });
    });
})();
