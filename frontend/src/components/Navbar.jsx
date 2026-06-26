import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { selectedCity, cities, changeCity } = useCity();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const [cityDropdown, setCityDropdown] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  };

  const handleCitySelect = (city) => {
    changeCity(city);
    setCityDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '16px auto',
      width: '95%',
      maxWidth: '1280px',
      borderRadius: 'var(--radius-md)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Brand Logo */}
      <Link to="/" className="flex-gap" style={{ cursor: 'pointer' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: 'white',
          fontFamily: 'var(--font-secondary)',
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-neon)',
        }}>
          R
        </div>
        <span style={{
          fontWeight: 800,
          fontFamily: 'var(--font-secondary)',
          fontSize: '1.4rem',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, var(--text-primary), var(--color-primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          RentEase
        </span>
      </Link>

      {/* Center Links & City Selector */}
      <div className="flex-gap" style={{ gap: '24px' }}>
        <Link to="/catalog" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Browse Products</Link>
        
        {/* City Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-outline btn-sm flex-gap"
            onClick={() => setCityDropdown(!cityDropdown)}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            📍 {selectedCity} ▾
          </button>
          
          {cityDropdown && (
            <div className="glass fade-in" style={{
              position: 'absolute',
              top: '120%',
              left: 0,
              minWidth: '150px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 0',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10,
            }}>
              {cities.map((city) => (
                <div
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: selectedCity === city ? '700' : '500',
                    color: selectedCity === city ? 'var(--color-primary)' : 'var(--text-primary)',
                    background: selectedCity === city ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCity !== city) e.target.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCity !== city) e.target.style.background = 'transparent';
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Buttons */}
      <div className="flex-gap" style={{ gap: '16px' }}>
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="btn btn-outline"
          style={{ padding: '8px', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Cart Link */}
        <Link to="/cart" className="btn btn-outline" style={{
          position: 'relative',
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--color-accent)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: '700',
              boxShadow: '0 2px 6px rgba(236,72,153,0.4)',
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth Navigation */}
        {user ? (
          <div className="flex-gap" style={{ gap: '8px' }}>
            <Link 
              to={user.role === 'admin' ? '/admin' : '/portal'}
              className="btn btn-primary btn-sm"
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
