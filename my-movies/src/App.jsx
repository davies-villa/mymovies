import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrendingMoviesHeader from './components/TrendingMoviesHeader';
import MovieDetail from './components/MovieDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TrendingMoviesHeader />} />
        <Route path="/movies/:imdbID" element={<MovieDetail />} />

      </Routes>
    </Router>
  );
};

export default App;
