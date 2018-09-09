var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/createTask', function (req, res) {
    var newTask = new Task();

    newTask.save(function (err, data) {
        if (!err) {
            res.redirect(`/task/${data._id}`);
        } else {
            console.log('Task error', err);
            res.render('error');
        }
    })
});

router.get('/task/:id', function (req, res) {
    if (req.params.id) {
        Task.findOne({_id: req.params.id}, function (err, data) {
            if (err) {
                console.log('Task error', err);
                res.render('error');
            }
            if (data) {
                res.render('task', {content: data.content, user: req.session.user, roomId: data.id});
            } else {
                console.log('Task error', err);
                res.render('error');
            }
        });
    } else {
        console.log('No params', err);
        res.render('error');
    }
});

module.exports = router;