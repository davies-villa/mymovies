import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import headerBackground from "../assets/headerbackground.jpg";
import Footer from "../components/Footer";
import MovieList from "../components/MovieList";

/**
 * TrendingMoviesHeader Component
 * Displays a header with a search bar to find movies, handles search functionality,
 * and displays results using the MovieList component.
 */
const TrendingMoviesHeader = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [movies, setMovies] = useState([]); // State for fetched movies
  const [showResults, setShowResults] = useState(false); // State to toggle results display
  const [category, setCategory] = useState(""); // State for selected category

  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY; // Ensure this environment variable is set

  /**
   * Fetches movies based on the search term.
   * @param {string} term - The search term or category keyword.
   */
  const searchMovies = useCallback(
    async (term) => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?s=${encodeURIComponent(
            term
          )}&apikey=${API_KEY}`
        );

        if (response.data.Response === "True") {
          setMovies(response.data.Search);
        } else {
          setMovies([]);
          console.error("API Error:", response.data.Error);
        }

        setShowResults(true);

        // Scroll to results section smoothly
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    [API_KEY]
  );

  /**
   * Handles the search form submission.
   * @param {Event} e - The form submission event.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      searchMovies(trimmedTerm);
    }
  };

  /**
   * Handles category button clicks to search movies based on category.
   * @param {string} selectedCategory - The category selected by the user.
   */
  const handleCategoryClick = (selectedCategory) => {
    setCategory(selectedCategory);
    let searchTermByCategory = "";

    switch (selectedCategory.toLowerCase()) {
      case "movies":
        searchTermByCategory = "trending";
        break;
      case "series":
        searchTermByCategory = "series";
        break;
      case "originals":
        searchTermByCategory = "featured";
        break;
      default:
        searchTermByCategory = "movie";
    }

    searchMovies(searchTermByCategory);
  };

  /**
   * Debounce function to limit the rate of API calls during rapid input changes.
   * @param {Function} func - The function to debounce.
   * @param {number} delay - The debounce delay in milliseconds.
   * @returns {Function} - The debounced function.
   */
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  /**
   * Effect to handle debounced search when searchTerm changes.
   */
  useEffect(() => {
    if (searchTerm.trim()) {
      const debouncedSearch = debounce(() => searchMovies(searchTerm), 500);
      debouncedSearch();

      return () => clearTimeout(debouncedSearch);
    }
  }, [searchTerm, searchMovies]);

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
        {/* Fixed Navbar */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Navbar handleCategoryClick={handleCategoryClick} />
        </div>

        {/* Header Content */}
        <div className="relative h-screen flex flex-col justify-center items-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Title and Subtitle */}
          <div className="relative z-10 text-4xl font-extrabold text-center animate__animated animate__fadeInDown text-white flex items-center justify-center flex-col">
            <h1>Watch Movies</h1>
            <p className="text-sm font-medium">Find all your movies here</p>
          </div>

          {/* Search Bar */}
          <div className="relative z-10 mt-6 w-full animate__animated animate__fadeInDown flex-row flex items-center justify-center px-4">
            <form
              onSubmit={handleSearch}
              className="w-full max-w-md"
              aria-label="Search for movies"
            >
              <input
                type="text"
                className="bg-gray-600 bg-opacity-70 text-white text-sm px-2 py-4 rounded-full text-center w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Movie search input"
              />
              <button type="submit" className="hidden">
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <section id="results-section" className="mt-16 bg-card-bg text-left px-4">
        {showResults && (
          <h2 className="text-2xl font-bold text-center mb-4">
            {movies.length > 0
              ? `Results for "${category || searchTerm}"`
              : `No results found for "${category || searchTerm}"`}
          </h2>
        )}
        <MovieList movies={movies} />
        <Footer />
      </section>
    </>
  );
};

export default TrendingMoviesHeader;
