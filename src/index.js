const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=e5ae12f7`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  let terms = searchTerm.split(" ").filter((term) => term.length > 0);
  terms.forEach((term) => {
    searchList.classList.remove("hide-search-list");
    loadMovies(term);
  });
  if (terms.length === 0) {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let index = 0; index < movies.length; index++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[index].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movies[index].Poster != "N/A") moviePoster = movies[index].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
    <div class="search-list-item">
      <div class="search-item-thumbnail">
        <img
          class="mx-2"
          src="${moviePoster}"
          width="250px"
        />
        <div class="search-item-info items-center block">
          <h3>${movies[index].Title}</h3>
          <p>${movies[index].Year}</p>
        </div>
      </div>
    </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=e5ae12f7`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
      <div class="movie-poster">
      <img src="${
        details.Poster != "N/A" ? details.Poster : "image_not_found.png"
      }" alt="movie poster" width="500px" />
    </div>
    <div class="movie-info ml-8">
      <h3 class="movie-title text-xl font-bold">
      ${details.Title}
      </h3>
      <ul class="movie-misc-info flex my-3">
        <li class="year">year: ${details.Year}</li>
        <li class="rated bg-yellow-300 rounded px-2 mx-3">
          Ratings: ${details.Rated}
        </li>
        <li class="released">Released: ${details.Released}</li>
      </ul>
      <p class="genre my-3"><b>Genre:</b> ${details.Genre}</p>
      <p class="writer my-3"><b>Writer:</b> ${details.Writer}</p>
      <p class="actors my-3"><b>Actors:</b> ${details.Actors}</p>
      <p class="plot my-3">
        <b>Plot:</b> ${details.Plot}
      </p>
      <p class="language my-3"><b>Language:</b> ${details.Language}</p>
      <p class="awards my-3"><b>Awards:</b> ${details.Awards}</p>
    </div></p>
        </div>
    `;
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
