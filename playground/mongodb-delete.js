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
    //delete many
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

    //delete one
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

   //find one and delete
    //    db.collection('Todos').findOneAndDelete({text:'Eat lunch'}).then((result)=>{
    //        console.log(result);
    //    });

    //Users collection
    // db.collection('Users').deleteMany({name: 'Angela Babarada'}).then((result)=>{
    //     console.log(result);
    // });

    //find one and delete
       db.collection('Todos').findOneAndDelete({
           _id: new ObjectID("5c1746cb6c6e9a42e024d838")
        }).then((result)=>{
           console.log(result);
       }, (error) =>{
           console.log(error);
    });

    db.close();
});
