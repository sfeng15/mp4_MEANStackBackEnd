// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UsersSchema   = new mongoose.Schema({
  name: {
    type:'String',
    required:true
  },
  email:  {
    type:'String',
    required:true,
    unique: true
  },
  pendingTasks: [String],
  dateCreated: Date
});

// Export the Mongoose model
module.exports = mongoose.model('User', UsersSchema);
