var {User}= require('./../model/user');

var authenticate = (req, resp, next) =>{
    var token = req.header('x-auth');

    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        console.log(token);

        req.user=user;
        //save the token; it will be user when logout
        req.token=token;
        next();
    }).catch((e) =>{
        resp.status(401);
        resp.send();
    });
}

module.exports ={
    authenticate
};