var {User}= require('./../model/user');

var authenticate = (req, resp, next) =>{
    var token = req.header('x-auth');
    console.log(token);

    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        req.user=user;
        req.token=token;
        next();
    }).catch((e) =>{
        res.status(401);
        res.send();
    });
}

module.exports ={
    authenticate
};