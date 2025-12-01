import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  Edit,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const DMCProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/dmc/profile');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        toast.info('Profile not yet registered');
        navigate('/dmc/profile/register');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      UNDER_REVIEW: { icon: Clock, color: 'bg-blue-100 text-blue-800', text: 'Under Review' },
      APPROVED: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Approved' },
      REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Rejected' },
      SUSPENDED: { icon: AlertCircle, color: 'bg-red-100 text-red-800', text: 'Suspended' }
    };

    const { icon: Icon, color, text } = config[status] || config.PENDING;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile found</p>
          <button
            onClick={() => navigate('/dmc/profile/register')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Register Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dmc/dashboard')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DMC Profile</h1>
              <p className="text-gray-600 mt-1">View and manage your company information</p>
            </div>
            {profile.status === 'REJECTED' && (
              <button
                onClick={() => navigate('/dmc/profile/register')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit & Resubmit
              </button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Status</h3>
              {getStatusBadge(profile.status)}
            </div>
            {profile.status === 'APPROVED' && profile.approvedAt && (
              <div className="text-right text-sm text-gray-600">
                <p>Approved on</p>
                <p className="font-medium">{new Date(profile.approvedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          {profile.status === 'REJECTED' && profile.currentRejectionReason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
              <p className="text-sm text-red-700 mt-1">{profile.currentRejectionReason}</p>
            </div>
          )}
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                <Building className="w-4 h-4 mr-2" />
                Company Name
              </label>
              <p className="text-gray-900 font-medium">{profile.companyName}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Business Registration Number
              </label>
              <p className="text-gray-900 font-medium">{profile.businessRegistrationNumber}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Contact Number
              </label>
              <p className="text-gray-900 font-medium">{profile.contactNumber}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <p className="text-gray-900 font-medium">{profile.email}</p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </label>
              <p className="text-gray-900">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* SLTDA Certification */}
        {profile.sltdaCertificationUrl && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SLTDA Certification</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {profile.sltdaCertificationFileName || 'Certification Document'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Uploaded certification file</p>
              </div>
              <a
                href={profile.sltdaCertificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View File
              </a>
            </div>
          </div>
        )}

        {/* Registration History */}
        {profile.rejectionHistory && profile.rejectionHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejection History</h3>
            <div className="space-y-3">
              {profile.rejectionHistory.map((item, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-gray-600">
                    {new Date(item.rejectedAt).toLocaleDateString()} at{' '}
                    {new Date(item.rejectedAt).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    <strong>Reason:</strong> {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DMCProfile;
