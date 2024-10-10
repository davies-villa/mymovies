import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(true);
  const searchRef = useRef(null);
  const bellRef = useRef(null);
  const navRef = useRef(null);
  const overlayRef = useRef(null);

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=movie&apikey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.Response === "True") {
        const categorizedNotifications = data.Search.map((movie) => ({
          id: movie.imdbID,
          type: getRandomNotificationType(),
          message: generateNotificationMessage(movie),
          image:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/150",
        }));
        setNotifications(categorizedNotifications);
        if (categorizedNotifications.length > 0) {
          setNewNotifications(true);
        }
      } else {
        console.error("API Error:", data.Error);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getRandomNotificationType = () => {
    const types = ["New Release", "Now in Cinema", "Awards Won"];
    return types[Math.floor(Math.random() * types.length)];
  };

  const generateNotificationMessage = (movie) => {
    const types = {
      "New Release": `New movie released: "${movie.Title}"!`,
      "Now in Cinema": `"${movie.Title}" is now showing in cinemas!`,
      "Awards Won": `"${movie.Title}" has won awards!`,
    };
    const type = getRandomNotificationType();
    return types[type] || `Check out "${movie.Title}"!`;
  };

  // Function to delete a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Fetch every 60 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target) &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target)
      ) {
        setIsSearching(false);
        setNotificationMenuOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotificationMenu = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
    if (!notificationMenuOpen) {
      setNewNotifications(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Overlay Background */}
      {(notificationMenuOpen || menuOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-35"
          onClick={() => {
            setMenuOpen(false);
            setNotificationMenuOpen(false);
          }}
        />
      )}

      <nav className="flex items-center animate__animated animate__fadeInDown justify-between px-6 py-4 text-white relative z-20">
        {/* Logo */}
        <div className="text-xl font-bold z-10">mymovies</div>

        {/* Centered navigation */}
        <div className="lg:flex items-center hidden text-white">
          <a href="#movies" className="hover:text-gray-600 px-4">
            Movies
          </a>
          <a href="#series" className="hover:text-gray-600 px-4">
            Series
          </a>
          <a href="#originals" className="hover:text-gray-600 px-4">
            Originals
          </a>
        </div>

        {/* Icons and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          <div className="relative" ref={bellRef}>
            <button
              className="focus:outline-none relative"
              onClick={toggleNotificationMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-white hover:text-gray-300 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {newNotifications && (
                <span className="absolute right-0 top-0 bg-red-600 text-white text-xs rounded-full h-2 w-2 flex items-center justify-center"></span>
              )}
            </button>
          </div>

          {/* Notification Menu */}
          <div
            className={`fixed top-0 right-0 h-full w-80 text-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
              notificationMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between bg-gray-900 items-center p-4 ">
              <h2 className="text-lg px-4 font-semibold">Notifications</h2>
              <button
                className="focus:outline-none text-3xl"
                onClick={() => setNotificationMenuOpen(false)}
              >
                &times;
              </button>
            </div>
            <ul className="p-4 overflow-y-auto h-screen bg-gray-900">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-center bg-gray-800 py-7 mt-6 px-4 gap-3 justify-between shadow-custom-black hover:bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={notification.image}
                        alt="Notification"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.type}
                        </p>
                      </div>
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-700 text-xl font-semibold"
                    >
                      &times;
                    </button>
                  </li>
                ))
              ) : (
                <li>No new notifications</li>
              )}
            </ul>
          </div>

          {/* Hamburger Menu */}
          <div className="relative " ref={navRef}>
            <button className="focus:outline-none" onClick={toggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-white hover:text-gray-300  transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
            </button>

            <div
              className={`fixed top-0 right-0 h-screen w-80 bg-gray-900 shadow-lg z-50 transition-transform duration-300 ease-in-out ${
                menuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex justify-between bg-gray-900 items-center p-4">
                <h2 className="text-lg px-4 font-semibold">Menu</h2>
                <button
                  className="focus:outline-none text-3xl"
                  onClick={toggleMenu}
                >
                  &times;
                </button>
              </div>
              <ul className="p-4">
                <li className="hover:bg-gray-700 p-4 rounded">My Profile</li>
                <li className="hover:bg-gray-700 p-4 rounded">Settings</li>
                <li className="hover:bg-gray-700 p-4 rounded">Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
