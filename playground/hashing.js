const {SHA256} = require('crypto-js');
const jwt =require('jsonwebtoken');
const bycript = require('bcryptjs');

var password ="123abc!";
bycript.genSalt(10,(err,salt)=>{
    bycript.hash(password, salt, (error,hash)=>{
        console.log('Hashed pass', hash);
    })
});

var hashedPassword='$2a$10$0.Su6yligK2HbBisO12QxedVy5DmiTNemdPP2dHzeWdUqgO6B7vTK';

bycript.compare(password, hashedPassword, (error,res)=>{
    console.log('Response',res);
});




// var messafe ='I am user number 3';
// var hash = SHA256(messafe). toString();

// console.log(` Message : ${messafe}`);
// console.log(` Hash : ${hash}`);

// var data = {
//     id : 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some-secret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data)+ 'some-secret').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }

//with json web token
var data = {
    id : 10
};
var token = jwt.sign(data, '123abc');
console.log(token);
var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);