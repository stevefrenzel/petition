(function() {
    'use strict';

    const { app } = require('./index');
    const db = require('./db');
    const { requireLoggedInUser } = require('./middleware');

    app.get('/credits', requireLoggedInUser, (req, res) => {
        Promise.all([
            db.getAmountOfSigners(),
            db.getSignatures(req.session.userId)
        ])
            .then(data => {
                let totalAmountSigners = data[0].rows.length;
                let getSignature = data[1].rows[0].signature;
                res.render('credits', {
                    title: 'Credits',
                    layout: 'main',
                    amountSigners: totalAmountSigners,
                    signature: getSignature
                });
            })
            .catch(err => {
                console.log('GET /credits getAmountOfSigners() error: ', err);
            });
    });
})();
