async function handleSearch() {
  const searchedMovie = document.getElementById('search-input').value
  
  const response = await (await fetch(`https://imdb-api.com/API/SearchMovie/k_wnoel9ay/${searchedMovie}`)).json()
  console.log(response.results)
}