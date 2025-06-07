import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="brand-text">
          <h1>ReZume</h1>
          <p>AI Enhanced Software</p>
        </div>
      </div>

      <button
        className="hamburger"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <nav className={`navbar-right ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>

        <div className="dropdown">
          <button className="dropbtn">Book Online ▾</button>
          <div className="dropdown-content">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Menu ▾</button>
          <div className="dropdown-content">
            <Link to="/home">Dashboard</Link>
          </div>
        </div>

        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>

        <button className="search-icon" aria-label="Search">
          🔍
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
