const mongoose = require('mongoose');

// say to mongoose to use promises
mongoose.Promise = global.Promise;
// connect to the database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose}