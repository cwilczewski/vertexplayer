var socket = io('http://localhost:3000');
socket.on('data', function (data) {
    console.log(data)
    var data = data;
    var i = 0
    for (var titles in data) {
        var i = i + 1
        if (data.hasOwnProperty(titles)) {
            var movieContainer = $('<div class="movie-container" id="' + data[titles]._id + '" movie-name="' + data[titles].file_name + '"><div class="movie-overlay"></div></div>');
            var moviePoster = $("<img class='movie-poster' src='images/posters" + data[titles].poster_path + "'>")
            var movieText = $("<div class='movie-text'></div>");
            var movieTitle = $("<h1 class='movie-title'>" + data[titles].title + " " + "</h1>");
            var movieDesc = $("<span class='movie-desc' style='display: none;'>" + data[titles].overview + " " + "</span>");
            var movieGenre = data[titles].genre_ids;
            var delBtn = $("<button class='btn delete-movie'><i class='fa fa-trash' aria-hidden='true'></i></button>");
            var editBtn = $("<button class='btn edit-movie'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button>");
            var playBtn = $("<button class='btn play-movie'>Play</button>");
            //            if (movieGenre == 28) {
            //                movieGenre = "<p id='genre' class='action'>Action</p>";
            //            }
            //            if (movieGenre == 12) {
            //                movieGenre = "<p id='genre' class='adventure'>Adventure</p>";
            //            }
            //            if (movieGenre == 16) {
            //                movieGenre = "<p id='genre' class='animation'>Animation</p>";
            //            }
            //            if (movieGenre == 35) {
            //                movieGenre = "<p id='genre' class='comedy'>Comedy</p>";
            //            }
            //            if (movieGenre == 80) {
            //                movieGenre = "<p id='genre' class='crime'>Crime</p>";
            //            }
            //            if (movieGenre == 99) {
            //                movieGenre = "<p id='genre' class='documentary'>Documentary</p>";
            //            }
            //            if (movieGenre == 18) {
            //                movieGenre = "<p id='genre' class='drama'>Drama</p>";
            //            }
            //            if (movieGenre == 10751) {
            //                movieGenre = "<p id='genre' class='family'>Family</p>";
            //            }
            //            if (movieGenre == 14) {
            //                movieGenre = "<p id='genre' class='fantasy'>Fantasy</p>";
            //            }
            //            if (movieGenre == 36) {
            //                movieGenre = "<p id='genre' class='history'>History</p>";
            //            }
            //            if (movieGenre == 27) {
            //                movieGenre = "<p id='genre' class='horror'>Horror</p>";
            //            }
            //            if (movieGenre == 10402) {
            //                movieGenre = "<p id='genre' class='music'>Music</p>";
            //            }
            //            if (movieGenre == 9648) {
            //                movieGenre = "<p id='genre' class='myster'>Mystery</p>";
            //            }
            //            if (movieGenre == 10749) {
            //                movieGenre = "<p id='genre' class='romance'>Romance</p>";
            //            }
            //            if (movieGenre == 878) {
            //                movieGenre = "<p id='genre' class='scifi'>Science Fiction</p>";
            //            }
            //            if (movieGenre == 10770) {
            //                movieGenre = "<p id='genre' class='tvmovie'>TV Movie</p>";
            //            }
            //            if (movieGenre == 53) {
            //                movieGenre = "<p id='genre' class='thriller'>Thriller</p>";
            //            }
            //            if (movieGenre == 10752) {
            //                movieGenre = "<p id='genre' class='war'>War</p>";
            //            }
            //            if (movieGenre == 371) {
            //                movieGenre = "<p id='genre' class='wastern'>Western</p>";
            //            }
            $('#allContainer').prepend(movieContainer);
            $(movieContainer).append(moviePoster);
            //$(movieContainer).append(movieGenre);
            //$(movieContainer).append(movieDesc);
            //$(movieContainer).append(movieText);
            $(movieContainer).append(delBtn);
            $(movieContainer).append(editBtn);
            $(movieText).append(movieTitle);
        }
        else {}
    }
    $('.delete-movie').click(function () {
        console.log('delete');
        $(this).parent().remove();
        var mtd = $(this).parent().attr('movie-name');
        console.log(mtd);
        socket.emit('delete', mtd);
    });
    //Function for mouseover, can't use hover as that would make info disappear on mouseout
    $('.movie-container').click(function () {
        var selected = $(this);
        $('#write').val("");
        searchShow();
        selected.children('.btn').css('opacity', '1')
        $('#movie-info').fadeOut(200, function () {
            var meta = selected.attr('id');
            console.log(meta)
            for (var titles in data) {
                if (data[titles]._id == meta) {
                    $('#movie-name').text(data[titles].title);
                    $('#movie-plot').text(data[titles].overview);
                    $('#movie-cast').text('Starring: ' + data[titles].cast.join(', '));
                    $('#movie-info').append(playBtn);
                    $('.filepath').val(data[titles].file_name);
                };
            };
            setTimeout(function () {
                $('.play-movie').click(function () {
                    var selectedMovie = $(this).parent('#movie-info').children('.filepath').val();
                    var video = document.getElementById('videoPlayer');
                    var source = document.createElement('source');
                    var check = selectedMovie.includes('.mkv');
                    source.setAttribute('src', selectedMovie);
                    if (check == true){
                        source.setAttribute('type', 'video/mp4');
                    };
                    video.appendChild(source);
                    video.load()
                    console.log(source);
                    video.currentTime = 0;
                    $('.player').css('visibility', 'visible');
                    $('.player').css('opacity', '1');
                    $('.player').css('display', 'inherit');
                    setTimeout(function () {
                        video.play();
                    }, 2000);
                    $('#close').css('visibility', 'visible');
                    $('#close').css('opacity', '1');
                });
            }, 1000);
            $('#close').click(function () {
                console.log("clicked");
                var player = $('.video-player');
                var video = document.getElementById('videoPlayer');
                $('.player').css('visibility', 'hidden');
                $('.player').css('opacity', '0');
                $('.player').css('display', 'none');
                $('#close').css('visibility', 'hidden');
                $('#close').css('opacity', '0');
                video.pause();
                $('#videoPlayer > source').remove()
            })
            $('#movie-info').fadeIn(200);
        })
        $('#movie-backdrop').fadeOut(200, function () {
            var meta = selected.attr('id');
            for (var titles in data) {
                if (data[titles]._id == meta) {
                    $('#movie-backdrop').css('background-image', 'url(images/backdrops' + data[titles].backdrop_path + ')')
                }
            }
            $('#movie-backdrop').fadeIn(200);
        })
    });
    //Hides buttons on mouse out
    $('.movie-container').mouseover(function () {
        var selected = $(this);
        selected.children('.btn').css('opacity', '1')
        selected.children('.movie-overlay').css('opacity', '1')
    })
    $('.movie-container').mouseout(function () {
            var selected = $(this);
            selected.children('.btn').css('opacity', '0')
            selected.children('.movie-overlay').css('opacity', '0')
        })
        //Handles search box functionality
    var $write = $('#write')
        , shift = false
        , capslock = false;
    $('#keyboard li').click(function () {
        var $this = $(this)
            , character = $this.html();
        // Delete
        if ($this.hasClass('delete')) {
            var html = $write.val();
            $write.val(html.substr(0, html.length - 1));
            searchShow();
            return false;
        }
        //Space
        if ($this.hasClass('space')) character = ' ';
        // Add the character
        $write.val($write.val() + character);
        searchShow();
    });
    //Shows the search box
    function searchShow() {
        if ($write.val()) {
            $write.css('top', '0px')
        }
        else if ($write.val().length < 1) {
            $write.css('top', '-80px')
        }
    }
    searchShow()
});

setTimeout(function () {
    /* Get Our Elements */
    const player = document.querySelector('.player');
    const video = player.querySelector('.viewer');
    const progress = player.querySelector('.progress');
    const progressBar = player.querySelector('.progress-filled');
    const toggle = player.querySelector('.toggle');
    const skipButtons = player.querySelectorAll('[data-skip]');
    const ranges = player.querySelectorAll('.player-slider');
    /* Build out functions */
    function togglePlay() {
        const method = video.paused ? 'play' : 'pause';
        video[method]();
    }

    function updateButton() {
        const icon = this.paused ? '<img src="ui-images/play.png" alt="Play">' : '<img src="ui-images/pause.png" id="pause" alt="Pause">';
        //  console.log(icon);
        toggle.innerHTML = icon;
    }

    function skip() {
        video.currentTime += parseFloat(this.dataset.skip);
    }

    function handleRangeUpdate() {
        video[this.name] = this.value;
    }

    function handleProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.flexBasis = `${percent}%`;
    }

    function scrub(e) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
    }
    /* Hook up the event listners */
    //video.addEventListener('click', togglePlay);
    video.addEventListener('play', updateButton);
    video.addEventListener('pause', updateButton);
    video.addEventListener('timeupdate', handleProgress);
    toggle.addEventListener('click', togglePlay);
    skipButtons.forEach(button => button.addEventListener('click', skip));
    ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
    ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
    let mousedown = false;
    progress.addEventListener('click', scrub);
    progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progress.addEventListener('mousedown', () => mousedown = true);
    progress.addEventListener('mouseup', () => mousedown = false);
    var timeout = null;
    $(document).on('mousemove', function () {
        clearTimeout(timeout);
        $('.controls').addClass('move');
        $('.overlay').addClass('move');  
        $('#close').css('opacity', '1') 
        timeout = setTimeout(function () {
            console.log('Mouse idle');
            $('.controls').removeClass('move');
            $('.overlay').removeClass('move'); 
            $('#close').css('opacity', '0') 
        }, 3000);
    });
}, 5000)