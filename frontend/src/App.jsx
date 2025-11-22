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
import DMCReceivedContracts from './pages/DMCReceivedContracts';
import DMCContractDetail from './pages/DMCContractDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardNew from './pages/AdminDashboardNew';
import AdminHome from './pages/AdminHome';
import DMCApprovals from './pages/DMCApprovals';
import HotelApprovals from './pages/HotelApprovals';
import DMCProfileRegister from './pages/DMCProfileRegister';
import DMCProfile from './pages/DMCProfile';
import HotelProfileRegister from './pages/HotelProfileRegister';

// Bid Inquiry Pages
import PostInquiryForm from './pages/PostInquiryForm';
import DMCInquiriesPage from './pages/DMCInquiriesPage';
import InquiryDetailsPage from './pages/InquiryDetailsPage';
import HotelInquiriesPage from './pages/HotelInquiriesPage';
import SubmitBidForm from './pages/SubmitBidForm';
import HotelBidsPage from './pages/HotelBidsPage';
import HotelInquiryDetails from './pages/HotelInquiryDetails';

//messages
import DMCMessages from './pages/DMCMessages.jsx';
import HotelMessages from './pages/HotelMessages.jsx';

// Contracts
import MyContracts from './pages/MyContracts.jsx';
import HotelContractBuilder from './pages/HotelContractBuilder.jsx';

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
            path="/hotel/profile/register"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelProfileRegister />
              </ProtectedRoute>
            }
          />
          
          {/* Hotel Bid Inquiry Routes */}
          <Route
            path="/hotel/inquiries"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelInquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/inquiries/:inquiryId/bid"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <SubmitBidForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel/bids"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelBidsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hotel/mycontracts"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <MyContracts />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hotel/sendcontracts"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelContractBuilder />
              </ProtectedRoute>
            }
          />

          {/* DMC Messages */} 
            <Route
            path="/hotel/messages"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelMessages />
              </ProtectedRoute>
            }
          />

          <Route path="/hotel/inquiries/:inquiryId" element={<HotelInquiryDetails />} />

          
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
            path="/dmc/received-contracts"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCReceivedContracts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dmc/received-contracts/:contractId"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCContractDetail />
              </ProtectedRoute>
            }
          />

          {/* DMC Messages */} 
            <Route
            path="/dmc/messages"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCMessages />
              </ProtectedRoute>
            }
          />
          
          {/* DMC Bid Inquiry Routes */}
          <Route
            path="/dmc/inquiries"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCInquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/inquiries/post"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <PostInquiryForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/inquiries/:inquiryId"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <InquiryDetailsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                {/* <AdminDashboard /> */}
                <AdminDashboardNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardNew />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="dmc-approvals" element={<DMCApprovals />} />
            <Route path="hotel-approvals" element={<HotelApprovals />} />
          </Route>

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