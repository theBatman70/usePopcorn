import { useEffect, useState } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchSearchResults() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${query}`,
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
        }
      }
      //   handleCloseMovie();
      if (query.length > 2) fetchSearchResults();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoading };
}
