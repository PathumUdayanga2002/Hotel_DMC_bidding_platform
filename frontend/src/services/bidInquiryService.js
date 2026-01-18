import api from './api';

/**
 * Bid Inquiry Service
 * Handles all API calls for DMC bid inquiries and hotel bidding
 */

// ============== DMC INQUIRY ENDPOINTS ==============

/**
 * Create a new bid inquiry (DMC)
 */
export const createBidInquiry = async (inquiryData) => {
  const response = await api.post('/dmc/inquiries', inquiryData);
  return response.data;
};


/**
 * Get all inquiries for the authenticated DMC
 */
export const getMyInquiries = async (page = 0, size = 10, status = null) => {
  const params = { page, size };
  if (status) params.status = status;
  const response = await api.get('/dmc/inquiries/my-inquiries', { params });
  return response.data;
};

/**
 * Get inquiry details by ID
 */
export const getInquiryById = async (inquiryId) => {
  const response = await api.get(`/dmc/inquiries/${inquiryId}`);
  return response.data;
};

/**
 * Update an existing inquiry (DMC)
 */
export const updateBidInquiry = async (inquiryId, updateData) => {
  const response = await api.put(`/dmc/inquiries/${inquiryId}`, updateData);
  return response.data;
};

/**
 * Close an inquiry (no more bids accepted)
 */
export const closeInquiry = async (inquiryId) => {
  const response = await api.put(`/dmc/inquiries/${inquiryId}/close`);
  return response.data;
};

/**
 * Cancel an inquiry
 */
export const cancelInquiry = async (inquiryId) => {
  const response = await api.put(`/dmc/inquiries/${inquiryId}/cancel`);
  return response.data;
};

/**
 * Award a bid to a hotel
 */
export const awardBid = async (inquiryId, bidId) => {
  const response = await api.put(`/dmc/inquiries/${inquiryId}/award/${bidId}`);
  return response.data;
};

/**
 * Reject a bid with a reason
 */
export const rejectBid = async (inquiryId, bidId, rejectionReason) => {
  const response = await api.put(`/dmc/inquiries/${inquiryId}/reject/${bidId}`, rejectionReason, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
  return response.data;
};

/**
 * Get all bids for a specific inquiry (DMC)
 */
export const getBidsForInquiry = async (inquiryId, page = 0, size = 10) => {
  const response = await api.get(`/dmc/inquiries/${inquiryId}/bids`, {
    params: { page, size }
  });
  return response.data;
};

/**
 * Get DMC inquiry statistics
 */
export const getDMCStats = async () => {
  const response = await api.get('/dmc/inquiries/stats');
  return response.data;
};

/**
 * Search DMC inquiries by keyword
 */
export const searchInquiries = async (keyword, page = 0, size = 10) => {
  const response = await api.get('/dmc/inquiries/search', {
    params: { keyword, page, size }
  });
  return response.data;
};

// ============== HOTEL BID ENDPOINTS ==============

/**
 * Get available inquiries for hotel (filtered by hotel city)
 */
export const getAvailableInquiries = async (hotelCity, page = 0, size = 10) => {
  const response = await api.get('/hotel/inquiries/available', {
    params: { hotelCity, page, size }
  });
  return response.data;
};

/**
 * Get inquiry details for hotel (with view count increment)
 */
export const getInquiryDetailsForHotel = async (inquiryId) => {
  const response = await api.get(`/hotel/inquiries/${inquiryId}`);
  return response.data;
};

/**
 * Submit a bid for an inquiry (Hotel)
 */
export const submitBid = async (bidData) => {
  const response = await api.post('/hotel/bids', bidData);
  return response.data;
};

/**
 * Get all bids submitted by the hotel
 */
export const getMyBids = async (page = 0, size = 10) => {
  const response = await api.get('/hotel/bids/my-bids', {
    params: { page, size }
  });
  return response.data;
};

/**
 * Get bid details by ID
 */
export const getBidById = async (bidId) => {
  const response = await api.get(`/hotel/bids/${bidId}`);
  return response.data;
};

/**
 * Update an existing bid (Hotel)
 */
export const updateBid = async (bidId, updateData) => {
  const response = await api.put(`/hotel/bids/${bidId}`, updateData);
  return response.data;
};

/**
 * Withdraw a bid (Hotel)
 */
export const withdrawBid = async (bidId) => {
  const response = await api.put(`/hotel/bids/${bidId}/withdraw`);
  return response.data;
};

/**
 * Add negotiation notes to a bid
 */
export const addNegotiationNotes = async (bidId, note) => {
  const response = await api.post(`/hotel/bids/${bidId}/negotiate`, null, {
    params: { note }
  });
  return response.data;
};

/**
 * Get hotel bid statistics
 */
export const getHotelStats = async () => {
  const response = await api.get('/hotel/bids/stats');
  return response.data;
};

/**
 * Search hotel bids by keyword
 */
export const searchMyBids = async (keyword, page = 0, size = 10) => {
  const response = await api.get('/hotel/bids/search', {
    params: { keyword, page, size }
  });
  return response.data;
};

// ============== NOTIFICATION ENDPOINTS ==============

/**
 * Get all notifications for the authenticated user
 */
export const getNotifications = async (page = 0, size = 20) => {
  const response = await api.get('/notifications', {
    params: { page, size }
  });
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/mark-read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};
