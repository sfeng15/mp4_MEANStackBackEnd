// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/users');
var Task = require('./models/tasks');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//mongoose.connect('mongodb://localhost/mp4');

mongoose.connect('mongodb://shuofeng11:Ab1993118@ds025419.mlab.com:25419/webdesign');
// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
//app.use('/api', router);
//
////Default route here
//var homeRoute = router.route('/');
//
//homeRoute.get(function(req, res) {
//  res.json({ message: 'Hello World!' });
//});
//
app.use('/api', router);


var usersRoute = router.route('/users');
//users
//
//
//
usersRoute.get(function(req, res) {

  var where=eval("("+req.query.where+")");
  var sort=eval("("+req.query.sort+")");
  var select=eval("("+req.query.select+")");
  var skip=eval("("+req.query.skip+")");
  var limit=eval("("+req.query.limit+")");
  var count=eval("("+req.query.count+")");

  if(count==true) {
    User.find(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .count(count)
        .exec(function (err, users) {
          if (err){
              //err.name==="Not found"
              //console.log(err);
            res.status(404);//?not found
             // res.status(500);//server error
            res.send(err);
          }

          res.status(200);//?succeed
          res.json({message: "get users from database", data: users});
        });
  }
  else{
    User.find(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function (err, users) {
          if (err) {
              //
              //console.log();
              //if err.name==="NotFound"
              //404
              //else
              //500
            res.status(404);
            res.send(err);
          }

          res.status(200);
          res.json({message: "get users from database", data: users});
        });
  }
});
usersRoute.options(function(req, res){
  //res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.writeHead(200);
  res.end();
});
usersRoute.post(function(req, res) {

  var user = new User();

  user.name = req.body.name;
  user.email= req.body.email;
  user.pendingTasks= [];

  var date=new Date();
  user.dateCreated=date;

  //?using where to same emails

  var where={ "email" : user.email};
  User.find(where)
      .exec(function (err, users) {
        if (err){
            res.status(201);
            res.json({ message:"error", data:[] });
            return;
        }

        console.log(users);
        if(users.length===0){//? 201
          user.save(function(err,data) {
            if (err){
                res.status(201);
                res.json({ message:"error", data:[] });
                return;
            }
            res.status(201);
            res.json({ message:"user added to database", data:data });
          });
        }
          else{
            res.status(201);
            res.json({ message:"already exist user", data:[] });

        }
      });


});

//user/:id
//
//
//
var userIdRoute = router.route('/users/:id');
userIdRoute.get(function(req, res) {
   User.findById(req.params.id,function(err, user) {
     if (err){

             res.status(500);

         res.send(err);
     }//?append not found 404 error
       if(!user){
           res.status(404);
           res.json({ message:"OK", data:{}});
       }
    res.status(200);
     res.json({ message:"get a user", data:user});
  });
});
userIdRoute.put(function(req, res) {
    var date=new Date();//?
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        pendingTasks:req.body.pendingTasks,
        dateCreated: date
    },function(err) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else{
            res.status(200);
            res.json({message: "user was updated from database"});
        }
  });

});
userIdRoute.delete(function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err,data) {
        if (err){
            res.status(500);
            res.send(err);
        }
        if(data===null){
            res.status(404);
            res.json({message: "user was deleted from database",data:{} });

        }
        res.status(200);
        res.json({message: "user was deleted from database", data:{}});
    });
});




//tasks
//
//
//
var tasksRoute = router.route('/tasks');
tasksRoute.get(function(req, res) {
  var where=eval("("+req.query.where+")");
  var sort=eval("("+req.query.sort+")");
  var select=eval("("+req.query.select+")");
  var skip=eval("("+req.query.skip+")");
  var limit=eval("("+req.query.limit+")");
  var count=eval("("+req.query.count+")");
  if(count===true){
    Task.find(where)
       .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .count(count)
        .exec(function(err, tasks) {
          if (err) {
              res.status(404);
              res.send(err);
          }
          else{
              res.status(200);
              res.json({ message:"get tasks from database", data:tasks});
          }

        });
  }
  else {
    Task.find(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec(function (err, tasks) {
          if (err){
              res.status(404);
              res.send(err);
          }
          else {
              res.status(200);
              res.json({message: "get tasks from database", data: tasks});
          }

      });
  }
});
tasksRoute.options(function(req, res){
  //???res.header("Access-Control-Allow-Origin", "PUT,...");
  res.writeHead(200);
  res.end();
});
tasksRoute.post(function(req, res) {
  var task = new Task();

  task.name = req.body.name;
  task.description= req.body.description;
  task.deadline=  req.body.deadline;
  task.completed=  req.body.completed;
  task.assignedUser=req.body.assignedUser;
  task.assignedUserName=req.body.assignedUserName;
  var date=new Date();
  user.dateCreated=date;

  task.save(function(err) {
    if (err){
        res.status(404);
        res.send(err);
    }
    res.status(201);
    res.json({ message:"task added to database", data:task });
  });
});

//tasks/:id
//
//
//
var taskIdRoute = router.route('/tasks/:id');
taskIdRoute.get(function(req, res) {
  Task.findById(req.params.id,function(err, task) {//? req.params.id
    if (err){
        res.status(404);
        res.send(err);
    }
    res.status(200);
    res.json({ message:"get task from database", data:task});
  });
});
taskIdRoute.delete(function(req, res) {
  Task.findByIdAndRemove(req.params.id, function(err) {
    if (err){
        res.status(404);
        res.send(err);
    }
    res.status(200);
    res.json({message: "task was deleted from database" });
  });
});
taskIdRoute.put(function(req,res){
  var date=new Date();

  Task.findByIdAndUpdate(req.params.id, {
   name : req.body.name,
   description : req.body.description,
   deadline :  req.body.deadline,
   completed :  req.body.completed,
   assignedUser :req.body.assignedUser,
   assignedUserName :req.body.assignedUserName,
   dateCreated :date
  },function(err) {
    if (err){
        res.status(404);
        res.send(err);
    }
    res.status(201);
    res.json({message: "task was updated from database" });
  });
});












// Start the server
app.listen(port);
console.log('Server running on port ' + port);
