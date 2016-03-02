var app = angular.module('lab4', ['ngSanitize']);

app.controller('TweetsCntl', function ($scope, $http) {
  $http.get("get_tweets.php").
  then(function(response, status) {
    $scope.tweets = response.data.statuses;
    console.log(response);
    for (var i = 0; i < $scope.tweets.length; i++) {
      $scope.tweets[i]
    }
  });

  $scope.search = function(fullTextSearch) {
    console.log(fullTextSearch);
    //$http.post("get_tweets", )
    $http.post("get_tweets.php?q="+fullTextSearch).
    then(function(response, status) {
    $scope.tweets = response.data.statuses;
    console.log(response);
    for (var i = 0; i < $scope.tweets.length; i++) {
      $scope.tweets[i]
    }
  });
  }
});

app.filter('tweetLinky',['$filter', '$sce',
  function($filter, $sce) {
    return function(text, target) {
      if (!text) return text;

      var replacedText = $filter('linky')(text, target);
      var targetAttr = "";
      if (angular.isDefined(target)) {
          targetAttr = ' target="' + target + '"';
      }

      // replace #hashtags
      var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
      replacedText = replacedText.replace(replacePattern1, '$1<a href="https://twitter.com/search?q=%23$2"' + targetAttr + '>#$2</a>');

      // replace @mentions
      var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="https://twitter.com/$2"' + targetAttr + '>@$2</a>');

      $sce.trustAsHtml(replacedText);
      return replacedText;
    };
  }
]);