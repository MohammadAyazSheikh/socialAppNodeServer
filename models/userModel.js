var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema(
    {
        name: {
            type: String,
            default: 'userDefaultName'
        },
        dob: {
            type: Date,
            //default: new Date('2002-12-54')
            min: '1947-09-28',
            max: '2050-05-23'
        }
    },
    {
        timestamps: true
    }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);