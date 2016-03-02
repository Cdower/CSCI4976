var app = angular.module('lab4', []);

app.controller('TweetsCntl', function ($scope, $http) {
  $http.get("get_tweets.php").
  then(function(response, status) {
    $scope.tweets = response.data.statuses;
    console.log(response);
    for (var i = 0; i < $scope.tweets.length; i++) {
      $scope.tweets[i]
    }
  });
});

  