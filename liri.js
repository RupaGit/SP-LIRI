require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var userCommand = process.argv[2];
var userChoice = process.argv.slice(3);
var queryVal = [];

fs.appendFile("log.txt", process.argv.slice(1) + "\n", function (err) {

    // If an error was experienced we will log it.
    if (err) {
        return console.log(err);
    }
    else {
        return;
    }

});

function addResponseToLog(value) {
    fs.appendFile("log.txt", "\n" + value + "\n", function (err) {
        // If an error was experienced we will log it.
        if (err) {
            return console.log(err);
        }
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            return;
        }
    });
}


function printSongDetails(songDetails) {
    var artistString = "";
    console.log("\n=============================================================");
    console.log("Printing the song Details");
    console.log("=============================================================");
    console.log("The album name is: ", songDetails.album.name);
    console.log("The album was released on: ", songDetails.album.release_date);
    for (var i = 0; i < songDetails.artists.length; i++) {
        artistString = artistString + songDetails.artists[i].name + "  ";
    }
    console.log("The artists are: ", artistString);
    console.log("The name of the song is: ", songDetails.name);
    console.log("This song can be played using the link: ", songDetails.external_urls.spotify);
    console.log("=============================================================\n");
    addResponseToLog("Printing the song Details\n" + "=============================================================\n" + "\nThe album name is: " + songDetails.album.name + "\nThe album was released on: " + songDetails.album.release_date + "\nThe album was released on: " + songDetails.album.release_date + "\nThe artists are: " + artistString + "\nThe name of the song is: " + songDetails.name + "\nThis song can be played using the link: " + songDetails.external_urls.spotify);

}

function printMovieDetails(movieDetails) {
    var rottenRatings = "";
    console.log("\n=============================================================");
    console.log("Printing the Movie Details");
    console.log("=============================================================");
    console.log("The Movie name is: ", movieDetails.Title);
    console.log("This movie was released on:", movieDetails.Released);
    console.log("IMDB rating of this moview is: ", movieDetails.imdbRating);
    //Add code to get rotten tomatoes rating.
    for (var i = 0; i < movieDetails.Ratings.length; i++) {
        if (movieDetails.Ratings[i].Source === "Rotten Tomatoes") {
            rottenRatings = movieDetails.Ratings[i].Value;
        }
    }
    console.log("Rotten Tomatoes Ratings:", rottenRatings);
    console.log("This movie was produced in: ", movieDetails.Country);
    console.log("This language of the movie is: ", movieDetails.Language);
    console.log("This plot of the movie is: ", movieDetails.Plot);
    console.log("Actors in this movie are: ", movieDetails.Actors);
    console.log("=============================================================\n");
    addResponseToLog("Printing the Movie Details\n" + "=============================================================\n" + "The Movie name is: " + movieDetails.Title + "\nThis movie was released on: " + movieDetails.Released + "\nIMDB rating of this moview is: " + movieDetails.imdbRating + "\nRotten Tomatoes Ratings:" + rottenRatings + "\nThis movie was produced in: " + movieDetails.Country + "\nThis language of the movie is: " + movieDetails.Language + "\nThis plot of the movie is: ", movieDetails.Plot + "\nActors in this movie are: ", movieDetails.Actors);
}

function printConcerts(concertDetails) {
    console.log(concertDetails.length);
    var sorryMsg = "Sorry no performances at this time";
    if (concertDetails.length > 0) {
        for (var i = 0; i < concertDetails.length; i++) {
            console.log("\n=============================================================");
            console.log("Printing the Concert Details: ", i + 1);
            console.log("=============================================================");
            console.log("The concert date and time is: ", moment(concertDetails[i].datetime).format("MM/DD/YYYY"));
            console.log("The venue for this concert is: ", concertDetails[i].venue.name);
            console.log("The venue is located at: ", concertDetails[i].venue.city + ", " + concertDetails[i].venue.region);
            console.log("=============================================================\n");
            addResponseToLog("Printing the Concert Details: " + i + 1 + "\n=============================================================\n" + "The concert date and time is: " + moment(concertDetails[i].datetime).format("MM/DD/YYYY") + "\nThe venue for this concert is: " + concertDetails[i].venue.name + "\nThe venue is located at: " + concertDetails[i].venue.city + ", " + concertDetails[i].venue.region);
        }
    }
    else {
        console.log(sorryMsg);
    }
}

//Searching the spotify API for song details
function spotifySongSearch() {
    spotify.search({ type: 'track', market: 'US', query: queryVal, limit: '1' }, function (err, response) {
        if (err) {
            return console.log('This song is not found in spotify database' + err);
        }
        printSongDetails(response.tracks.items[0]);
    });
}

//Searching OMDB API for movie details
function omdbMovieSearch() {
    axios.get("http://www.omdbapi.com/?t=" + queryVal + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            printMovieDetails(response.data);
            // console.log("The movie's rating is: " + JSON.stringify(response.data,null,2));
        }
    );
}

//Searching Bands In Town API for concerts
function bandsIntownSearch() {
    axios.get("https://rest.bandsintown.com/artists/" + queryVal + "/events?app_id=codingbootcamp").then(
        function (response) {
            printConcerts(response.data);
        }
    );
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        userCommand = dataArr[0];
        var randomArr = dataArr[1].replace(/['"]+/g, '');
        userChoice = randomArr.split(" ")
        console.log(userChoice);
        pickAFunction();
    });

}

function constructQueryVal() {
    if (userChoice.length === 0) {
        switch (userCommand) {
            case 'concert-this':
                queryVal = "Jennifer+Lopez";
                break;
            case 'spotify-this-song':
                queryVal = "Hips+dont+lie";
                break;
            case 'movie-this':
                queryVal = "300";
                break;
            case 'do-what-it-says':
                break;
            default:
                console.log("Invalid Option. Please try again");
                break;
        }
    }
    else if (userChoice.length === 1) {
        queryVal = userChoice;
    }
    else {
        queryVal = userChoice.join('+');
        // for (var i = 1; i < userChoice.length; i++) {
        //     queryVal = queryVal + '+' + userChoice[i];
        // }
    }
    console.log(queryVal);
}

function pickAFunction() {
    constructQueryVal();
    switch (userCommand) {
        case 'concert-this':
            bandsIntownSearch();
            break;
        case 'spotify-this-song':
            spotifySongSearch();
            break;
        case 'movie-this':
            omdbMovieSearch();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("Invalid Option. Please try again");
            break;
    }
}

pickAFunction();