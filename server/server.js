const express = require('express');
const bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var app = express();

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

app.listen(3000, ()=> {
    console.log('Started on 3000 port!');
});

module.exports = {app}