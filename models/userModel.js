var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema(
    {
        fname: {
            type: String,
            default: 'default first name'
        },
        lname: {
            type: String,
            default: 'default last name'
        },
        dob: {
            type: Date,
            //default: new Date('2002-12-54')
            min: '1947-09-28',
            max: '2050-05-23'
        },
        addr: {
            type: String,
            default: 'default addr'
        },
        edu: {
            type: String,
            default: 'default edu'
        },
        gender: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', User);