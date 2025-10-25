import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-4">
      <p className="mb-0">GameTracker &copy; {new Date().getFullYear()} - Tu biblioteca personal de videojuegos</p>
    </footer>
  );
};

export default Footer;