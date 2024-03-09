// Create web server
var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db;
var dbo;
var dbase;
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/getComments', function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if (err) throw err;
        db = client.db('comments');
        dbo = db.collection('comments');
        dbo.find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            client.close();
        });
    });
});

app.post('/postComment', function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if (err) throw err;
        db = client.db('comments');
        dbo = db.collection('comments');
        var myobj = { name: req.body.name, comment: req.body.comment };
        dbo.insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            client.close();
        });
    });
    res.send('Comment posted');
});

app.listen(port, function() {
    console.log('Server is running on port ' + port);
});