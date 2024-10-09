import React, { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]); 
  const [newNotifications, setNewNotifications] = useState(true); 
  const searchRef = useRef(null); 
  const bellRef = useRef(null);
  const navRef = useRef(null);

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  // Function to fetch notifications from OMDB API
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://www.omdbapi.com/?s=movie&apikey=YOUR_OMDB_API_KEY'); 
      const data = await response.json();
      const notificationsData = data.Search.map((movie) => ({
        id: movie.imdbID,
        message: `New movie: "${movie.Title}" released!`,
        image: movie.Poster, 
      }));
      setNotifications(notificationsData);
      if (notificationsData.length > 0) {
        setNewNotifications(true); 
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications(); 
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        bellRef.current && !bellRef.current.contains(event.target) &&
        navRef.current && !navRef.current.contains(event.target)
      ) {
        setIsSearching(false); 
        setNotificationMenuOpen(false);
        setMenuOpen(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to toggle the notification dropdown menu
  const toggleNotificationMenu = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
    if (!notificationMenuOpen) {
      setNewNotifications(false);
    }
  };

  // Function to toggle the hamburger menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-6 text-white">
      {/* Logo on the top left */}
      <div className="text-xl font-bold">mymovies</div>

      {/* Centered navigation and search */}
      <div
        className="lg:flex items-center hidden rounded-full shadow-custom-black bg-gray-400 text-white p-3"
        ref={searchRef}
      >
        {!isSearching ? (
          <>
            <a href="#" className="hover:text-gray-600 px-4">
              Movies
            </a>
            <a href="#" className="hover:text-gray-600 px-4">
              Series
            </a>
            <a href="#" className="hover:text-gray-600 px-4">
              Originals
            </a>

            {/* Search icon */}
            <button className="flex items-center" onClick={handleSearchClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 p-4 bg-gray-600 hover:bg-slate-500 text-white rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </>
        ) : (
          <input
            type="text"
            placeholder="Search for movies"
            className="rounded-full placeholder-gray-400"
          />
        )}
      </div>

      {/* Icons and Navigation Menu on the top right */}
      <div className="flex items-center space-x-6">
        {/* Bell Icon with Dropdown */}
        <div className="relative" ref={bellRef}>
          <button className="focus:outline-none relative" onClick={toggleNotificationMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white hover:bg-gray-200 hover:rounded-full hover:p-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            {newNotifications && (
              <span className="absolute right-0 top-0 bg-red-600 text-white text-xs rounded-full h-2 w-2 flex items-center justify-center">
              </span>
            )}
          </button>

          {notificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 h-auto bg-white text-black rounded shadow-lg z-10">
              <ul className="p-2 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id} className="flex items-center py-1 px-2 hover:bg-gray-200">
                      <img
                        src={notification.image}
                        alt="Notification"
                        className="w-12 h-12 rounded-full mr-2"
                      />
                      <span>{notification.message}</span>
                    </li>
                  ))
                ) : (
                  <li className="py-1 px-2">No new notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="relative" ref={navRef}>
          <button className="focus:outline-none" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white hover:bg-gray-200 hover:rounded-full hover:p-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M3 12h18M3 18h18"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 h-auto bg-white text-black rounded shadow-lg z-10">
              <ul className="p-2">
                <li className="py-1 px-2 hover:bg-gray-200">
                  <a href="#">Home</a>
                </li>
                <li className="py-1 px-2 hover:bg-gray-200">
                  <a href="#">Popular Movies</a>
                </li>
                <li className="py-1 px-2 hover:bg-gray-200">
                  <a href="#">Upcoming Movies</a>
                </li>
                <li className="py-1 px-2 hover:bg-gray-200">
                  <a href="#">Top Rated</a>
                </li>
                <li className="py-1 px-2 hover:bg-gray-200">
                  <a href="#">Genres</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
