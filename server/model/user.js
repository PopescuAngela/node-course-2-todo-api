const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        minlenght: 1,
        trim: true,
        unique: true,
        validate: {
            validator : (value) =>{
               return validator.isEmail(value);
            }, 
            message: '{value} is not valid email.'
        }
    },
    password: {
        type: String,
        require: true,
        minlenght: 6
    },
    tokens: [{
        access :{
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

// is an object new function
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id : user._id.toHexString(),
        access
    }, 'abc123');

    user.tokens = user.tokens.concat([{
        access, token
    }]);

    return user.save().then(() => {
        return token;
    });
};

// overwrite a method
UserSchema.methods.toJSON = function (){
    var user = this;
    // get the user mongo object
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

// create the schema for user
var User = mongoose.model('User', UserSchema);


module.exports = {User}