var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var arg = process.argv;
var action = arg.slice(2, 3);
var value = arg.slice(3, arg.length);
console.log(value);
var defaultSong = "The Sign";
var defaultMovie = "Mr. Nobody";
var timeStamp = Date.now();

//Dispalys a list of most current 20 tweets from a bogus Twitter account
var currentTweets = function() {

	var twitterCall = new Twitter(
	{
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	}
	);

	var tweetPar = {
	screen_name: "Bootcampbill",
	count: 20,
	};

	console.log("---------------------------------\nMy most recent 20 tweets\n---------------------------------");
	var tweetDataHead = "\r\nTweet Data\r\n";
	fs.appendFile("log.txt", tweetDataHead, function(err) {
			if (err) {
		    	return console.log(err);
		  	}
		  	//console.log("log.txt was updated!");
		});

	twitterCall.get("statuses/user_timeline", tweetPar, function(error, tweets, response){
		if (!error) {
			for (var i=0; i<tweets.length; i++) {
		  		var tweetNum = i + 1;
		  		var tweetNumber = "Tweet #" + tweetNum;
		  		var tweetsTime = "Time: " + tweets[i].created_at;
		  		var tweetLog = "--------------------------\r\n" + tweetNumber + "\r\n" + tweets[i].text + "\r\n" + tweetsTime + "\r\n" + "--------------------------\r\n";
		        
		        fs.appendFile("log.txt", tweetLog, function(err) {
					if (err) {
				    	return console.log(err);
				  	}
				  	//console.log("log.txt was updated!");
				});

		  		console.log("--------------------------\n" + tweetNumber +":\n" + tweets[i].text + "\n" + tweetsTime);	
			}
		}
	}); 
};

//Displays the information on a specific song from spotify
var spotify = function(value) {
	var spotify = new Spotify({
		id: keys.spotifyKeys.id,
		secret: keys.spotifyKeys.secret
		});

	var song = value;
	if(song === undefined || song === null || song === ""){
		song=defaultSong;
	}      
	 
	spotify.search({ type: "track", query: song }, function(err, data) {
		if (err) {
	    	return console.log("Error occurred: " + err);
		}
		var songName = "Song: " + data.tracks.items[0].album.name;
		var artist = "Artist: " + data.tracks.items[0].artists[0].name;
		var album = "Album: " + data.tracks.items[0].name;
		var checkIt = "Check it out at: " + data.tracks.items[0].preview_url;
		console.log(songName);
		console.log(artist);
        console.log(album);
        console.log(checkIt);
        var songLog = "\r\nSong Data\r\n" + songName + "\r\n" + artist + "\r\n" + album + "\r\n" + checkIt + "\r\n" + "--------------------------\r\n";
        fs.appendFile("log.txt", songLog, function(err) {
			if (err) {
		    	return console.log(err);
		  	}
		  	//console.log("log.txt was updated!");
		});
    });
};      

//Displays the information on a specific moive from OMDB API to gather movie data
var movie = function(value) {

    var movieName = value;
    if(movieName === undefined || movieName === null || movieName === ""){
		movieName = defaultMovie;
	}  
    var apiUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece"
    request(apiUrl, function (error, response, body) {
	    if (error) {
		    console.log(error);
		}
        var bodyParse = JSON.parse(body);
        var ratings = bodyParse.Ratings;
        var rottenTommRating = "";
        for(var i=0; i<ratings.length;i++){
        	if(ratings[i].Source === "Rotten Tomatoes") {
        		rottenTommRating = ratings[i].Value;
        	}
        }
        var title = "Movie Title: " + bodyParse.Title;
        var year = "Year: " + bodyParse.Year;
        var rating = "Rating: " + bodyParse.imdbRating;
        var tomatoes = "Rotten Tomatoes Rating: " + rottenTommRating;
        var country = "Country where produced: " + bodyParse.Country;
        var language = "Language: " + bodyParse.Language;
        var plot = "Plot: " + bodyParse.Plot;
        var actors = "Actors:" + bodyParse.Actors;
        console.log(title);
        console.log(year);
        console.log(rating);
        console.log(tomatoes);
        console.log(country);
        console.log(language);
        console.log(plot);
        console.log(actors);
        var movieLog = "\r\nMovie Data\r\n" + title + "\r\n" + year + "\r\n" + rating + "\r\n" + tomatoes + "\r\n" + country + "\r\n" + language + "\r\n" + plot + "\r\n" + actors + "\r\n" + "--------------------------\r\n";
        fs.appendFile("log.txt", movieLog, function(err) {
			if (err) {
		    	return console.log(err);
		  	}
		  	//console.log("log.txt was updated!");
		});
    });     
};

//Reads a text file to pull data and then re-runs the actionSwitch function
var readTxtFile = function() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
		return console.log(error);
		}
		var textFile = data.split(',');
	    action = textFile[0];
	    value = textFile[1];
   		actionSwitch(action, value);
	});
};

//If Else version of selector which processes the process.argv from the command line
var actionSwitch = function(action, value) {
	var command = "\r\n--------------------------\r\n" + "Command Info" + "\r\n" + "Time Stamp: " + timeStamp + "\r\n" + "Agrv 0: " + process.argv[0] + "\r\n" + "Argv 1: " + process.argv[1] + "\r\n" + "Agrv 2: " + action + "\r\n" + "Agrv 3: " + value + "\r\n";
	fs.appendFile("log.txt", command, function(err) {
		if (err) {
	    	return console.log(err);
	  	}
	  	//console.log("log.txt was updated!");
	});

	if (action == 'my-tweets'){
		currentTweets();
	}
	else if (action == 'spotify-this-song')
	{
		spotify(value);
	}
	else if (action == 'movie-this')
	{
		movie(value);
	}
	else if (action == 'do-what-it-says')
	{
		readTxtFile();
	}
	else
	{
		console.log("\nPossible Commands");
		console.log("------------------");
		console.log("my-tweets");
		console.log("spotify-this-song SONG TITLE");
		console.log("movie-this MOVIE TITLE");
		console.log("do-what-it-says");
		console.log("------------------\n");
	}
};

actionSwitch(action, value);

//Switch version of the selector - just messing aroudn with this.
// var actionSwitch = function(action, value) {
// 	switch (action) {
// 		case "my-tweets":
// 		    currentTweets();
// 		    break;

// 		case "spotify-this-song":
// 		    spotify(value);
// 		    break;

// 		case "movie-this":
// 		    movie(value);
// 		    break;

// 		case "do-what-it-says":
// 		    readTxtFile();
// 		    break;
// 	}
// };