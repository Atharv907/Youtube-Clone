
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">📺</span>
          <span className="logo-text">YouTube</span>
        </div>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </div>

      <div className="header-right">
        <button className="header-btn">➕</button>
        <button className="header-btn">🔔</button>
        <div className="user-menu-container">
          <button 
            className="user-avatar" 
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {user?.username?.[0]?.toUpperCase() || '👤'}
          </button>
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-name">{user?.username}</div>
                <div className="user-email">{user?.email}</div>
              </div>
              <hr />
              <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                Your Profile
              </button>
              <button onClick={() => { logout(); setShowUserMenu(false); }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
