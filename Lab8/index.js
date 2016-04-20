var express = require('express');//express
var bodyParser = require('body-parser'); //parse or send json
var app = expres();

app.get('/', function (req, res) {
  res.sendFile( __dirname + '/index.html');
});

app.post('/queryDBPedia', function(req, res){
  var query = req.body.query;
});
