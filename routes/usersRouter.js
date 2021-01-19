var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var passport = require('passport');
var authenticate = require('../authenticate')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource in User Route');
});




router.get('/getData', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    Dtata: 'this data comming from Server',
    DataType: 'Test Data'
  });
});



router.post('/signup',
  (req, res, next) => {                           //register method will be added auto by passport in user model

    User.register(new User({ username: req.body.username }), req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        }
        else {
          if (req.body.dob)
            console.log('\n\nDOB ' + req.body.dob)
          user.dob = req.body.dob //new Date(req.body.dob);
          if (req.body.name)
            user.name = req.body.name;
          user.save(
            (err, user) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
                return;
              }
              passport.authenticate('local')(req, res, () => {
                var token = authenticate.getToken({ _id: req.user._id });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: 'Registration Successful!', token: token });
              });
            });
        }
      });
  });

module.exports = router;
