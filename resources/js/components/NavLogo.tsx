import React from 'react'; // Make sure React is imported if this is a standalone component file
import navLogo from '/public/logo/nav-logo.png'; // Adjust the path to your image file

const NavLogo = () => {
  return (
    <a href="/" className="flex items-center space-x-2 cursor-pointer">
      <img
        src={navLogo}
        alt="Cripto Oasis Logo"
        className="h-auto w-auto" // Set a fixed height and auto-width to maintain aspect ratio
      />
    </a>
  );
};

export default NavLogo;