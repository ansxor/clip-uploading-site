"use strict";
exports.__esModule = true;
var express = require("express");
var mongodb = require("mongodb");
var app = express();
var port = 3001;
var MongoClient = mongodb.MongoClient;
app.use(express.static('public'));
app.use(express.json());
var dbName = 'clip-uploading-site';
var url = 'mongodb://127.0.0.1:27017';
MongoClient.connect(url, { useUnifiedTopology: true })
    .then(function (client) {
    var db = client.db(dbName);
    app.get('/mytest', function (req, res) {
        db.collection('users').find().toArray()
            .then(function (result) { return res.json(result); })["catch"](function (err) { return console.log(err); });
    });
    app.post('/registeruser', function (req, res) {
        db.collection('users').insertOne(req.body);
        res.json(req.body);
    });
    app.listen(port, function () { return console.log('listening'); });
})["catch"](function (err) { return console.log(err); });
