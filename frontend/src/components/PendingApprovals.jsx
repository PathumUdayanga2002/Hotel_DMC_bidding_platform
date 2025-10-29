import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaDownload, FaEye } from 'react-icons/fa';

const PendingApprovals = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'HOTEL', 'DMC'

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/dashboard/pending-approvals');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/dashboard/approval-request/${requestId}`, {
        status: status
      });
      // Refresh the list after approval/rejection
      fetchPendingApprovals();
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const renderDocumentStatus = (verified) => {
    return verified ? (
      <span className="text-green-500 flex items-center">
        <FaCheck className="mr-1" />
        Verified
      </span>
    ) : (
      <span className="text-red-500 flex items-center">
        <FaTimes className="mr-1" />
        Not Verified
      </span>
    );
  };

  const ApprovalCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={request.photoUrl || '/default-avatar.png'}
            alt={request.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{request.name}</h3>
              <p className="text-sm text-gray-500">{request.type}</p>
            </div>
            <span className="text-sm text-gray-500">
              Applied: {format(new Date(request.appliedDate), 'MMM dd, yyyy')}
            </span>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {request.contactEmail}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span> {request.location}
              </p>
            </div>
          </div>

          {/* Document Verification Status */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium mb-1">Business License</p>
              {renderDocumentStatus(request.businessLicenseVerified)}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Identification</p>
              {renderDocumentStatus(request.identificationVerified)}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Address Proof</p>
              {renderDocumentStatus(request.addressProofVerified)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setSelectedRequest(request)}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center"
            >
              <FaEye className="mr-2" />
              View Details
            </button>
            <button
              onClick={() => handleApproval(request.id, 'REJECTED')}
              className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Reject
            </button>
            <button
              onClick={() => handleApproval(request.id, 'APPROVED')}
              className="px-4 py-2 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FilterBar = () => (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex space-x-4">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-md ${
            filterType === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('HOTEL')}
          className={`px-4 py-2 rounded-md ${
            filterType === 'HOTEL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Hotels
        </button>
        <button
          onClick={() => setFilterType('DMC')}
          className={`px-4 py-2 rounded-md ${
            filterType === 'DMC'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          DMCs
        </button>
      </div>
      <button
        onClick={fetchPendingApprovals}
        className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center"
      >
        <FaDownload className="mr-2" />
        Refresh List
      </button>
    </div>
  );

  const filteredRequests = pendingRequests.filter(
    request => filterType === 'ALL' || request.type === filterType
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Approvals</h1>
        <p className="text-gray-600">
          Review and manage pending registration requests from Hotels and DMCs
        </p>
      </div>

      <FilterBar />

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending approvals...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No pending approvals found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <ApprovalCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            {/* Add more detailed information here */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
