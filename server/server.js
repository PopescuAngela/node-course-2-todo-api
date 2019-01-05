require('./config/config');
const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');
const _= require('lodash');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
var autheticate = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3000;

require('./controller/user-controller');
//configure the midleware
app.use(bodyParser.json());

//create
app.post('/todos', (request, response)=>{
    var todo = new Todo({
        text: request.body.text
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
app.get('/todos', (request, response)=> {
    Todo.find().then((todos)=>{
        response.send({
            todos
        });
    }, (error)=>{
        response.status(400);
        response.send(error);
    });
});

// GET /todos/{id}
app.get('/todos/:id', (request, response)=>{
    var requestId = request.params.id;
    if(!ObjectID.isValid(requestId)) {
       return response.status(404)
                .send({});
    }

    Todo.findById(requestId).then((todo)=> {
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
app.delete('/todos/:id', (request, response)=> {
    var requestId = request.params.id;
    if(!ObjectID.isValid(requestId)) {
       return response.status(404)
                .send({});
    }

    Todo.findByIdAndRemove(requestId).then((todo)=> {
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
app.patch('/todos/:id', (request, response)=>{
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
     Todo.findOneAndUpdate(requestId, 
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

app.get('/users/me', autheticate.authenticate, (request, response) =>{
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
    
    // hashed password matches with the plain text from body
});

app.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {app}