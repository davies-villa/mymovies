import React from "react";

const Footer = () => {
  return (
    <footer className="bg-none text-sm text-gray-600 p-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} mymovies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
