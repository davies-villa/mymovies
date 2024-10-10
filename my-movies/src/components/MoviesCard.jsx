import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MovieCard = ({ imdbID, title, imageUrl }) => {
  const [movieDetails, setMovieDetails] = useState({
    rating: "N/A",
    review: "N/A",
    releaseDate: "N/A",
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`
        );
        const movie = response.data;

        setMovieDetails({
          rating: movie.imdbRating !== "N/A" ? movie.imdbRating : "N/A",
          review: movie.Plot !== "N/A" ? movie.Plot : "No review available",
          releaseDate: movie.Released !== "N/A" ? movie.Released : "Unknown",
        });
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  return (
    <Link to={`/movies/${imdbID}`} className="block">
      <div className="shadow-lg rounded-lg p-6 w-72 mx-auto mb-4 transform transition-transform duration-500 ease-in-out hover:translate-y-[-5px] hover:shadow-xl">
        <div className="mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
        <h3 className="text-sm font-semibold mb-3 text-gray-900">{title}</h3>
        <div className="text-gray-600 mb-2">
          <span className="block text-sm">⭐ Rating: {movieDetails.rating !== "N/A" ? movieDetails.rating : "No rating"}</span>
        </div>
        <div className="text-gray-500 text-sm">
          <span>📅 Released: {movieDetails.releaseDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
