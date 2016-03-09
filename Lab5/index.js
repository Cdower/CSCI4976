var Twitter = require('twitter');
var express = require('express');

var client = new Twitter({
	consumer_key: 'amgW24TB4ffSN5IPJFj5o1Ios',
	consumer_secret: 'uptBeEV0UJP0eiE0blPnX8YZX7kQ7jdyflWEUtW1DLKqL9zxc3',
	access_token_key: '371560459-b8wRiCsK3BeJ3fkciQP723R3j03kGoTbNOiOZQdE',
	access_token_secret: 'jrR7IKRBpIopRrl0onE0e5SHzQcFSiStwKko5pl6gZyl8'
});

var params = {screen_name: 'nodejs'};
client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
	stream.on('data', function(tweet){
		console.log(tweet.text);
	});
	stream.on('error', function(error){
		throw error;
	});
});