import React from 'react';
import './Navbar.css'; // Import custom CSS for styling (or use inline styles)

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <div className="navbar-logo">
        <img
          src="/frontend/public/bank-logo.png"
          alt="Logo"
         
        />
      </div>

      {/* Center links */}
      <ul className="navbar-links">
        <li><a href="dashboard">Dashboard</a></li>
        <li><a href="payment">Expenses</a></li>
        <li><a href="receipt">Receipt</a></li>
      </ul>

      {/* Login logo on the right */}
      <div className="navbar-login">
        <img
          src="https://via.placeholder.com/40" // Replace with your login icon URL
          alt="Login"
          className="login-icon"
        />
      </div>
    </nav>
  );
};

export default Navbar;
