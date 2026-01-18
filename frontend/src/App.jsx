import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HotelRegisterPage from './pages/HotelRegisterPage';
import DMCRegisterPage from './pages/DMCRegisterPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import HotelDashboard from './pages/HotelDashboard';
import HotelLayout from './layouts/HotelLayout';
import DMCLayout from './pages/DMCLayout';
import DMCHome from './pages/DMCHome';
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

// Legal & Info Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// RBAC Pages
import DMCStaffManagement from './pages/DMCStaffManagement';
import HotelStaffManagement from './pages/HotelStaffManagement';
import ActivityLogs from './pages/ActivityLogs';

// Bid Inquiry Pages
import PostInquiryForm from './pages/PostInquiryForm';
import DMCInquiriesPage from './pages/DMCInquiriesPage';
import InquiryDetailsPage from './pages/InquiryDetailsPage';
import HotelInquiriesPage from './pages/HotelInquiriesPage';
import SubmitBidForm from './pages/SubmitBidForm';
import HotelBidsPage from './pages/HotelBidsPage';
import HotelInquiryDetails from './pages/HotelInquiryDetails';
import HotelDirectInquiriesPage from './pages/HotelDirectInquiriesPage';

// Payment Pages - OLD SYSTEM REMOVED (PaymentInitiation, PaymentReturn, PaymentCancel)
import DMCPaymentHistory from './pages/DMCPaymentHistory';
import HotelPaymentHistory from './pages/HotelPaymentHistory';

import AdminUserManagement from './pages/AdminUserManagement';
import AdminSettings from './pages/AdminSettings';
import PlatformAnalytics from './pages/PlatformAnalytics';

//messages
import DMCMessages from './pages/DMCMessages.jsx';
import HotelMessages from './pages/HotelMessages.jsx';
import AdminMessages from './pages/AdminMessages.jsx';

// Contracts
import MyContracts from './pages/MyContracts.jsx';
import HotelContractBuilder from './pages/HotelContractBuilder.jsx';

// Direct Inquiry
import DMCDirectInquiry from './pages/DMCDirectInquiry.jsx';
import DMCHotelSelection from './pages/DMCHotelSelection.jsx';
import DMCDirectInquiryHistory from './pages/DMCDirectInquiryHistory.jsx';

// Subscription
import SubscriptionPlanIntro from './pages/SubscriptionPlanIntro.jsx';
import SubscriptionPurchase from './pages/SubscriptionPurchase.jsx';
import AdminSubscriptionManagement from './pages/AdminSubscriptionManagement.jsx';
import AdminSubscriptionDetail from './pages/AdminSubscriptionDetail.jsx';

const App = () => {
  // Role constants for easier management
  const HOTEL_ROLES = ['HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN'];
  const DMC_ROLES = ['DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN'];
  const ADMIN_ROLES = ['ADMIN', 'PLATFORM_SUPER_ADMIN'];
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<SubscriptionPlanIntro />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register/hotel" element={<HotelRegisterPage />} />
          <Route path="/register/dmc" element={<DMCRegisterPage />} />
          <Route path="/register/admin" element={<AdminRegisterPage />} />

          {/* Legal & Info Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* Subscription Routes (for both Hotel and DMC users) */}
          <Route
            path="/subscription/purchase"
            element={
              <ProtectedRoute allowedRoles={[...HOTEL_ROLES, ...DMC_ROLES]}>
                <SubscriptionPurchase />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/hotel"
            element={
              <ProtectedRoute allowedRoles={HOTEL_ROLES}>
                <HotelLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HotelDashboard />} />
            <Route path="dashboard" element={<HotelDashboard />} />
            <Route path="profile/register" element={<HotelProfileRegister />} />

            {/* Hotel Bid Inquiry Routes */}
            <Route path="inquiries" element={<HotelInquiriesPage />} />
            <Route path="inquiries/:inquiryId/bid" element={<SubmitBidForm />} />
            <Route path="inquiries/:inquiryId" element={<HotelInquiryDetails />} />
            <Route path="direct-inquiries" element={<HotelDirectInquiriesPage />} />
            <Route path="bids" element={<HotelBidsPage />} />

            <Route path="mycontracts" element={<MyContracts />} />
            <Route path="sendcontracts" element={<HotelContractBuilder />} />

            {/* Hotel Staff Management - Super Admin Only */}
            <Route
              path="staff"
              element={
                <ProtectedRoute allowedRoles={HOTEL_ROLES} requireSuperAdmin={true}>
                  <HotelStaffManagement />
                </ProtectedRoute>
              }
            />

            {/* Hotel Activity Logs */}
            <Route path="activity-logs" element={<ActivityLogs portalType="hotel" />} />

            {/* Hotel Payment Routes */}
            <Route path="payments" element={<HotelPaymentHistory />} />
          </Route>

          {/* DMC Routes - All nested within DMCLayout */}
          <Route
            path="/dmc"
            element={
              <ProtectedRoute allowedRoles={DMC_ROLES}>
                <DMCLayout />
              </ProtectedRoute>
            }
          >
            {/* DMC Dashboard Home */}
            <Route path="dashboard" element={<DMCHome />} />
            
            {/* DMC Profile */}
            <Route path="profile/register" element={<DMCProfileRegister />} />
            <Route path="profile" element={<DMCProfile />} />
            
            {/* DMC Contracts */}
            <Route path="received-contracts" element={<DMCReceivedContracts />} />
            <Route path="received-contracts/:contractId" element={<DMCContractDetail />} />
            
            {/* DMC Messages */}
            <Route path="messages" element={<DMCMessages />} />
            
            {/* DMC Staff Management */}
            <Route
              path="staff"
              element={
                <ProtectedRoute allowedRoles={DMC_ROLES} requireSuperAdmin={true}>
                  <DMCStaffManagement />
                </ProtectedRoute>
              }
            />
            
            {/* Activity Logs - Platform Admin Only */}
            <Route
              path="activity-logs"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <ActivityLogs portalType="dmc" />
                </ProtectedRoute>
              }
            />
            
            {/* DMC Bid Inquiry Routes */}
            <Route path="inquiries" element={<DMCInquiriesPage />} />
            <Route path="inquiries/post" element={<PostInquiryForm />} />
            <Route path="inquiries/:inquiryId" element={<InquiryDetailsPage />} />
            
            {/* DMC Direct Inquiry Routes */}
            <Route path="direct-inquiries" element={<DMCDirectInquiry />} />
            <Route path="direct-inquiries/history" element={<DMCDirectInquiryHistory />} />
            <Route path="direct-inquiries/select-hotels" element={<DMCHotelSelection />} />
            
            {/* DMC Payment Routes */}
            <Route path="payments" element={<DMCPaymentHistory />} />
            
            {/* DMC My Bids Route */}
            <Route path="my-bids" element={<div className="p-6"><h1 className="text-2xl font-bold">My Bids - Coming Soon</h1></div>} />
          </Route>
          
          {/* OLD BID PAYMENT ROUTES REMOVED: /payment/initiate, /payment/return, /payment/cancel */}
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <AdminDashboardNew />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="dmc-approvals" element={<DMCApprovals />} />
            <Route path="hotel-approvals" element={<HotelApprovals />} />
            <Route path="user-management" element={<AdminUserManagement />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="subscriptions" element={<AdminSubscriptionManagement />} />
            <Route path="subscriptions/:subscriptionId" element={<AdminSubscriptionDetail />} />
            <Route path="messages" element={<AdminMessages />} />
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