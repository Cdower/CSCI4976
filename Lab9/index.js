var express = require('express');//express
var Twitter = require('twitter');//twitter library
var bodyParser = require('body-parser'); //parse or send json
var fs = require('fs'); //write files
var converter = require('json-2-csv');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var js2xmlparser = require('js2xmlparser');
var app = express()
//var http = require('http').Server(app);

var xmlFile;
var url = 'mongodb://localhost:27017/twitter';
var client = new Twitter({
	consumer_key: 'amgW24TB4ffSN5IPJFj5o1Ios',
	consumer_secret: 'uptBeEV0UJP0eiE0blPnX8YZX7kQ7jdyflWEUtW1DLKqL9zxc3',
	access_token_key: '371560459-b8wRiCsK3BeJ3fkciQP723R3j03kGoTbNOiOZQdE',
	access_token_secret: 'jrR7IKRBpIopRrl0onE0e5SHzQcFSiStwKko5pl6gZyl8'
});

var insertJSON = function functionName(db, json, callback) {
		db.collection("tweets").insert(json, function(err, doc){
			if(err) throw err;
		});
};
//query.toLowerCase()

var queryComplete, latestQuery, latestNum;
var customTweet;

function collectTweets(query, number, addtoDB){
  var convention = 0;
  //var writeStream = fs.createWriteStream(query + '-' + number + '-tweets.json', { flags : 'w'});
  //writeStream.write("[");
  var count = 0;
  var writeBool = true;
  var activeStream;
  client.stream('statuses/filter', {track: query}, function(stream) {
  	stream.on('data', function(tweet){
  		count++;
  		if(count > number){
  			writeBool = false;
  			//writeStream.write(']');
  			//writeStream.end();
        console.log("Finished Collecting Tweets");
        stream.destroy();
				queryComplete = true;
				MongoClient.connect(url, function(err, db) {
					assert.equal(null, err);
					db.close();
				});
        return true;
  		}
  		if(writeBool){
				if(tweet){
					customTweet = {
						"query":query,
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
					MongoClient.connect(url, function(err, db) {
						assert.equal(null, err);
						insertJSON(db, customTweet);
					});
  			//writeStream.write(JSON.stringify(customTweet) + ',');
				}
  		}
  	});
  	stream.on('error', function(error){
  		throw error;
  		stream.destroy();
  	});
  });
  //return false;
}

app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile( __dirname + '/index.html');
});

app.get('/rawMongoJSON', function(req, res) {
	//Send data from mongo db twitter collection tweets
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var collection = db.collection('tweets');
		collection.find().toArray(function(err, result) {
			if(err){
				console.log(err);
				res.send(err);
			}else if(result.length){
				res.send(result);
			}else{
				res.send("{[]}");
				console.log("Search Failed");
			}
		})
	});
})

app.post('/mongoXML', function(req, res) {
	xmlFile = latestQuery + '-' + latestNum + '-tweets.xml';
	var xmlStream;
	try{
		fs.accessSync(xmlFile, fs.F_OK);
	 	fs.unlinkSync(xmlFile);
	 	xmlStream = fs.createWriteStream(xmlFile, { flags : 'w'});
	} catch(e){
		xmlStream = fs.createWriteStream(xmlFile, { flags : 'w'});
	}
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var collection = db.collection('tweets');
		var cursor = collection.find( { 'query':latestQuery } ).limit(Number(latestNum));
		var tweets = {};
		cursor.each(function(err, data) {
			if(err){ console.log(err);}
			else{
				if(data != null){
					var id = data["_id"];
					delete data["_id"];
					delete data['query'];
					tweets["tweet_"+id] = data;
				}else {
					var options = {
						arrayMap: {
								coordinates: "coordinate"
						}
					};
					xmlStream.write(js2xmlparser("tweets", tweets, options));
					xmlStream.end();
					console.log("Sending: ", xmlFile);
					res.download(xmlFile);
				}
			}
		})
	})
})

app.get('/mongoXML', function(req, res) {
	res.download(xmlFile);
})

app.post('/query', function (req, res) {
	queryComplete = false;
	latestQuery = req.body.query;
	latestNum = req.body.number;
  collectTweets(latestQuery, latestNum, true);
	var __queryCheck = setInterval(function(){
		if(queryComplete){
			clearInterval(__queryCheck);
			console.log(queryComplete);
			res.send(queryComplete);
		}
	},100);
});

if(queryComplete){
  console.log('json file built');
}

app.get('/pullJSON', function (req, res) {
	var jsonFile = latestQuery+'-'+latestNum+'-tweets.json';
	var path = __dirname + '\\' + jsonFile;
	var jsonStream;
	try{
		fs.accessSync(jsonFile, fs.F_OK);
		fs.unlinkSync(jsonFile);
		jsonStream = fs.createWriteStream(jsonFile, { flags : 'w' });
	} catch(e){
		jsonStream = fs.createWriteStream(jsonFile, { flags : 'w' });
	}
	var __queryCheck = setInterval(function(){
		if(queryComplete){
			clearInterval(__queryCheck);
			MongoClient.connect(url, function(err, db){
				assert.equal(null, err);
				var collection = db.collection('tweets');
				var cursor = collection.find( { 'query':latestQuery } ).limit(Number(latestNum));
				var tweets = {};
				cursor.each(function(err, data){
					if(err) console.log(err);
					else{
						if(data != null){
							var id = data['_id'];
							delete data['_id'];
							delete data['query'];
							tweets['tweet_'+id] = data;
						}else{
							jsonStream.write(JSON.stringify(tweets));
							jsonStream.end();
							res.download(jsonFile);
						}
					}
				});
			});
		}
	}, 100);
});

app.get('/pullCSV', function(req, res){
	var csvFile = latestQuery + '-' + latestNum + '-tweets.csv';
	var path = __dirname + '\\' + csvFile;
	console.log(latestNum, latestQuery, csvFile, path);
	var csvStream;
	try{
		fs.accessSync(xmlFile, fs.F_OK);
	 	fs.unlinkSync(xmlFile);
		console.log(csvFile + " exists");
		csvStream = fs.createWriteStream(path, { flags : 'w' });
	}catch(e){
		console.log(e);
		csvStream = fs.createWriteStream(path, { flags : 'w' });
	}
	//csvStream = fs.createWriteStream(path, { flags : 'w' });
	var __queryCheck = setInterval(function(){
		if(queryComplete){
			clearInterval(__queryCheck);
			csvStream = fs.createWriteStream(csvFile, { flags:'w' });
			MongoClient.connect(url, function(err, db){
				assert.equal(null,err);
				var collection = db.collection('tweets');
				var cursor = collection.find().limit(Number(latestNum));
				var tweets = {};
				cursor.each(function(err, data){
					if(err) console.log(err);
					else{
						if(data!=null){
							var id= data['_id'];
							delete data['_id'];
							delete data['query'];
							tweets['tweet_'+id]=data;
						}else{
							converter.json2csv(tweets,function(err, csv){
								if(err) console.log(err);
								csvStream.write(csv);
								csvStream.end();
								res.download(csvFile);
							});
						}
					}
				});
			});
		}
	}, 100);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
/**/
