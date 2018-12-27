// console.log('process.env.NODE_ENV ******', process.env.NODE_ENV);
// console.log('process.env.MONGODB_URI ******', process.env.MONGODB_URI);
const env = process.env.NODE_ENV || 'development';
// console.log('env ******', env);
// console.log('MONGODB_URI ******', process.env.MONGODB_URI);

// env variable
//1. Heroku env 'production'
if(env === 'development') {
    console.log('Set on dev');
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    
} else if(env === 'test') {
    console.log('Set on test');
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';

}

console.log('env ******', env);
console.log('MONGODB_URI ******', process.env.MONGODB_URI);