import React from 'react';
import { format } from 'date-fns';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ApprovalCard = ({ approval }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start">
        <img
          src={approval.photoUrl || '/default-avatar.png'}
          alt={approval.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{approval.name}</h3>
              <p className="text-sm text-gray-600">{approval.type}</p>
            </div>
            <span className="text-sm text-gray-500">
              {format(new Date(approval.appliedDate), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-600">{approval.contactEmail}</p>
            <p className="text-sm text-gray-600">{approval.location}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <DocumentStatus
              label="Business License"
              verified={approval.businessLicenseVerified}
            />
            <DocumentStatus
              label="Identification"
              verified={approval.identificationVerified}
            />
            <DocumentStatus
              label="Address Proof"
              verified={approval.addressProofVerified}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentStatus = ({ label, verified }) => (
  <div className="flex items-center text-sm">
    {verified ? (
      <FaCheck className="text-green-500 mr-1" />
    ) : (
      <FaTimes className="text-red-500 mr-1" />
    )}
    <span>{label}</span>
  </div>
);

export default ApprovalCard;