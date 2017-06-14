var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var url = 'mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+':'+process.env.MONGO_PORT_27017_TCP_PORT+'/blog';
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

MongoClient.connect(url, function(err, database){
  if(err){  console.log('failed to connect: ' + err); return;}
  db = database;
  app.listen(8082);
  console.log("Connected correctly to server!!");
});

//insert
app.post('/insertTask', function(req, res){
  var json = req.body;
  var doc = {'ID':json.id,
             'Description':json.Description,
             'Completed':json.Completed,
             'Duration':json.Duration};

    db.collection('task').insert(doc, {w:1}, function(err, result){
    res.send(result);
  });
});

app.post('/insertWork', function(req, res){
  var json = req.body;
  var doc = {'ID':json.id,
             'Description':json.Description,
             'Completed':json.Completed,
             'Duration':json.Duration};

    db.collection('work').insert(doc, {w:1}, function(err, result){
    res.send(result);
  });
});

//list
app.get('/readTask', function(req, res){
    db.collection('task').find().toArray(function(err, docs){
        res.send(docs);
    });
});

app.get('/readWork', function(req, res){
    db.collection('work').find().toArray(function(err, docs){
        res.send(docs);
    });
});


//get
app.get('/readTask/:id', function(req, res){
    var query = { ID: req.params.id };
    db.collection('task').find(query).toArray(function(err, docs){
        res.send(docs);
      });
});
app.get('/readWork/:id', function(req, res){
    var query = { ID: req.params.id };
    db.collection('work').find(query).toArray(function(err, docs){
        res.send(docs);
      });
});

//delete
app.delete('/deleteTask/:id', function(req, res) {
  var myquery = { ID: req.params.id };
  db.collection('task').remove(myquery, function(err, obj) {
      res.send(obj.result.n + " document(s) deleted");
  });
});
app.delete('/deleteWork/:id', function(req, res) {
  var myquery = { ID: req.params.id };
  db.collection('work').remove(myquery, function(err, obj) {
      res.send(obj.result.n + " document(s) deleted");
  });
});


//update
app.patch('/updateTask/:oldid/:newid', function(req, res){
  var json = req.body;
  var myquery = { ID: req.params.oldid };
  var newvalues = { $set: { ID: req.params.newid } };
  db.collection('task').update(myquery, newvalues, function(err, obj) {
      res.send(obj.result.n + " record updated");
  });
});
app.patch('/updateWork/:oldid/:newid', function(req, res){
  var json = req.body;
  var myquery = { ID: req.params.oldid };
  var newvalues = { $set: { ID: req.params.newid } };
  db.collection('work').update(myquery, newvalues, function(err, obj) {
      res.send(obj.result.n + " record updated");
  });
});
