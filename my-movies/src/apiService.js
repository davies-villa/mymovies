import axios from 'axios';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY; 

// Function to fetch movies based on a search term
export const fetchMovies = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}?apikey=${API_KEY}&s=${searchTerm}`);

    if (response.data.Response === 'True') {
      return {
        success: true,
        movies: response.data.Search,
      };
    } else {
      return {
        success: false,
        error: response.data.Error,
      };
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      success: false,
      error: 'An error occurred while fetching movies',
    };
  }
};

// Function to fetch movie details by IMDb ID
export const fetchMovieDetails = async (imdbID) => {
  try {
    const response = await axios.get(`${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);

    if (response.data.Response === 'True') {
      const { Title, Plot, Genre, Actors, Ratings, Poster } = response.data; 

      // Split actors string into an array if needed
      const castArray = Actors.split(', ').map((actor) => {
        const [name, role] = actor.split(' as ');
        return { Name: name, Role: role || 'Actor',}; 
      });

      return {
        success: true,
        movie: {
          Title,
          Plot,
          Genre: Genre.split(', '),
          Cast: castArray,
          Ratings: Ratings, 
          Poster,
        },
      };
    } else {
      return {
        success: false,
        error: response.data.Error,
      };
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      success: false,
      error: 'An error occurred while fetching movie details',
    };
  }
};
