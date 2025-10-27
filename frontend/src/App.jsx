import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HotelRegisterPage from './pages/HotelRegisterPage';
import DMCRegisterPage from './pages/DMCRegisterPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import HotelDashboard from './pages/HotelDashboard';
import DMCDashboard from './pages/DMCDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DMCProfileRegister from './pages/DMCProfileRegister';
import DMCProfile from './pages/DMCProfile';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/hotel" element={<HotelRegisterPage />} />
          <Route path="/register/dmc" element={<DMCRegisterPage />} />
          <Route path="/register/admin" element={<AdminRegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/hotel/dashboard"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/profile/register"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCProfileRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/profile"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
};

export default App;