var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/userModel');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());            //adding req.session.passsport.user vlue when we login
passport.deserializeUser(User.deserializeUser());       //getting user(user id) value from session.passsport.user and populate user info from 
//database and set object req.user = all user info from db

//--------JWT-----------------
exports.getToken = function (user) {
    //user is payload           //3600 sec = 1hr
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        //paload token has user id
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                console.log("\n\nError in JWT payload: ", jwt_payload);
                return done(err, false);
            }
            else if (user) {
                console.log("\n\nUser found JWT payload: ", JSON.stringify(user));
                return done(null, user);
            }
            else {
                console.log("\n\nNo User found in JWT payload: ", jwt_payload);
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });