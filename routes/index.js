var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Home Online Video Caller', user: req.session.user});
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: 'About Online Video Caller', user: req.session.user})
});

router.route('/contact')
    .get(function (req, res, next) {
        res.render('contact', {title: 'Online Video Caller', user: req.session.user})
    })
    .post(function (req, res, next) {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('message', 'Message is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.render('contact', {
                title: 'Online Video Caller',
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
                errorMessages: errors
            });
        } else {
            var mailOptions = {
                from: 'Video Caller <no-reply@vcaller.com>',
                to: req.body.email,
                subject: 'New Message',
                text: req.body.message
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log('email err:', error);
                } else {
                    res.render('thank', {title: 'Online Video Caller'});
                }
            })
        }
    });

module.exports = router;


