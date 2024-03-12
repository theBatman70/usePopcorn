export default function FreshList({ movies, setSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <FreshMovie
          key={movie.imdbID}
          movie={movie}
          setSelectedId={setSelectedId}
        />
      ))}
    </ul>
  );
}

function FreshMovie({ movie, setSelectedId }) {
  return (
    <li onClick={() => setSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
