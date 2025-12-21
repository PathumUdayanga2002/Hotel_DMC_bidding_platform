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
    <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
        <h2 className="text-2xl font-bold text-white">Received Contracts</h2>
        <p className="text-sm text-gray-400">Contracts that hotels have sent to you.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white">Loading...</div>
        ) : contracts.length === 0 ? (
          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-gray-400">No contracts received yet.</div>
        ) : (
          contracts.map((c) => (
            <div key={c.id} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-500" />
                  <div>
                    <div className="font-medium text-white">Contract ID: {c.contractId}</div>
                    <div className="text-xs text-gray-400">Sent by Hotel ID: {c.senderHotelId}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">Sent at: {c.sentAt ? new Date(c.sentAt).toLocaleString() : '—'}</div>
                <div className="text-xs text-gray-400 mt-1">Recipients: {Array.isArray(c.receiverDmcIds) ? c.receiverDmcIds.join(', ') : c.receiverDmcIds}</div>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 transition-all font-medium"
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
