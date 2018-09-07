var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config);

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
                to: '33310a5cd2dc8a',
                subject: 'New Message',
                text: req.body.message
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                } else {
                    res.render('thank', {title: 'Online Video Caller'});
                }
            })
        }
    });

module.exports = router;
