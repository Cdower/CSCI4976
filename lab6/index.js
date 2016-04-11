var express = require('express');//express
var Twitter = require('twitter');//twitter library
var bodyParser = require('body-parser'); //parse or send json
var fs = require('fs'); //write files
var converter = require('json-2-csv');
//var mime = require('mime'); //parse file type to send files
//var io = require('socket.io');
var app = express();
//var http = require('http').Server(app);

var client = new Twitter({
	consumer_key: 'amgW24TB4ffSN5IPJFj5o1Ios',
	consumer_secret: 'uptBeEV0UJP0eiE0blPnX8YZX7kQ7jdyflWEUtW1DLKqL9zxc3',
	access_token_key: '371560459-b8wRiCsK3BeJ3fkciQP723R3j03kGoTbNOiOZQdE',
	access_token_secret: 'jrR7IKRBpIopRrl0onE0e5SHzQcFSiStwKko5pl6gZyl8'
});

var queryComplete, latestQuery, latestNum;
var customTweet;

function collectTweets(query, number){
  var convention = 0;
  var writeStream = fs.createWriteStream(query + '-' + number + '-tweets.json', { flags : 'w'});
  writeStream.write("[");
  var count = 0;
  var writeBool = true;
  var activeStream;
  client.stream('statuses/filter', {track: query}, function(stream) {
  	stream.on('data', function(tweet){
  		count++;
  		if(count > number){
  			writeBool = false;
  			writeStream.write(']');
  			writeStream.end();
        console.log("Finished Collecting Tweets");
        stream.destroy();
				queryComplete = true;
				console.log("queryComplete: " + queryComplete);
        return;
  		}
			/*&& tweet.hasOwnProperty('user_screen_name') && tweet.hasOwnProperty('user_location') && tweet.hasOwnProperty('user_followers_count') &&
		tweet.hasOwnProperty('user_friends_count') && tweet.hasOwnProperty('user_created_at') */
  		if(writeBool){
				if(tweet.hasOwnProperty('created_at') && tweet.hasOwnProperty('id') && tweet.hasOwnProperty('text') && tweet.hasOwnProperty('user') ){
					customTweet = {
						"created_at":tweet["created_at"],
						"id":tweet['id'],
						"text":tweet['text'],
						'user_id':tweet['user']['id'],
						'user_name':tweet['user']['name'],
						'user_screen_name':tweet['user']['screen_name'],
						'user_location':tweet['user']['location'],
						"user_followers_count":tweet['user']['followers_count'],
						"user_friends_count":tweet['user']['friends_count'],
						"user_created_at":tweet['user']['created_at'],
						"user_time_zone":tweet['user']['time_zone'],
						"user_profile_background_color":tweet['user']['profile_background_color'],
						"user_profile_image_url":tweet['user']['profile_image_url'],
						"geo":tweet['geo'],
						'coordinates':tweet['coordinates'],
						'place':tweet['place']
					}
				}
				if(customTweet){
	  			writeStream.write(JSON.stringify(customTweet) + ',');
				}else{
					writeStream.write(JSON.stringify(tweet) + ',');
				}
  		}
  	});
  	stream.on('error', function(error){
  		throw error;
  		stream.destroy();
  	});
  });
  return;
}

app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile( __dirname + '/index.html');
});

app.post('/query', function (req, res) {
  queryComplete = false;
	latestQuery = req.body.query;
	latestNum = req.body.number;
  console.log(req.body.query);
  console.log(req.body.number);
  collectTweets(req.body.query, req.body.number);
	queryComplete = true;
	console.log("queryComplete: " + queryComplete);
	res.send(queryComplete);
});

if(queryComplete){
  console.log('json file built');
}

app.get('/pullJSON', function (req, res) {
	if(queryComplete){
		var file = latestQuery + '-' + latestNum + '-tweets.json';
		//__dirname + '/' +
		res.download(file);
	}else{
		console.log("query incomplete");
	}
  //res.send("Hello World!");
});

app.get('/pullCSV', function(req, res){
	if(queryComplete){
		var fileName = latestQuery + '-' + latestNum + '-tweets.csv';
		converter.json2csv(customTweet,function (err, csv) {
	  	if (err) console.log(err);
			fs.writeFile(fileName, csv, function(err) {
		    if (err) throw err;
		    console.log('file saved');
		  });
		});
		res.download(fileName);
	}
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
/**/
