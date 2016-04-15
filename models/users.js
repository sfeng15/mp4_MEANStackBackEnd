// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UsersSchema   = {
  //name: {
  //  type:'String',
  //  required:true
  //},
  //email:  {
  //  type:'String',
  //  required:true,
  //  unique: true
  //},
  name:String,
  email:String,
  pendingTasks: [String],
  dateCreated: Date
};

// Export the Mongoose model
var Use = mongoose.model("User",UsersSchema);

module.exports = Use;
