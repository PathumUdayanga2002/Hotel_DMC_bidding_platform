import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireSuperAdmin = false,
  fallbackPath = null 
}) => {
  const { user, isAuthenticated, loading, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check super admin requirement
  if (requireSuperAdmin && !isSuperAdmin()) {
    // If fallback path is provided, redirect there
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    // Otherwise, show 403 Forbidden page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is restricted to Super Admins only.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user's role
    switch (user?.role) {
      // New role system
      case 'HOTEL_SUPER_ADMIN':
      case 'HOTEL_STAFF_ADMIN':
        return <Navigate to="/hotel/dashboard" replace />;
      case 'DMC_SUPER_ADMIN':
      case 'DMC_STAFF_ADMIN':
        return <Navigate to="/dmc/dashboard" replace />;
      case 'PLATFORM_SUPER_ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      // Legacy role system (for backward compatibility during migration)
      case 'HOTEL_USER':
        return <Navigate to="/hotel/dashboard" replace />;
      case 'DMC_USER':
        return <Navigate to="/dmc/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
