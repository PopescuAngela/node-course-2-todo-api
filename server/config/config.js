// console.log('process.env.NODE_ENV ******', process.env.NODE_ENV);
// console.log('process.env.MONGODB_URI ******', process.env.MONGODB_URI);
const env = process.env.NODE_ENV || 'development';
// console.log('env ******', env);
// console.log('MONGODB_URI ******', process.env.MONGODB_URI);

//mongoose.connect('mongodb://user:Password12@ds145183.mlab.com:45183/webapp');

// env variable
//1. Heroku env 'production'
if(env === 'development' || env === 'test') {
    // load from local file
    var config = require('./config.json');
    var envConfig = config[env];

    var objects = Object.keys(envConfig);
    objects.forEach((key)=>{
        process.env[key] = envConfig[key];
    });
}

console.log('env ******', env);
console.log('MONGODB_URI ******', process.env.MONGODB_URI);