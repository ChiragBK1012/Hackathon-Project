import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import DoctorAuth from './pages/DoctorAuth';
import PatientAuth from './pages/PatientAuth';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

const AppRoutes = () => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/doctor/auth"
        element={user && userType === 'doctor' ? <Navigate to="/doctor/dashboard" /> : <DoctorAuth />}
      />
      <Route
        path="/patient/auth"
        element={user && userType === 'patient' ? <Navigate to="/patient/dashboard" /> : <PatientAuth />}
      />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

