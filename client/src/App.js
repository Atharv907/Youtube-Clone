
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Toaster position="top-right" />

      {user ? (
        <>
          <Header 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          <div className="app-body">
            <Sidebar collapsed={sidebarCollapsed} />
            <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
