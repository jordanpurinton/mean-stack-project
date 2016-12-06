var express = require('express');
var router = express.Router();
var secret = require('bcryptjs');
var User = require('../models/user');

router.post('/', function (req, res, next) { // TODO integrate SSL
    var user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: secret.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        })

    });
});

module.exports = router;
