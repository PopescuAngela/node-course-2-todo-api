const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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


UserSchema.methods.removeToken = function (token) {
    // pull remove item from the array
    var user = this;

    return user.update({
        $pull :{
            tokens:{
                token: token
            }
        }
    });

}

// overwrite a instance method
UserSchema.methods.toJSON = function (){
    var user = this;
    // get the user mongo object
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

// create the schema for model user
UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return new Promise((resolve, reject) =>{
            reject();
        })
    }

    console.log('Decoded value:', decoded);
    
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

//model function
UserSchema.statics.findByCredentials =  function(email, password) {
    var User = this;
    console.log(`-${email}-`);

    return User.findOne({email}).then((user)=>{
        if(!user){
           return new Promise.reject();
        }

        // create new promise 
        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (error, resp)=>{
               if(resp){
                    resolve({user});
               } else {
                   console.log('Password are not equals');
                   reject();
               }
            }); 
        });

    });


};

// pre method for save
UserSchema.pre('save', function(next) {
    var user = this;
    //check if the pass was modified
if(user.isModified('password')){
    bcrypt.genSalt(10,(error,salt)=>{
        bcrypt.hash(user.password, salt,(error, hash)=>{
            user.password=hash;
            next();
        });
    });
} else{
    next();
}

});

var User = mongoose.model('User', UserSchema);

module.exports = {User}