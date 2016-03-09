var Twitter = require('twitter');
var express = require('express');
//var http = require('http');
var fs = require('fs');

var client = new Twitter({
	consumer_key: 'amgW24TB4ffSN5IPJFj5o1Ios',
	consumer_secret: 'uptBeEV0UJP0eiE0blPnX8YZX7kQ7jdyflWEUtW1DLKqL9zxc3',
	access_token_key: '371560459-b8wRiCsK3BeJ3fkciQP723R3j03kGoTbNOiOZQdE',
	access_token_secret: 'jrR7IKRBpIopRrl0onE0e5SHzQcFSiStwKko5pl6gZyl8'
});

var convention = 0;
var searchTerm = 'president';
var writeStream = fs.createWriteStream(searchTerm + '-' + convention + '-tweets.json', { flags : 'w'});
writeStream.write("[");
var count = 0;
var max = 100;
var writeBool = true;
var activeStream;
client.stream('statuses/filter', {track: searchTerm}, function(stream) {
	stream.on('data', function(tweet){
		count++;
		if(count >= max){
			writeBool = false;
			console.log(count);
			writeStream.write(JSON.stringify(tweet) + ']json');
			console.log("finished writing, closing stream");
			writeStream.end();
			console.log("Finished creating: " + searchTerm + convention + "-tweets.json");
			convention++;
			count = 0;
			writeStream = fs.createWriteStream(searchTerm + convention + '-tweets.json', {flags : 'w'});
			writeStream.write("[");
			writeBool = true;
		}
		if(writeBool){
			//console.log(tweet.text);
			console.log(count);
			writeStream.write(JSON.stringify(tweet)+',');
		}
	});
	stream.on('error', function(error){
		throw error;
		stream.destroy();
	});
});
