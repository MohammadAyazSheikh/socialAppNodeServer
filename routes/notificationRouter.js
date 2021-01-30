var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
var Users = require('../models/userModel');
var Notification = require('../models/notificationModel');



router.route('/')
    .post(//authenticate.verifyUser,
        (req, res, next) => {

            Notification.create(req.body)
                .then((notify) => {
                    console.log('Notification receve ', notify);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(notify);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .delete(//authenticate.verifyUser,
        (req, res, next) => {

            Notification.findByIdAndRemove(req.body)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ succes: true });
                }, (err) => next(err))
                .catch((err) => next(err));
        })





module.exports = router;
