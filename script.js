const baseUrl = "https://imdb-api.com/API";
var finalMovieList = [];

async function handleSearch() {
  const searchedMovie = document.getElementById("search-input").value;

  if (searchedMovie) {
    const response = await (
      await fetch(`${baseUrl}/SearchMovie/k_wnoel9ay/${searchedMovie}`)
    ).json();
    const data = response.results;

    const resultsArea = document.getElementById("search-data");
    resultsArea.innerHTML = "";

    data.forEach((movie) => {
      const div = document.createElement("div");
      div.className = "movie";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = movie.id;

      const span = document.createElement("span");
      span.innerText = movie.title;

      div.appendChild(input);
      div.appendChild(span);

      resultsArea.appendChild(div);
    });
  }

  document.getElementById("search-input").value = "";
}

function handleAddMovie() {
  const resultsArea = document.getElementById("search-data");
  const searchedMovies = Array.from(resultsArea.childNodes);

  searchedMovies.forEach((movie) => {
    if (movie.firstChild.checked) {
      finalMovieList.push({
        id: movie.firstChild.id,
        title: movie.lastChild.textContent,
      });
    }

    resultsArea.innerHTML = "";
  });

  renderFinalList();
}

function renderFinalList() {
  if (finalMovieList.length) {
    const listArea = document.getElementById("output-area");
    listArea.innerHTML = "";

    const list = document.createElement("ul");

    finalMovieList.forEach(({ id, title }) => {
      const listItem = document.createElement("li");
      listItem.id = id;
      listItem.innerText = title;

      list.appendChild(listItem);
    });

    listArea.appendChild(list);
  }
}

async function handleSortMovies() {
  if (finalMovieList.length) {
    const getRating = finalMovieList.map(async ({ id, title }) => {
      const response = await (
        await fetch(`${baseUrl}/Ratings/k_wnoel9ay/${id}`)
      ).json();

      const rating = response.imDb;

      return {
        id,
        title,
        rating: Number(rating),
      };
    });

    const moviesWithRating = await Promise.all(getRating);

    const sortedMoviesByRating = moviesWithRating.sort((a, b) => {
      if (a.rating < b.rating) {
        return 1;
      }
      if (a.rating > b.rating) {
        return -1;
      }
      return 0;
    });

    renderSortedList(sortedMoviesByRating);
  }
}

function renderSortedList(list) {
  const area = document.getElementById("output-area");
  area.innerHTML = "";

  const visualList = document.createElement("ol");

  list.forEach(({ title, rating }) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${title} (${rating})`;

    visualList.appendChild(listItem);
  });

  area.appendChild(visualList);
  finalMovieList = [];
}
