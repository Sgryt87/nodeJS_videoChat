var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Online Video Caller'});
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: 'Online Video Caller'})
});

router.route('/contact')
    .get(function (req, res, next) {
        res.render('contact', {title: 'Online Video Caller'})
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

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login to your account'});
});

router.get('/register', function (req, res, next) {
    res.render('register', {title: 'Register a new account'});
});

module.exports = router;


