var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Notification = new Schema(
    {
        sendFrom: {
            type: String,
            default: 'default from'
        },
        sendTo: {
            type: String,
            default: 'default to'
        }
    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model('Notification', Notification);