import { useState } from "react";
import NavBar from "./NavBar";
import Search from "./utils/Search";
import NumResults from "./utils/NumResults";
import ListBox from "./ListBox";
import FreshList from "./freshList/FreshList";
import Summary from "./watchedBox/Summary";
import WatchedList from "./watchedBox/WatchedList";
import MovieDetails from "./MovieDetails";
import Loader from "./utils/Loader";
import { useMovies } from "./utils/customHooks/useMovies";
import { useLocalStorageState } from "./utils/customHooks/useLocalStorageState";

export default function App() {
  const [watchedList, setWatchedList] = useLocalStorageState([], "watched");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const watchedMovie = watchedList.find(
    (watchedMovie) => watchedMovie.imdbID === selectedId
  );

  const { movies, error, isLoading } = useMovies(query);

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
