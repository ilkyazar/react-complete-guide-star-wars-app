import React, { useState, useEffect, useCallback } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Should use useCallback hook here
  // Because otherwise, since the dependency is a function in useEffect hook
  // and since functions are objects
  // it will change in each execution => infinite loop

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      //const swapiUrl = 'https://swapi.dev/api/films/';
      const fbUrl =
        'https://rcg-star-wars-http-default-rtdb.europe-west1.firebasedatabase.app/movies.json';
      const response = await fetch(fbUrl);
      if (!response.ok) {
        throw new Error('Something went wrong! :(');
      }

      const data = await response.json();
      console.log(data);

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      /* const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      }); */

      // setMovies(transformedMovies);
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);

  // if useEffect would be like:
  // useEffect(() => {
  //  fetchMoviesHandler();
  //});
  // It would run on every re-evaluation => infinite task

  // So, dependencies argument should be added
  // useEffect(() => {
  //  fetchMoviesHandler();
  //}, []);
  // But this won't run again, except for the first time the component is loaded
  // It gives the same result that we want, but
  // it's not the clean way
  // List all dependencies you use in useEffect => best practice

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>No movies found</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  async function addMovieHandler(movie) {
    const response = await fetch(
      'https://rcg-star-wars-http-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
