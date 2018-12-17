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

// find by id with $set option 
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5c176bfb81e1ae51348ccc3a")
    }, { $set : {
            completed:true
        }
        }, {
            returnOriginal: false
        }).then((result)=>{
        console.log(result);

    });

    // db.collection('Todos').findOneAndUpdate({completed:false}, {completed:true}).then((result)=>{
    //     console.log(result);
    // });

    //update one user name and increment the age
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5c174615222e915bb8692825")
    }, { $set : {
            name :'Angela Babarada'
        },
        $inc :{ age:1}
        }, {
            returnOriginal: false
        }).then((result)=>{
        console.log(result);

    });

    db.close();
});
