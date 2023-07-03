import React, { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';
import MovieContainer from './MovieContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';

const Api_Url = "https://api.themoviedb.org/3/movie/popular?api_key=1981560961ae681bf895ea4b306d0a77";
const Api_Search = "https://api.themoviedb.org/3/search/movie?api_key=1981560961ae681bf895ea4b306d0a77&query";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoviesFromTmdb();
  }, []);

  const fetchMoviesFromTmdb = async () => {
    try {
      const res = await fetch(Api_Url);
      const data = await res.json();
      console.log(data);
      setMovies(data.results);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const searchMovie = async (e) => {
    e.preventDefault();
    console.log('Searching');
    if (query.trim() === '') {
      fetchMoviesFromTmdb();
      return;
    }

    try {
      const url = `${Api_Search}=${query}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);

      const database = firebase.database();
      const searchQueryRef = database.ref(`movies/${query}`);
      searchQueryRef.set(data.results);
      setMovies(data.results);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const changeHandler = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid className="d-flex justify-content-center">
          <Navbar.Brand href="/">Trending Movies</Navbar.Brand>
          <Form className="d-flex" onSubmit={searchMovie} autoComplete="off">
            <FormControl
              type="search"
              placeholder="Movie Search"
              className="me-2"
              aria-label="search"
              name="query"
              value={query}
              onChange={changeHandler}
              style={{ minWidth: '500px' }}
            />
            <Button type="submit">
              Search
            </Button>
          </Form>
        </Container>
      </Navbar>
      <div>
        {loading ? (
          <h2>Loading...</h2>
        ) : movies.length > 0 ? (
          <div className="container">
            <div className="grid">
              {movies.map((movieReq) => (
                <MovieContainer key={movieReq.id} {...movieReq} />
              ))}
            </div>
          </div>
        ) : (
          <h2>No Movies Were Found!</h2>
        )}
      </div>
    </>
  );
}

export default App;
