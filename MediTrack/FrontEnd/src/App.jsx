import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api'; // Update with your backend URL
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Axios interceptor for token management
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Import components (you'll create these)
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import MedicationList from './components/Medications/MedicationList';
import AddMedication from './components/Medications/AddMedication';
import Profile from './components/Profile/Profile';
import Reminders from './components/Reminders/Reminders';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import PrivateRoute from './components/Routes/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/auth/verify');
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          
          <main className="flex-1">
            <Routes>
              <Route 
                path="/login" 
                element={
                  !isAuthenticated ? 
                    <Login onLogin={handleLogin} /> : 
                    <Navigate to="/dashboard" />
                } 
              />
              <Route 
                path="/register" 
                element={
                  !isAuthenticated ? 
                    <Register /> : 
                    <Navigate to="/dashboard" />
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Dashboard user={user} />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/medications" 
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <MedicationList />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/medications/add" 
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <AddMedication />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/reminders" 
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Reminders />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Profile user={user} />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/" 
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;