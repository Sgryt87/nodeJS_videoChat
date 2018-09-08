var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
    .get(function (req, res, next) {
        res.render('login', {title: 'Login into your account'})
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login'
    }), function (req, res) {
        res.render('index', {
                title: 'Login into your account',
                user: req.user
            }
        );
    });

router.route('/register')
    .get(function (req, res, next) {
        res.render('register', {title: 'Register a new account'});
    })
    .post(function (req, res, next) {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('confirmPassword', 'Password confirmation is required')
            .equals(req.body.password).notEmpty();

        var errors = req.validationErrors();
        if (!errors) {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save(function (err) {
                if (!err) {
                    res.redirect('/login');
                } else {
                    res.render('register', {
                        errorMessages: err
                    });
                }
            });
        } else {
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            })
        }
    });

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;