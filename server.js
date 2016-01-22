var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var db = require('monk')('localhost/mydb');
var users = db.get("users");
users.drop();
users.insert([{ name: 'Daniel', age: 25},{ name: "John", age: 32}]);

app.use('/public',express.static('public'));


//Page load
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

//API
app.get('/api/users',function(req, res){

  users.find({}, function(err,docs){
    if(err) return next(err);

    res.send(docs);
  })

});

app.post('/api/users',function(req, res, next){

  var name = req.body.name;
  var age = req.body.age;

  var person = {name : name , age : age};

  users.insert(person, function(err,person){
    if(err) return next(err);

    res.send(person);
  });

});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
