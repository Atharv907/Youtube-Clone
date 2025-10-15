
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user?.avatar} alt={user?.username} className="profile-avatar" />
        <div className="profile-info">
          <h1>{user?.username}</h1>
          <p>{user?.email}</p>
          <p>Subscription: {user?.subscription?.type || 'Free'}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
