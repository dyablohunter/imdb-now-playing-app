// A smart and efficient way to loop through objects later on, this allows us to use one function for any object and extract any array of items or keys from that object <<<
Object.prototype.forEach = function () {
    if (!Object.prototype.forEach) {
        Object.defineProperty(Object.prototype, 'forEach', {
            value: function (callback, thisArg) {
                if (this == null) {
                    throw new TypeError('Not an object');
                }
                thisArg = thisArg || window;
                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        callback.call(thisArg, this[key], key, this);
                    }
                }
            }
        });
    }
}
//>>>

// Toggle Genres #sidebar
function toggle() {
    var sidebar = document.getElementById('sidebar');
    var toggleGenres = document.getElementById('toggleGenres');
    if (sidebar.style.display === "") {
        sidebar.style.display = "block";
        sidebar.classList.add("sidebarVisible");
        toggleGenres.innerHTML = 'Hide Genres';
    } else {
        sidebar.style.display = "";
        sidebar.classList.remove("sidebarVisible");
        toggleGenres.innerHTML = 'Show Genres';
    }
}
//>>>

// get the HTML element we need for populating our data
var content = document.getElementById("content"); //the #content element


// Simple HTML slider <<<
var slider = document.getElementById("slider");
var sliderValue = 0;
var output = document.getElementById("vote_average");


output.innerHTML = slider.value; // Displaying the default value of the slider by updating the text of the unique #vote_average HTML element

// on each change of the slider input we update the text value displayed
slider.oninput = function() {
    sliderValue = parseInt(this.value);
    output.innerHTML = sliderValue;
    sortByRating(sliderValue);
}
//>>>


// LOGIC: Filtering the items by rating
var sortByRating = function(value){
    var items = document.getElementsByClassName("item");
    var i;
    for (i = 0; i < items.length; i++) {
        var rating = items[i].getAttribute("rating");

        if (rating >= value) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

// LOGIC: Calling the Genre API on page load <<<
var genre = "{}";

var genreXHR = new XMLHttpRequest();
genreXHR.withCredentials = false;

// We need these vars to be global for use in a different closure
var genresArray = [];
var genresObject;

// We add a listener event for when the state of the request changes
genreXHR.addEventListener("readystatechange", function () {
    // When the request state is "DONE" we do something
    if (this.readyState === this.DONE) {
    //console.log(this.responseText);
        
    genre = this.responseText;
        
    // We parse the text into a JSON Object so we can select different things from it
    var jsonResponse = JSON.parse(genre);
    genresObject = jsonResponse;
        
    // get the HTML element we need for populating our data
    var sidebar = document.getElementById("sidebar"); // the #sidebar element
    
    // Generate Inputs and Labels for genres
    jsonResponse.genres.forEach(function (item, key) {
        genresArray.push(item.id); // add the ID of each genre result to the genresArray variable, followd by
        genresArray.push(item.name); // it's corresponding name
        sidebar.insertAdjacentHTML('beforeend','<input class="genreCheckbox" type="checkbox" name="'+item.name+'" id="'+item.id+'" value="'+item.id+'"> <label for="'+item.id+'">'+item.name+'</label><br>');
    });
    
  }
});

genreXHR.open("GET", "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=1b398ae705721e22cb3099076865ffaf");
genreXHR.send(genre);

//>>>


// LOGIC: Calling the Now Playing API <<<
var data = "{}";

var nowPlayingXHR = new XMLHttpRequest();
nowPlayingXHR.withCredentials = false;

// We add a listener event for when the state of the request changes
nowPlayingXHR.addEventListener("readystatechange", function () {
    // When the request state is "DONE" we do something
    if (this.readyState === this.DONE) {
    //console.log(this.responseText);
        
    // we need to parse the responseText into an object
    nowPlaying = this.responseText;
        
    // We parse the text into a JSON Object so we can select different things from it
    var jsonResponse = JSON.parse(nowPlaying);
    jsonResponse.results.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity));
        
    // let's go through each item and populate the #content element
    jsonResponse.results.forEach(function (item, key) {
        genreIDs = item.genre_ids; // these are the IDs that come for each movie .item
        var genreNames = ''; // need this for the template
        
        // let's use our smart function to check each item against the full list of genres
        genresObject.genres.forEach(function (item, key) {
            // Looping through our full genres list object and checking each time for a corresponding name from our genreIDs of each .item
            genreIDs.forEach(function (val) {
                if (item.id == val) genreNames += '<i>'+item.name+'<b></b></i>'; // adding each name found to match our ID to genreNames var so we can use it in our template below
            });
        });
    
        // Inserting each returned result into it's own .item container, this all goes into the #content div
        content.insertAdjacentHTML('beforeend','<div class="item" popularity="'+item.popularity+'" genres="'+genreIDs+'" rating="'+item.vote_average+'"><img src="https://image.tmdb.org/t/p/w500/'+item.poster_path+'"><div class="title">'+item.title+'</div><div class="genres">'+genreNames+'</div></div>');
    });
        
    sortByRating(sliderValue);
  }
});

nowPlayingXHR.open("GET", "https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=1b398ae705721e22cb3099076865ffaf");
nowPlayingXHR.send(data);
//>>>



// LOGIC: Hiding/Showing items by genres checked, let's first get all values into an array that we can use <<<
var checkboxesArray = []; // array that will store the value of selected checkboxes
function getCheckedInputs(form) {
    checkboxesArray = []; //we reset this every time
    // gets all the input elements
    var checkboxes = form.getElementsByTagName('input');
    var checked = checkboxes.length;
    // traverse the elements and add the value of selected (checked) checkbox in checkboxesArray
    for(var i=0; i < checked; i++) {
        if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked == true) {
            checkboxesArray.push(checkboxes[i].value);
        }
    }
    return checkboxesArray;
}

// Filtering results by checked genres, only when clicking on the Filter button of course
// first we need to store our logic in a function that we can use on Filter button click but also on slider change
var checkSelectedGenres = function(){
    var checked = getCheckedInputs(document.getElementById("sidebar")); // returns our array of genre IDs of each checked checkbox
        checked.forEach(function (val) {
            var items = document.getElementsByClassName('item');
            var i;
            for (i = 0; i < items.length; i++) {
                var genres = items[i].getAttribute("genres");

                if ( checked.every(e => genres.includes(e)) ) {
                    items[i].classList.remove("filteredByGenre");
                } else {
                    items[i].classList.add("filteredByGenre");
                }
            }
        });
        if (checkboxesArray.length == 0) {
            let items = document.getElementsByClassName('item');
            let i;
            for (i = 0; i < items.length; i++) {
                items[i].classList.remove("filteredByGenre");
            }
        }
        document.getElementById('sidebar').style.display = "";
        document.getElementById('toggleGenres').innerHTML = 'Show Genres';
}
document.getElementById('filterResults').onclick = function(){
    checkSelectedGenres();
}
//>>>