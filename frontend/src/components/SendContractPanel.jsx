import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SendContractPanel({ contractId, onSent }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // initial load - fetch top results
    fetchResults('');
  }, []);

  const fetchResults = async (q) => {
    try {
      setLoading(true);
      const resp = await api.get('/dmcs/search', { params: { name: q } });
      const list = resp?.data?.data || [];
      setResults(list);
    } catch (err) {
      console.error('DMC search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const handleSend = async () => {
    if (!contractId) {
      alert('Please save the contract first to obtain an ID before sending.');
      return;
    }

    if (!user || !user.id) {
      alert('User not available. Make sure you are logged in as a hotel.');
      return;
    }

    const receiverDmcIds = Array.from(selected);
    if (receiverDmcIds.length === 0) {
      if (!window.confirm('No DMC selected. Send to no one?')) return;
    }

    try {
      const body = {
        contractId,
        senderHotelId: user.id,
        receiverDmcIds,
      };
      const res = await api.post('/send-contract', body);
      const saved = res?.data?.data;
      alert('Contract sent successfully!');
      if (onSent) onSent(saved);
    } catch (err) {
      console.error('Failed to send contract', err);
      alert('Failed to send contract. See console for details.');
    }
  };

  return (
    <div className="mt-6 bg-white border rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Send Contract to DMCs</h3>

      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Search DMC by company name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => fetchResults(query)}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="max-h-48 overflow-auto border rounded p-2 mb-3">
        {results.length === 0 ? (
          <div className="text-sm text-gray-500">No DMCs found</div>
        ) : (
          results.map((dmc) => (
            <label key={dmc.id} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={selected.has(dmc.id)} onChange={() => toggle(dmc.id)} />
              <div className="text-sm">
                <div className="font-medium">{dmc.companyName}</div>
                <div className="text-xs text-gray-500">{dmc.email}</div>
              </div>
            </label>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Selected: {selected.size}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => { setSelected(new Set()); }}>Clear</button>
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleSend}>Send Contract</button>
        </div>
      </div>
    </div>
  );
}
