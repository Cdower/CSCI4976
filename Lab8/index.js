var express = require('express');//express
var bodyParser = require('body-parser'); //parse or send json
var sparql = require('sparql');
var app = express();
var client = new sparql.Client('http://dbpedia.org/sparql');

app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile( __dirname + '/index.html');
});

app.post('/queryDBPedia', function(req, res){
  var queryDB = req.body.query;
  client.query('select distinct ?'+queryDB+' where {[] a ?'+queryDB+'} limit 10', function(err, response){
    console.log('Response: ', response);
    //console.log(row.s for row in response.results.bindings);
    res.send(response);
  });
});


app.listen(3000, function () {
  console.log('Lab8 is listening on port 3000!');
});
