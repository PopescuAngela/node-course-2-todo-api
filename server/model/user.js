var mongoose = require('mongoose');

// create the schema for user
var User = mongoose.model('User', {
    email:{
        type: String,
        require: true,
        lenght: 1,
        trim: true
    }
});

module.exports = {User}