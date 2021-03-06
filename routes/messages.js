var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.get('/', function (req, res, next) { // route '/' is /messages in this context
    Message.find()
        .populate('user', 'firstName') // each message will also contain user_id and firstName
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({ // exit if error
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({ // if no err, return messages
                message: 'Success',
                obj: messages
            });
        });
});

router.use('/', function (req, res, next) { // will be used on every request except .get('/')
    jwt.verify(req.query.token, 'secret', function (err, decoded) { // gives access to all query params, checks for token in params
        if (err) {
            return res.status(401).json({ // not authorized
                title: 'Authentication failed',
                error: err
            });
        }
        next(); // let request continue if no err
    });
});

router.post('/', function (req, res, next) { // this remains as '/' because we only go here if it begins with /messages
    var decoded = jwt.decode(req.query.token); // no need to reuse verify since we did above
    User.findById(decoded.user._id, function (err, user) { // get user from db
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        var message = new Message({
            content: req.body.content,
            user: user
        });
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            user.messages.push(result); // add new message to stack of messages
            user.save();
            res.status(201).json({
                message: 'Message saved',
                obj: result
            });
        });
    });
});

router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'Edit failed',
                error: {message: 'Message not found!'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(500).json({
                title: 'Authorization failed',
                error: {message: 'User IDs do not match'}
            });
        }
        message.content = req.body.content;
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Message not found!',
                    error: err
                });
            }
            res.status(200).json({ // if no err, return messages
                message: 'Updated message',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'Delete failed',
                error: {message: 'Message not found!'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(500).json({
                title: 'User not authorized to view content',
                error: {message: 'User ids do not match'}
            });
        }
        message.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Message not found!',
                    error: err
                });
            }
            res.status(200).json({ // if no err, return messages
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;
