var socket = io('http://localhost:3000');
socket.on('data', function (data) {
    var data = data;
    var i = 0
    for (var titles in data) {
        var i = i + 1
        if (data.hasOwnProperty(titles)) {
            var movieContainer = $('<div class="movie-container" id="' + data[titles].file_name + '"> </div>');
            var movieText = $("<div class='movie-text'></div>");
            var movieTitle = $("<h1 class='movie-title'>" + data[titles].title + " " + "</h1>");
            var movieDesc = $("<span class='movie-desc' style='display: none;'>" + data[titles].overview + " " + "</span>");
            var movieGenre = data[titles].genre_ids;
            var delBtn = $("<button class='delete-movie'>Delete</button>");
            var editBtn = $("<button class='edit-movie'>Edit</button>");
            if (movieGenre == 28) {
                movieGenre = "<p id='genre' class='action'>Action</p>";
            }
            if (movieGenre == 12) {
                movieGenre = "<p id='genre' class='adventure'>Adventure</p>";
            }
            if (movieGenre == 16) {
                movieGenre = "<p id='genre' class='animation'>Animation</p>";
            }
            if (movieGenre == 35) {
                movieGenre = "<p id='genre' class='comedy'>Comedy</p>";
            }
            if (movieGenre == 80) {
                movieGenre = "<p id='genre' class='crime'>Crime</p>";
            }
            if (movieGenre == 99) {
                movieGenre = "<p id='genre' class='documentary'>Documentary</p>";
            }
            if (movieGenre == 18) {
                movieGenre = "<p id='genre' class='drama'>Drama</p>";
            }
            if (movieGenre == 10751) {
                movieGenre = "<p id='genre' class='family'>Family</p>";
            }
            if (movieGenre == 14) {
                movieGenre = "<p id='genre' class='fantasy'>Fantasy</p>";
            }
            if (movieGenre == 36) {
                movieGenre = "<p id='genre' class='history'>History</p>";
            }
            if (movieGenre == 27) {
                movieGenre = "<p id='genre' class='horror'>Horror</p>";
            }
            if (movieGenre == 10402) {
                movieGenre = "<p id='genre' class='music'>Music</p>";
            }
            if (movieGenre == 9648) {
                movieGenre = "<p id='genre' class='myster'>Mystery</p>";
            }
            if (movieGenre == 10749) {
                movieGenre = "<p id='genre' class='romance'>Romance</p>";
            }
            if (movieGenre == 878) {
                movieGenre = "<p id='genre' class='scifi'>Science Fiction</p>";
            }
            if (movieGenre == 10770) {
                movieGenre = "<p id='genre' class='tvmovie'>TV Movie</p>";
            }
            if (movieGenre == 53) {
                movieGenre = "<p id='genre' class='thriller'>Thriller</p>";
            }
            if (movieGenre == 10752) {
                movieGenre = "<p id='genre' class='war'>War</p>";
            }
            if (movieGenre == 371) {
                movieGenre = "<p id='genre' class='wastern'>Western</p>";
            }
            $('#allContainer').append(movieContainer);
            $(movieContainer).append(movieGenre);
            $(movieContainer).append(movieDesc);
            $(movieContainer).append(movieText);
            $(movieContainer).append(delBtn);
            $(movieContainer).append(editBtn);
            $(movieText).append(movieTitle);
        }
        else {}
    }
    $('.delete-movie').click(function () {
        console.log('delete');
        $(this).parent().remove();
        var mtd = $(this).parent().attr('id');
        console.log(mtd);
        socket.emit('delete', mtd);
    });
});