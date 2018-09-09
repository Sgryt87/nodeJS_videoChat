var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');

router.route('/login')
    .get(function (req, res, next) {
        res.render('login', {title: 'Login into your account'})
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login'
    }), function (req, res) {

        req.session.user = req.user.name;
        res.render('index', {
                title: 'Logged in!',
                user: req.session.user
            }
        );
        // res.redirect({user: req.session.user}, '/');
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
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/err'
    }
));

module.exports = router;