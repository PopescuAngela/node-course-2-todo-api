require('./config/config');
const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');
const _= require('lodash');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3000;

//configure the midleware
app.use(bodyParser.json());

//create
app.post('/todos', authenticate, (request, response)=>{
    var todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });
    todo.save().then((doc)=> {
        response.status(200);
        response.send(doc);

    }, (e) =>{
        response.status(400);
        response.send(e);
    });
});

//get all
app.get('/todos', authenticate, (request, response)=> {
    Todo.find({
        _creator: request.user._id
    }).then((todos)=>{
        response.send({
            todos
        });
    }, (error)=>{
        response.status(400);
        response.send(error);
    });
});

// GET /todos/{id}
app.get('/todos/:id', authenticate, (request, response)=>{
    var requestId = request.params.id;
    if(!ObjectID.isValid(requestId)) {
       return response.status(404)
                .send('id not correct');
    }

    Todo.findOne({
        '_id': requestId,
        '_creator': request.user._id
    }).then((todo)=> {
        if(!todo) {
            return  response.status(404).send();
        }  
        response.status(200).send({todo});
    }).catch((e) =>{
        response.status(400)
            .send({});
    });
});

// delete one document by ID
app.delete('/todos/:id', authenticate ,(request, response)=> {
    var requestId = request.params.id;
    if(!ObjectID.isValid(requestId)) {
       return response.status(404)
                .send({});
    }

    Todo.findOneAndRemove({
        '_id': requestId,
        '_creator': request.user._id
    }).then((todo)=> {
        if(!todo) {
            console.log(`The document with id ${requestId} was not found.`);
            return response.status(404).send({});
        }
        response.status(200).send({todo});
    }).catch( (error) => {
        console.log(error);
        response.status(400)
        .send({});
    });
});

// update
app.patch('/todos/:id', authenticate, (request, response)=>{
    var requestId = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']); 

    if(!ObjectID.isValid(requestId)) {
        return response.status(404)
                 .send({});
     }

     if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
     } else {
         body.completed = false;
         body.completedAt = null;   
     }

     // update the database
     Todo.findOneAndUpdate({
        '_id': requestId,
        '_creator': request.user._id
     }, 
       {$set:body}, {new: true}).then((todo)=>{
           if(!todo) {
            return response.status(404)
            .send({});
           }
           response.send({todo});
       }).catch((e)=> {
        response.status(400)
            .send({});
       }
       );

});

//get all
app.get('/users', (request, response)=> {
    User.find().then((users)=>{
        response.send({
            users
        });
    }, (error)=>{
        response.status(400);
        response.send(error);
    });
});

//create new user
app.post('/users', (request, response)=>{
    var body = _.pick(request.body, ['email', 'password']); 
    var user = new User(body);

    user.save().then((user)=> {
        // response.status(200);
        // response.send(user);
        return user.generateAuthToken();
    }, (e) =>{
        response.status(400);
        response.send(e);
    }).then((token)=>{
        // set the header
        response.header('x-auth', token);
        response.send(user);
    });
});

app.get('/users/me', authenticate, (request, response) =>{
   response.send(request.user);s
});


app.post('/users/login', (request, response)=>{
    var body = _.pick(request.body, ['email', 'password']);
    // find the user
    User.findByCredentials(body.email, body.password).then((user)=>{                                                    
        console.log(user);
        if(!user){
            console.log('Could not find user with email:', body.email);
            response.status(404).send({});
        } else{
          //return  user.generateAuthToken().then((token)=>{
                // response.header('x-auth',token);
                response.status(200);
                response.send(user);
            //});
        }
    }).catch((e)=>{
        response.status(400).send({});
    });
});

app.delete('/users/me/token', authenticate, (request, response)=>{
    // detele the token was user on auth middleware
    request.user.removeToken(request.token).then(()=>{
        response.status(200).send();    
    }, () =>{
        response.status(400).send();
    });
});

app.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {app}