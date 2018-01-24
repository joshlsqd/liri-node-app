const Spotify = require('node-spotify-api');
const request = require('request');
require("dotenv").config();
var fs = require("fs");

const keys = require('./keys');
const spotify = new Spotify(keys.spotify);
const searchType = process.argv[2];
const searchName = process.argv[3];
const fileData = fs.readFileSync("random.txt", "utf8").split(',');


runLiri(searchType, searchName, fileData);

function runLiri(searchType, searchName, fileData) {
    switch (searchType) {
        case 'spotify-this-song':
            spotifySearch(searchName);
            writeLog(searchType, searchName);
            break;
        case 'movie-this':
            omdbSearch(searchName);
            writeLog(searchType, searchName);
            break;
        case 'do-what-it-says':
            let a = fileData[0];
            let b = fileData[1];
            writeLog(searchType, 'below is the search from random.txt:');
            runLiri(a, b);
            break;
        default:
            console.log('Sorry not an applicable search');
    }
}



function spotifySearch(songName) {
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Song Name: ' + data.tracks.items[0].name);
        console.log('Preview: ' + data.tracks.items[0].preview_url);
        console.log('Album Name: ' + data.tracks.items[0].album.name);
    });
}


function omdbSearch(movieName) {
    request('https://www.omdbapi.com/?t=' + movieName + '&apikey=bdf491', function (error, response, body) {
        const movieInfo = JSON.parse(body);
        // console.log(movieInfo);
        console.log('Title: ' + movieInfo.Title);
        console.log('Year: ' + movieInfo.Year);
        console.log('IMDB: ' + movieInfo.Ratings[0].Value);
        console.log('Rotten Tomatoes: ' + movieInfo.Ratings[1].Value);
        console.log('Country: ' + movieInfo.Country);
        console.log('Languages: ' + movieInfo.Language);
        console.log('Plot: ' + movieInfo.Plot);
        console.log('Actors: ' + movieInfo.Actors);
    });
}

function writeLog(type, name) {
    fs.appendFile("log.txt", "\nSearch Type: " + type + ' | Searched for: ' + name, function(err) {
        if(err) { return console.log(err);}
    });
}



