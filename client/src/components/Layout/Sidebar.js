
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/', id: 'home' },
    { icon: '⚡', label: 'Shorts', path: '/shorts', id: 'shorts' },
    { icon: '👥', label: 'Subscriptions', path: '/subscriptions', id: 'subscriptions' },
    { separator: true },
    { icon: '👤', label: 'You', path: '/profile', id: 'you' },
    { icon: '📺', label: 'Your videos', path: '/your-videos', id: 'your-videos' },
    { icon: '⏰', label: 'Watch Later', path: '/watch-later', id: 'watch-later' },
    { icon: '👍', label: 'Liked videos', path: '/liked', id: 'liked' },
    { icon: '📥', label: 'Downloads', path: '/downloads', id: 'downloads' }
  ];

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.separator) {
            return <hr key={`separator-${index}`} className="sidebar-separator" />;
          }

          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
              title={collapsed ? item.label : ''}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="subscription-info">
            <h4>Current Plan: {user?.subscription?.type || 'Free'}</h4>
            {user?.subscription?.type === 'Free' && (
              <button 
                className="upgrade-btn"
                onClick={() => navigate('/subscription')}
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
