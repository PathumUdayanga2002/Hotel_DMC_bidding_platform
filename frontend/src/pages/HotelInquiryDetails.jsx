import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  BedDouble,
  FileText,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const HotelInquiryDetails = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiryDetails = async () => {
      try {
        const response = await api.get(`/hotel/inquiries/${inquiryId}`);
        setInquiry(response.data);
      } catch (error) {
        console.error('Error fetching inquiry details:', error);
        toast.error('Failed to load inquiry details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiryDetails();
  }, [inquiryId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p>Loading inquiry details...</p>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
        <FileText className="w-10 h-10 mb-3" />
        <p>No inquiry found. It may have been removed or is unavailable.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Hotel Inquiry Details
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          View full details of the travel inquiry and its current status.
        </p>
        <hr className="mt-4 border-gray-200" />
      </div>

      {/* Inquiry Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {inquiry.title || 'Inquiry Details'}
          </h2>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              inquiry.status === 'OPEN'
                ? 'bg-green-100 text-green-700'
                : inquiry.status === 'CLOSED'
                ? 'bg-gray-200 text-gray-700'
                : inquiry.status === 'AWARDED'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {inquiry.status || 'Unknown'}
          </span>
        </div>

        {/* DMC Info */}
        <div className="text-gray-700 mb-4">
          <p className="text-sm">
            <strong>Posted by:</strong> {inquiry.dmcCompanyName} ({inquiry.dmcUsername})
          </p>
          <p className="text-sm">
            <strong>Posted at:</strong>{' '}
            {new Date(inquiry.postedAt).toLocaleString()}
          </p>
        </div>

        {/* Destination */}
        <div className="flex items-center mb-4 text-gray-700">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          <span className="text-lg font-medium">
            {inquiry.destinationCities?.join(', ')}, {inquiry.country}
          </span>
        </div>

        {/* Dates */}
        <div className="flex items-center mb-4 text-gray-700">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          <span>
            {inquiry.checkInDate
              ? new Date(inquiry.checkInDate).toLocaleDateString()
              : 'N/A'}{' '}
            →{' '}
            {inquiry.checkOutDate
              ? new Date(inquiry.checkOutDate).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>

        {/* Travelers */}
        <div className="flex items-center mb-4 text-gray-700">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          <span>
            {inquiry.numberOfAdults} Adults
            {inquiry.numberOfChildren > 0
              ? `, ${inquiry.numberOfChildren} Children`
              : ''}
          </span>
        </div>

        {/* Room Type */}
        <div className="flex items-center mb-4 text-gray-700">
          <BedDouble className="w-5 h-5 mr-2 text-blue-500" />
          <span>
            {inquiry.preferredRoomTypes?.join(', ') || 'Not specified'}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center mb-4 text-gray-700">
          <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
          <span>
            Budget: {inquiry.currency}{' '}
            {inquiry.budgetMin && inquiry.budgetMax
              ? `${inquiry.budgetMin} - ${inquiry.budgetMax}`
              : 'N/A'}
          </span>
        </div>

        {/* Special Requirements */}
        {inquiry.specialRequirements?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Special Requirements
            </h3>
            <ul className="list-disc ml-6 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {inquiry.specialRequirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {inquiry.specialNotes && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Special Notes
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {inquiry.specialNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelInquiryDetails;
