import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DMCReceivedContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Re-fetch when authenticated user changes
    if (user && user.id) fetchReceived();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchReceived = async () => {
    if (!user || !user.id) {
      setContracts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // First fetch the DMC profile to get the profile id stored in SentContract.receiverDmcIds
      const profileResp = await api.get('/dmc/profile');
      const profile = profileResp?.data?.data || null;
      const dmcProfileId = profile?.id;

      if (!dmcProfileId) {
        // If no profile exists, there can be no received contracts tied to a profile
        setContracts([]);
        return;
      }

      const resp = await api.get(`/send-contract/received/${dmcProfileId}`);
      const list = resp?.data?.data || [];
      setContracts(list);
    } catch (err) {
      console.error('Failed to fetch received contracts', err);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold">Received Contracts</h2>
        <p className="text-sm text-gray-600">Contracts that hotels have sent to you.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-4 bg-white rounded shadow">Loading...</div>
        ) : contracts.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-gray-600">No contracts received yet.</div>
        ) : (
          contracts.map((c) => (
            <div key={c.id} className="p-4 bg-white rounded shadow flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Contract ID: {c.contractId}</div>
                    <div className="text-xs text-gray-500">Sent by Hotel ID: {c.senderHotelId}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Sent at: {c.sentAt ? new Date(c.sentAt).toLocaleString() : '—'}</div>
                <div className="text-xs text-gray-500 mt-1">Recipients: {Array.isArray(c.receiverDmcIds) ? c.receiverDmcIds.join(', ') : c.receiverDmcIds}</div>
              </div>
              <div>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => navigate(`/dmc/received-contracts/${c.contractId}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DMCReceivedContracts;
