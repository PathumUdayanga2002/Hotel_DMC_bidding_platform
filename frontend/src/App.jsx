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

// Legal & Info Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQ from './pages/FAQ';

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

// Payment Pages
import PaymentInitiation from './pages/PaymentInitiation';
import PaymentReturn from './pages/PaymentReturn';
import PaymentCancel from './pages/PaymentCancel';
import DMCPaymentHistory from './pages/DMCPaymentHistory';
import HotelPaymentHistory from './pages/HotelPaymentHistory';
import AdminPaymentDashboard from './pages/AdminPaymentDashboard';
import AdminPayoutManagement from './pages/AdminPayoutManagement';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminSettings from './pages/AdminSettings';
import PlatformAnalytics from './pages/PlatformAnalytics';

//messages
import DMCMessages from './pages/DMCMessages.jsx';
import HotelMessages from './pages/HotelMessages.jsx';

// Contracts
import MyContracts from './pages/MyContracts.jsx';
import HotelContractBuilder from './pages/HotelContractBuilder.jsx';

// Direct Inquiry
import DMCDirectInquiry from './pages/DMCDirectInquiry.jsx';
import DMCHotelSelection from './pages/DMCHotelSelection.jsx';
import DMCDirectInquiryHistory from './pages/DMCDirectInquiryHistory.jsx';

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

          {/* Legal & Info Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/faq" element={<FAQ />} />

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
            path="/hotel/direct-inquiries"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelDirectInquiriesPage />
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

          {/* Hotel Messages */} 
            <Route
            path="/hotel/messages"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelMessages />
              </ProtectedRoute>
            }
          />

          {/* Hotel Staff Management - Super Admin Only */}
          <Route
            path="/hotel/staff"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']} requireSuperAdmin={true}>
                <HotelStaffManagement />
              </ProtectedRoute>
            }
          />

          {/* Hotel Activity Logs */}
          <Route
            path="/hotel/activity-logs"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <ActivityLogs portalType="hotel" />
              </ProtectedRoute>
            }
          />

          <Route path="/hotel/inquiries/:inquiryId" element={<HotelInquiryDetails />} />

          {/* Hotel Payment Routes */}
          <Route
            path="/hotel/payments"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_USER']}>
                <HotelPaymentHistory />
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

          {/* DMC Staff Management - Super Admin Only */}
          <Route
            path="/dmc/staff"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']} requireSuperAdmin={true}>
                <DMCStaffManagement />
              </ProtectedRoute>
            }
          />

          {/* DMC Activity Logs */}
          <Route
            path="/dmc/activity-logs"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <ActivityLogs portalType="dmc" />
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

          {/* DMC Direct Inquiry Routes */}
          <Route
            path="/dmc/direct-inquiries"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCDirectInquiry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/direct-inquiries/history"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCDirectInquiryHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dmc/direct-inquiries/select-hotels"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCHotelSelection />
              </ProtectedRoute>
            }
          />
          
          {/* DMC Payment Routes */}
          <Route
            path="/dmc/payments"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <DMCPaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/initiate"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <PaymentInitiation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/return"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <PaymentReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/cancel"
            element={
              <ProtectedRoute allowedRoles={['DMC_USER']}>
                <PaymentCancel />
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
            <Route path="user-management" element={<AdminUserManagement />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="payments" element={<AdminPaymentDashboard />} />
            <Route path="payouts" element={<AdminPayoutManagement />} />
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