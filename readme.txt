IMDB Now Playing App
Version: 1.0 beta
Author: Apetrei Lucian
LinkedIN: https://www.linkedin.com/in/apetreilucian/
License: GNU General Public License 3.0


Hello world!

This is a very simple app written in pure JavaScript, some ES6 features were used.
The app connects to the IMDB api using my key: 1b398ae705721e22cb3099076865ffaf - but you can use your own  of course.
The app is free to use and modify, no strings attached (just remember me when you become a millionaire).


** Quick rundown: **
The API used are the following:

IMDb Movies Now Playing API
IMDb Movie genres API

** Features: **
- Simple HTML minimum rating slider with a range between 0 and 10, increments of 0.5 and a default set to 3.
- Multiple genres input (checkboxes) are shown by clicking the sexy "Show Genres" button which indicates the state of the hidden sidebar with the genres checkboxes. The sidebar contains genres from the TMDb API that are in the returned movie result set.


** What it does: **

- Initially (on page load) displays a list of movies, each showing their title, genres and poster image.
- The movies are ordered by popularity (most popular first - popularity property).
- Movies are filterable by multiple genres, you have the ability to toggle movies depending on all of its assigned genres. For example if 'Action' and 'Drama' genres are selected listed movies have both 'Action' and 'Drama' genres.
- Movies are also filterable by their rating (vote_average property). i.e If rating was set to 3, you can expect to see all movies with a rating of 3 or higher.
- The input API's are only called once, all the filtering is done dynamically with the data already present in the DOM.


Have fun!
