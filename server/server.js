const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var app = express();

const port = process.env.PORT || 3000;

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

    Todo.findByIdAndRemove(requestId).then((removedTodo)=> {
        if(!removedTodo) {
            console.log(`The document with id ${requestId} was not found.`);
            return response.status(404).send({});
        }

        response.status(200).send({removedTodo});
    }).catch( (error) =>{
        response.status(400)
        .send({});
    });
});

app.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {app}