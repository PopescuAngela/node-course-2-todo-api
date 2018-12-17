// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// //generate object id
// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
       return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to mongoDb server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do 2',
    //     completed: false
    // }, (error, result) => {
    //     if(error){
    //        return console.log('Unable to insert todo', error);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Angela Babarada',
    //     age: 29,
    //     location: 'Craiova'
    // }, (error, result) => {
    //     if(error){
    //        return console.log('Unable to insert Users', error);
    //     }

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });
    
    db.close();
});
