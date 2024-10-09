import React from "react";
import MovieCard from "./MoviesCard";

const MovieList = ({ movies }) => {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            imdbID={movie.imdbID}
            title={movie.Title}
            imageUrl={movie.Poster}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default MovieList;
