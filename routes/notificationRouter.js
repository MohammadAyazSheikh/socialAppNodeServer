var express = require('express');
var notificationsRouter = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
var Users = require('../models/userModel');
var Notification = require('../models/notificationModel');



notificationsRouter.route('/')
    .get(authenticate.verifyUser,
        (req, res, next) => {

            let filterNotify = [];

            Notification.find({})
                .then(
                    (notify) => {

                        if (req.query.sent) {
                            notify.map((val) => {

                                if (val.sendFrom == req.user._id) {
                                    filterNotify.push(val)
                                }
                            })
                        }
                        else if (req.query.recieved) {
                            notify.map((val) => {

                                if (val.sendTo == req.user._id) {
                                    filterNotify.push(val)
                                }
                            })
                        }
                        else {
                            filterNotify = notify;
                        }

                        console.log('filtered notifications ', filterNotify + "\n");

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(filterNotify);

                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        })
    .post(authenticate.verifyUser,
        (req, res, next) => {

            let notify = {
                sendFrom: req.user._id,
                sendTo: req.body.toId,
            }

            console.log("notify object \n" + JSON.stringify(notify) + "\n")

            Notification.create(notify)
                .then((notify) => {
                    console.log('Notification receve ', notify + "\n");
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(notify);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .delete(authenticate.verifyUser,
        (req, res, next) => {

            Notification.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ succes: true });
                }, (err) => next(err))
                .catch((err) => next(err));
        })

//**************************For single notification******************************* */
notificationsRouter.route('/:notificId')
    .get(authenticate.verifyUser,
        (req, res, next) => {

            Notification.findById(req.params.notificId)
                .then((resp) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);

                },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    )
    .delete(authenticate.verifyUser,
        (req, res, next) => {

            Notification.findByIdAndRemove(req.params.notificId)
                .then((resp) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ succes: true });

                },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    )


//**************************For Users Sent Notification******************************* */
// notificationsRouter.route('/user')
// .get(authenticate.verifyUser,
//     (req, res, next) => {


//     })

module.exports = notificationsRouter;
