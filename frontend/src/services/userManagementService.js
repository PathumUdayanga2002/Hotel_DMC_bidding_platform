import api from './api';

/**
 * User Management Service
 * Handles API calls for admin user management
 */

const USER_MANAGEMENT_BASE_URL = '/admin/user-management';

/**
 * Get user management statistics
 */
export const getUserManagementStats = async () => {
  const response = await api.get(`${USER_MANAGEMENT_BASE_URL}/stats`);
  return response.data;
};

/**
 * Get all pending approvals
 */
export const getPendingApprovals = async (params = {}) => {
  const { page = 0, size = 10, sortBy = 'appliedDate', sortDirection = 'DESC' } = params;
  const response = await api.get(`${USER_MANAGEMENT_BASE_URL}/pending-approvals`, {
    params: { page, size, sortBy, sortDirection }
  });
  return response.data;
};

/**
 * Get pending approval details by ID
 */
export const getPendingApprovalById = async (id, type) => {
  const response = await api.get(`${USER_MANAGEMENT_BASE_URL}/pending-approvals/${id}`, {
    params: { type }
  });
  return response.data;
};

/**
 * Process approval action (approve/reject)
 */
export const processApprovalAction = async (id, type, actionData) => {
  const response = await api.post(
    `${USER_MANAGEMENT_BASE_URL}/pending-approvals/${id}/action`,
    actionData,
    { params: { type } }
  );
  return response.data;
};

/**
 * Approve a pending request
 */
export const approveRequest = async (id, type, note = '') => {
  return processApprovalAction(id, type, {
    action: 'APPROVE',
    note
  });
};

/**
 * Reject a pending request
 */
export const rejectRequest = async (id, type, reason, note = '') => {
  if (!reason || reason.trim() === '') {
    throw new Error('Rejection reason is required');
  }
  return processApprovalAction(id, type, {
    action: 'REJECT',
    reason,
    note
  });
};

export default {
  getUserManagementStats,
  getPendingApprovals,
  getPendingApprovalById,
  processApprovalAction,
  approveRequest,
  rejectRequest
};
