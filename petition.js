(function() {
    'use strict';

    const { app } = require('./index');
    const db = require('./db');
    const { requireLoggedInUser } = require('./middleware');

    app.get('/petition', requireLoggedInUser, (req, res) => {
        db.checkIfSigned(req.session.userId).then(data => {
            if (data.rows.length > 0) {
                req.session.signatureId = data.rows[0].id;
                res.redirect('/credits');
            } else {
                res.render('petition', {
                    title: 'Petition',
                    layout: 'main'
                });
            }
        });
    });

    app.post('/petition', (req, res) => {
        db.addUserData(req.session.userId, req.body.signature)
            .then(data => {
                console.log(data);
                req.session.signatureId = data.rows[0].id;
                res.redirect('/credits');
            })
            .catch(err => {
                console.log('POST /petition addUserData() error: ', err);
            });
    });
})();
