var keys = require('./keys.js');
var Twitter = require('twitter');
var LastFM = require('last-fm');
var request = require('request');
var fs = require('fs');


var getMyTweets = function() {
  var client = new Twitter(keys.twitterKeys);
  var params = {screen_name: 'pearlstockman'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(' ');
        console.log("\"" + tweets[i].text + "\"");
        console.log(tweets[i].created_at);
        console.log(' ');
      }
    }
  });
}

var searchMusic = function(functionData) {
  var key = keys.lastFmKeys.api_key;

  // console.log(key);
  var lastfm = new LastFM(key, { userAgent: 'MyApp/1.0.0 (http://example.com)' })

  if (functionData == null) {
    var defaultSong = "The Sign";
    lastfm.trackSearch({ q: defaultSong }, (err, data) => {
      if (err) console.error(err)
      else console.log("Artist Name: " + data.result[2].artistName + "\n" + "Song Name: " + data.result[2].name + "\n")
    })
  }
  else {
    lastfm.search({ q: functionData }, (err, data) => {
      if (err) console.error(err)
      else console.log("Artist Name: " + data.result.top.artistName + "\n" + "Song Name: " + data.result.top.name + "\n")
    })
  }
}

var movieThis = function(functionData) {
  request('http://www.omdbapi.com/?apikey=40e9cece&t=' + functionData, function (error, response, body) {

    var jsonData =  JSON.parse(body);

    console.log('');
    console.log('Movie Title: ' + jsonData.Title);
    console.log('Year: ' + jsonData.Released);
    console.log('IMDB Rating: ' + jsonData.Ratings[0].value);
    console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].value);
    console.log('Country: ' + jsonData.Country);
    console.log('Language: ' + jsonData.Language);
    console.log('Plot: ' + jsonData.Plot);
    console.log('Actors: ' + jsonData.Actors);
    console.log('');
  });
}

var doWhatItSays = function() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;

    var dataArr = data.split(',');

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }
  });
}

var pick = function(caseData, functionData) {
  switch(caseData) {
    case 'my-tweets':
      getMyTweets();
      break;
    case 'search-music':
      searchMusic(functionData);
      break;
    case 'movie-this':
      movieThis(functionData);
      break;
      case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
    console.log('LIRI does not know that');
  }
}

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
