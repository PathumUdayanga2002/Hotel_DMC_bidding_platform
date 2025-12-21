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
      PENDING: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', text: 'Pending Review' },
      UNDER_REVIEW: { icon: Clock, color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', text: 'Under Review' },
      APPROVED: { icon: CheckCircle, color: 'bg-green-500/10 text-green-400 border border-green-500/20', text: 'Approved' },
      REJECTED: { icon: XCircle, color: 'bg-red-500/10 text-red-400 border border-red-500/20', text: 'Rejected' },
      SUSPENDED: { icon: AlertCircle, color: 'bg-red-500/10 text-red-400 border border-red-500/20', text: 'Suspended' }
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
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No profile found</p>
          <button
            onClick={() => navigate('/dmc/profile/register')}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg hover:brightness-110 font-medium"
          >
            Register Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dmc/dashboard')}
            className="flex items-center text-gray-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">DMC Profile</h1>
              <p className="text-sm text-gray-400 mt-1">View and manage your company information</p>
            </div>
            {profile.status === 'REJECTED' && (
              <button
                onClick={() => navigate('/dmc/profile/register')}
                className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 font-medium"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit & Resubmit
              </button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Registration Status</h3>
              {getStatusBadge(profile.status)}
            </div>
            {profile.status === 'APPROVED' && profile.approvedAt && (
              <div className="text-right text-sm text-gray-400">
                <p>Approved on</p>
                <p className="font-medium text-white">{new Date(profile.approvedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          {profile.status === 'REJECTED' && profile.currentRejectionReason && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm font-medium text-red-400">Rejection Reason:</p>
              <p className="text-sm text-red-400 mt-1">{profile.currentRejectionReason}</p>
            </div>
          )}
        </div>

        {/* Company Details */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                <Building className="w-4 h-4 mr-2" />
                Company Name
              </label>
              <p className="text-white font-medium">{profile.companyName}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Business Registration Number
              </label>
              <p className="text-white font-medium">{profile.businessRegistrationNumber}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Contact Number
              </label>
              <p className="text-white font-medium">{profile.contactNumber}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <p className="text-white font-medium">{profile.email}</p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </label>
              <p className="text-white">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* SLTDA Certification */}
        {profile.sltdaCertificationUrl && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">SLTDA Certification</h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-sm font-medium text-white">
                  {profile.sltdaCertificationFileName || 'Certification Document'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Uploaded certification file</p>
              </div>
              <a
                href={profile.sltdaCertificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View File
              </a>
            </div>
          </div>
        )}

        {/* Registration History */}
        {profile.rejectionHistory && profile.rejectionHistory.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rejection History</h3>
            <div className="space-y-3">
              {profile.rejectionHistory.map((item, index) => (
                <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {new Date(item.rejectedAt).toLocaleDateString()} at{' '}
                    {new Date(item.rejectedAt).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-red-400 mt-1">
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
