import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          SQL Studio
        </Link>
        
        <nav className="header__nav">
          <Link 
            to="/" 
            className={`header__nav-link ${location.pathname === '/' ? 'header__nav-link--active' : ''}`}
          >
            Practice
          </Link>
          <Link 
            to="/about" 
            className={`header__nav-link ${location.pathname === '/about' ? 'header__nav-link--active' : ''}`}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;