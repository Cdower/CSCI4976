function showTweet (tweet) {
	//console.log(tweet["user"]);
	$("#"+num.toString()).prepend('<div class=post>' + '<ul class=content>' + 
		'<li><img class=profileImg src="'+tweet["user"]["profile_image_url"]+'"></img></li>' +
		'<li class=name>'+ tweet["user"]["name"] +'</li>' + 
		'<li> <a href=' + tweet["user"]["url"] + '>'+ '@' + tweet["user"]["screen_name"] +'</a></li>' +
		'<li><div>'+ tweet["text"] +'</div></li>' +
		'</ul></div>');
}

$.get('tweetsFromTwitter.json')
	.then(function(tweets) {
		num = 0;
		console.log(tweets.length);
		//showTweets(tweets, num);

		(function showTweets () {
			$("#tweets").prepend('<div class=tweet id ="'+num+'"></div>')
			for (var i = num; i < num+5; i++) {
				if(i < tweets.length){
					showTweet(tweets[i]);
				}
			};
			num+=5;
			if(num-5 >= 0){
				console.log("showing tweet " + num);
				$('#' + (num-5).toString()).slideDown(300).delay(2700).slideUp(300);//hide(100);			
			}
			if(num < tweets.length-1){
				setTimeout(showTweets, 3000);
			}
		})();
	});




