import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Navbar from "./Navbar";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=${
            import.meta.env.VITE_OMDB_API_KEY
          }`
        );
        setMovie(response.data);
      } catch (error) {
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const actors = movie.Actors.split(", "); 

  
  const renderBadges = () => {
    return movie.Genre.split(", ").map((genre, index) => {
      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-purple-500",
      ];
      return (
        <span
          key={index}
          className={`inline-block px-3 py-1 text-sm font-semibold text-white ${
            colors[index % colors.length]
          } rounded-full mr-2`}
        >
          {genre}
        </span>
      );
    });
  };

  return (
    <div className="container mx-auto p-4 bg-card-bg text-gray-600 rounded-lg shadow-md flex flex-col md:flex-row">
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="w-full md:w-1/3 h-auto object-cover rounded-md mb-4 md:mb-0"
      />
      <div className="fixed top-0 left-0 w-full z-20">
        <Navbar />
      </div>
      <div className="md:ml-4 flex-1">
        <h1 className="text-4xl font-bold mb-2">{movie.Title}</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Plot Summary:</h2>
          <p>{movie.Plot}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Genres:</h2>
          <div className="flex flex-wrap mb-2">{renderBadges()}</div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl text-left font-semibold">Cast:</h2>
          <div className="grid grid-cols-3 gap-4">
            {actors.map((actor, index) => (
              <div key={index} className="flex flex-col justify-start  text-rightitems-center">
                <span>{actor}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Ratings:</h2>
          <ul>
            {movie.Ratings.map((rating, index) => (
              <li key={index}>
                {rating.Source}: {rating.Value}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Release Date:</h2>
          <p>{movie.Released}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
