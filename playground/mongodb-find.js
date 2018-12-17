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

    // the find method returns a primise 
    db.collection('Todos').find({
        _id: new ObjectID('5c17452fa7f08f47fca69c06')
    }).toArray().then((docs)=> {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (error) =>{
        console.log('Unable to get the todos', error);
        }
    );


    //count all documents
    db.collection('Todos').find().count().then((count)=> {
        console.log(`Todos ${count}`);
    }, (error) =>{
        console.log('Unable to get the todos', error);
        }
    );

    // Count all users with name Angela Babarada
    db.collection('Users').find({
        name: 'Angela Babarada'
    }).count().then((count)=> {
        console.log(`Users with Angela Babarada name ${count}`);
    }, (error) =>{
        console.log('Unable to get the Users', error);
        }
    );
    
    db.close();
});
