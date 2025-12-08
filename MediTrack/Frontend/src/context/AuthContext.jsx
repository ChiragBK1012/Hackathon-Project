import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'doctor' or 'patient'
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try doctor profile first
      try {
        const res = await client.get('/doctor/profile');
        setUser(res.data);
        setUserType('doctor');
        setLoading(false);
        return;
      } catch (err) {
        // Not a doctor, try patient
      }

      // Try patient profile
      try {
        const res = await client.get('/patient/profile');
        setUser(res.data);
        setUserType('patient');
        setLoading(false);
        return;
      } catch (err) {
        // Not authenticated
        setUser(null);
        setUserType(null);
        setLoading(false);
      }
    } catch (error) {
      setUser(null);
      setUserType(null);
      setLoading(false);
    }
  };

  const loginDoctor = async (email, password) => {
    try {
      const res = await client.post('/doctor/login', { email, password });
      setUser(res.data.doctor);
      setUserType('doctor');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const registerDoctor = async (doctorData) => {
    try {
      const res = await client.post('/doctor/register', doctorData);
      setUser(res.data.doctor);
      setUserType('doctor');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const loginPatient = async (email, password) => {
    try {
      const res = await client.post('/patient/login', { email, password });
      setUser(res.data.patient);
      setUserType('patient');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const registerPatient = async (patientData) => {
    try {
      const res = await client.post('/patient/register', patientData);
      setUser(res.data.patient);
      setUserType('patient');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      // Clear cookie by calling logout endpoint if exists, or just clear state
      await client.post('/doctor/logout').catch(() => {});
      await client.post('/patient/logout').catch(() => {});
    } catch (error) {
      // Ignore errors
    } finally {
      setUser(null);
      setUserType(null);
    }
  };

  const refreshUser = async () => {
    if (userType === 'doctor') {
      try {
        const res = await client.get('/doctor/profile');
        setUser(res.data);
      } catch (error) {
        logout();
      }
    } else if (userType === 'patient') {
      try {
        const res = await client.get('/patient/profile');
        setUser(res.data);
      } catch (error) {
        logout();
      }
    }
  };

  const value = {
    user,
    userType,
    loading,
    loginDoctor,
    registerDoctor,
    loginPatient,
    registerPatient,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

