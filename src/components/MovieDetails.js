import { useEffect, useState, useRef } from "react";
import { KEY } from "./App";
import Loader from "./utils/Loader";
import StarRating from "./utils/StarRating";
import { useKey } from "./utils/customHooks/useKey";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  isWatched,
  watchedUserRating,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState();
  const [userRating, setUserRating] = useState();
  const countRef = useRef(0);

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        const {
          imdbID,
          Title: title,
          Year: year,
          Poster: poster,
          Runtime: runtime,
          imdbRating,
          Plot: plot,
          Released: released,
          Actors: actors,
          Director: director,
          Genre: genre,
          Ratings: ratings,
        } = data;
        const movie = {
          imdbID,
          title,
          year,
          poster,
          runtime,
          imdbRating,
          plot,
          released,
          actors,
          director,
          genre,
          ratings,
        };
        setMovie(movie);
        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [selectedId, onCloseMovie]
  );

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const {
    imdbID,
    title,
    year,
    poster,
    runtime,
    imdbRating,
    plot,
    released,
    actors,
    director,
    genre,
  } = movie;

  useEffect(
    function () {
      if (!title) return;
      document.title = `${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => handleAddWatched(movie)}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated the movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );

  function handleAddWatched() {
    onAddWatched({
      title,
      poster,
      imdbRating,
      year,
      imdbID,
      runtime,
      userRating,
      countRatingDecisions: countRef,
    });
  }
}
