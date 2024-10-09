import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import headerBackground from "../assets/headerbackground.jpg";
import Footer from "../components/Footer"; 
import MovieList from "../components/MovieList";

const TrendingMoviesHeader = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [movies, setMovies] = useState([]); 
  const [showResults, setShowResults] = useState(false); 
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?s=${searchTerm}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`
        );
        setMovies(response.data.Search || []); 
        setShowResults(true);
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
  };

  return (
    <>
      <header
        className="relative h-screen flex bg-custom-gradient flex-col"
        style={{
          backgroundImage: `url(${headerBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="fixed top-0 left-0 w-full z-20">
          <Navbar />
        </div>

        <div className="relative h-screen flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="relative z-10 text-4xl font-extrabold text-center text-white flex items-center justify-center flex-col">
            <h1>Watch Movies</h1>
            <p className="text-sm font-medium">Find all your movies here</p>
          </div>

          <div className="relative z-10 mt-6 w-full flex-row flex items-center justify-center">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                className="bg-gray-600 bg-opacity-70 text-white text-sm px-4 py-4 rounded-full text-center w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>
        </div>
      </header>

      <section className="mt-16 bg-card-bg text-left">
        {showResults && movies.length > 0 && (
          <h2 className="text-2xl font-bold text-center mb-4">
            Results for "{searchTerm}"
          </h2>
        )}
        <MovieList movies={movies} /> 
        <Footer />
      </section>
    </>
  );
};

export default TrendingMoviesHeader;
