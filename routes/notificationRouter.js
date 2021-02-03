var express = require('express');
var notificationsRouter = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
var Users = require('../models/userModel');
var Notification = require('../models/notificationModel');



notificationsRouter.route('/')
    .get(authenticate.verifyUser,
        (req, res, next) => {

            var filterNotify = [];


            Notification.find({})
                .then(
                    (notify) => {

                        if (req.query.sent) {
                            notify.map((val) => {

                                if (val.sendFrom == req.user._id) {
                                    filterNotify.push(val)
                                }
                            })

                            console.log('filtered notifications ', filterNotify + "\n");

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(filterNotify);
                        }
                        else if (req.query.recieved) {
                            console.log("\n\n************************************** rev *****************************\n\n")
                            var recvNot = [];
                            notify.map((val) => {

                                if (val.sendTo == req.user._id) {

                                    Users.findById({ _id: val.sendFrom }).then((user) => {
                                        console.log('\n\nfind block')
                                        let u = {
                                            name: user.fname + " " + user.lname,
                                            uId: user._id,
                                            notificId: val.id
                                        }
                                        //console.log(JSON.stringify(u));
                                        recvNot.push(u);
                                        filterNotify.push(u);
                                        console.log('filtered notifications\n');
                                        console.log(recvNot);
                                        //console.log(filterNotify);
                                    },
                                        (err) => next(err)
                                    ).then(
                                        () => {

                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({ "not": filterNotify });

                                        }).catch((err) => next(err));
                                }
                            })
                        }
                        else {
                            filterNotify = notify;
                            console.log('filtered notifications ', filterNotify + "\n");

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(filterNotify);
                        }

                        // console.log('filtered notifications ', filterNotify + "\n");

                        // res.statusCode = 200;
                        // res.setHeader('Content-Type', 'application/json');
                        // res.json(filterNotify);

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
notificationsRouter.route('/:uId')
    .get(authenticate.verifyUser,
        (req, res, next) => {

            if (req.query.sent) {

                Notification.find({ sendFrom: req.user._id, sendTo: req.params.uId })
                    //.where('sendTo').equals(req.params.uId)
                    .then((resp) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true });

                    },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            }
            else if (req.query.recieved) {

                Notification.find({ sendFrom: req.params.uId, sendTo: req.user._id })
                    // .where('sendFrom').equals(req.params.uId)
                    .then((resp) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true });

                    },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            }
        }
    )
    .delete(authenticate.verifyUser,
        (req, res, next) => {

            if (req.query.sent) {

                Notification.remove({ sendFrom: req.user._id, sendTo: req.params.uId })
                    //.where('sendTo').equals(req.params.uId)
                    .then((resp) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true });

                    },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            }
            else if (req.query.recieved) {

                Notification.remove({ sendFrom: req.params.uId, sendTo: req.user._id })
                    // .where('sendFrom').equals(req.params.uId)
                    .then((resp) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true });

                    },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            }

        }
    )


//**************************For Users Sent Notification******************************* */
// notificationsRouter.route('/user')
// .get(authenticate.verifyUser,
//     (req, res, next) => {


//     })

module.exports = notificationsRouter;
