import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Search from "./utils/Search";
import NumResults from "./utils/NumResults";
import ListBox from "./ListBox";
import FreshList from "./freshList/FreshList";
import Summary from "./watchedBox/Summary";
import WatchedList from "./watchedBox/WatchedList";
import MovieDetails from "./MovieDetails";
import Loader from "./utils/Loader";

export const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const KEY = "eca84296";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const watchedMovie = watchedList.find(
    (watchedMovie) => watchedMovie.imdbID === selectedId
  );

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(addedMovie) {
    setWatchedList([...watchedList, addedMovie]);
    handleCloseMovie();
  }

  function handleDeleteWatched(id) {
    setWatchedList(watchedList.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchSearchResults() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          setIsLoading(false);

          if (!res.ok) {
            throw new Error("Couldn't fetch the data");
          }

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");
          setMovies(data.Search);
        } catch (err) {
          console.log(err);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      handleCloseMovie();
      if (query.length > 2) fetchSearchResults();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {error && <ErrorMessage message={error} />}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <FreshList movies={movies} setSelectedId={setSelectedId} />
          )}
        </ListBox>
        <ListBox>
          {selectedId ? (
            <MovieDetails
              key={selectedId}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              isWatched={watchedMovie ? true : false}
              watchedUserRating={watchedMovie ? watchedMovie.userRating : null}
            />
          ) : (
            <>
              <Summary watched={watchedList} />
              <WatchedList
                watched={watchedList}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function ErrorMessage({ message }) {
  return <p className="error">☢️ {message}</p>;
}
