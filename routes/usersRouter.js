var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var passport = require('passport');
var authenticate = require('../authenticate');
var Users = require('../models/userModel');
const { json } = require('express');

// authenticate.verifyUser
/* GET users listing. */


// Users.find({"fname" : {$regex : ".*son.*"}})
// .then((users) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'application/json');
//   res.json(users);
// }, (err) => next(err))
// .catch((err) => next(err));

router.route('/')
  .get((req, res, next) => {

    Users.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {

    Users.find({})
      .then((users) => {

        let _users = [];
        const filterUsers = users.map(
          (val) => {

            let name = val.fname + val.lname;
            name = name.toLowerCase();
            if (name.includes(req.body.uname)) {
              _users.push(val);
            }

          }
        );


        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(_users);
      }, (err) => next(err))
      .catch((err) => next(err));
  })




router.get('/getData', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    Dtata: 'this data comming from Server',
    DataType: 'Test Data'
  });
});



router.post('/signup',
  (req, res, next) => {

    User.register(new User({ username: req.body.username }), req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        }
        else {
          if (req.body.dob)
            user.dob = req.body.dob
          if (req.body.fname)
            user.fname = req.body.fname;
          if (req.body.lname)
            user.lname = req.body.lname;
          if (req.body.addr)
            user.addr = req.body.addr;
          if (req.body.edu)
            user.edu = req.body.edu;
          if (req.body.gender)
            user.gender = req.body.gender;
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
                res.json(
                  {
                    success: true,
                    status: 'Registration Successful!',
                    token: token,
                    userInfo: {
                      id: user._id,
                      fname: user.fname,
                      lname: user.lname,
                      dob: user.dob,
                      email: user.username,
                      addr: user.addr,
                      edu: user.edu,
                      gender: user.gender
                    }
                  }
                );
              });
            });
        }
      });
  });



router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(
    {
      success: true,
      status: 'Log In succesfull!',
      token: token,
      userInfo: {
        id: req.user._id,
        fname: req.user.fname,
        lname: req.user.lname,
        dob: req.user.dob,
        email: req.user.username,
        addr: req.user.addr,
        edu: req.user.edu,
        gender: req.user.gender
      }
    }
  );
});



router.get('/logout', authenticate.verifyUser, (req, res, next) => {


  console.log('*****LogOut outside if block called req.user value: '+JSON.stringify(req.user))

  if (req.user) {
    res.json({ success: true, });
    req.logOut();

    console.log('*****LogOut called req.user value: '+JSON.stringify(req.user))
  } else {
    res.json({ success: false, status: 'You are not logged In..!', });
  }

});

module.exports = router;
