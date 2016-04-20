var express = require('express');//express
var app = expres();

app.get('/', function (req, res) {
  res.sendFile( __dirname + '/index.html');
});
