import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TrendingMoviesHeader from './components/TrendingMoviesHeader';
import MovieDetail from './components/MovieDetails';
import 'animate.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={`animate__animated ${animate ? 'animate__fadeIn' : ''}`}>
      <Routes location={location}>
        <Route path="/" element={<TrendingMoviesHeader />} />
        <Route path="/movies/:imdbID" element={<MovieDetail />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
