const mongoose = require('mongoose');

// say to mongoose to use promises
mongoose.Promise = global.Promise;
// connect to the database
mongoose.connect(process.env.MONGODB_URI);
//  'mongodb://user:Password12@ds145183.mlab.com:45183/webapp' || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose}

