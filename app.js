var express = require('express');
var http = require('http')
var app = express();
var socketio = require('socket.io'); //potentially not needed
var server = http.createServer(app);
var io = socketio.listen(server);
var path = require('path');
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var randomID = require("random-id");
var getJSON = require('get-json');
var RateLimiter = require('limiter').RateLimiter;
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/redux';
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
// Variables to hold the messages and the sockets
var stringInfo = [];
// I created an array to hold the movies
//limit the api call
var limiter = new RateLimiter(1, 1000);
app.use(upload.array()); // for parsing multipart/form-data
//Handle our Requests
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
        console.log('Connection established to', url);
        app.locals.db = db;
        var movies = [];
        //start syncing information
        fs.readdir('client/directory', function (err, files) {
            if (err) return;
            files.forEach(function (f) {
                //rename name to readable/syncable format
                var movieName = (path.parse(f).name.replace(/\s/g, '%20'));
                var actualName = (path.parse(f).name);
                movies.push(movieName);
                limiter.removeTokens(1, function () { //remove api call limit
                    //search the movies collection for matching file names
                    db.collection('movies', function (err, collection) {
                        collection.findOne({
                            real_name: {
                                $exists: true
                                , $eq: movieName
                            }
                        }, function (err, doc) {
                            if (doc) {
                                //if names are present in collection then skip
                                console.log("--SKIPPING: " + actualName + " is already in the the DB!");
                            }
                            else {
                                //if names are not present in collection then search the api and add to the database
                                console.log("--ADDING: " + actualName + " to the DB!");
                                //search the API for the movie name
                                getJSON("https://api.themoviedb.org/3/search/movie?api_key=9a094988e96e2398c36e5d3b8727b1c0&language=en-US&query=" + movieName, function (error, data) {
                                    if (data.results[0] != undefined) {
                                        data.results[0].filepath = "directory/" + f + "";
                                        //save the movie id to search for cast information
                                        var id = data.results[0].id;
                                        //save the poster image for each film to local folder
                                        posterOptions = {
                                            host: "image.tmdb.org"
                                            , port: 80
                                            , path: "/t/p/w500" + data.results[0].poster_path
                                        }
                                        var request = http.get(posterOptions, function (res) {
                                            var imagedata = ''
                                            res.setEncoding('binary')
                                            res.on('data', function (chunk) {
                                                imagedata += chunk
                                            });
                                            res.on('end', function () {
                                                fs.writeFile("client/images/posters/" + movieName + '.jpg', imagedata, 'binary', function (err) {
                                                    if (err) throw err
                                                    console.log('Poster image saved')
                                                });
                                            });
                                        });
                                        //save backdrop image for each file to local folder
                                        backdropOptions = {
                                            host: "image.tmdb.org"
                                            , port: 80
                                            , path: "/t/p/w500" + data.results[0].backdrop_path
                                        }
                                        var request = http.get(backdropOptions, function (res) {
                                            var imagedata = ''
                                            res.setEncoding('binary')
                                            res.on('data', function (chunk) {
                                                imagedata += chunk
                                            });
                                            res.on('end', function () {
                                                fs.writeFile("client/images/backdrops/" + movieName + '.jpg', imagedata, 'binary', function (err) {
                                                    if (err) throw err
                                                    console.log('Backdrop image saved')
                                                });
                                            });
                                        });
                                        //get the cast information from the API
                                        getJSON("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=9a094988e96e2398c36e5d3b8727b1c0", function (error, cData) {
                                            //Each time we loop through the array, we will add the movie to your Movie array
                                            db.collection('movies', function (err, collection) {
                                                collection.insert({
                                                    //inserting information to database
                                                    _id: data.results[0].id
                                                    , title: data.results[0].title
                                                    , real_name: movieName
                                                    , file_name: f
                                                    , overview: data.results[0].overview
                                                    , release_date: data.results[0].release_date
                                                    , poster_path: data.results[0].poster_path
                                                    , backdrop_path: data.results[0].backdrop_path
                                                    , genre_ids: data.results[0].genre_ids[0]
                                                    , cast: [cData.cast[0].name, cData.cast[1].name, cData.cast[2].name]
                                                    , director: cData.crew[0].name
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });
            //find any documents in the db that no longer has a physical file and delete it from the collection
            db.collection('movies', function (err, collection) {
                collection.remove({
                    real_name: {
                        $nin: movies
                    }
                });
            });
        });
    }
});
io.on('connection', function (socket) {
    console.log('user connected');
    app.locals.db.collection('movies', function (err, collection) {
        collection.find().toArray(function (err, data) {
            socket.emit('data', data);
        });
    });
    socket.on('delete', function (mtd) {
        var mrd = mtd;
        console.log('deleting ' + mtd);
                fs.unlink('client/directory/' + mtd);
                app.locals.db.collection('movies', function (err, collection) {
                    collection.remove({
                        file_name: {
                            $eq: mtd
                        }
                    });
                });
    })
});
//start server
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Our server is listening at", addr.address + ":" + addr.port);
});