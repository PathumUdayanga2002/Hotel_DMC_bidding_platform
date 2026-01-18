import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SendContractPanel({ contractId, onSent }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

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

  const toggleSelectAll = () => {
    if (!selectAll) {
      const allIds = (results || []).map((r) => r.id);
      setSelected(new Set(allIds));
      setSelectAll(true);
    } else {
      setSelected(new Set());
      setSelectAll(false);
    }
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
    <div className="mt-6 bg-white border border-slate-200 rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Distribute Contract</h3>
          <p className="text-sm text-slate-500">Search and select DMC partners to send the saved contract to.</p>
        </div>
        <div className="text-sm text-slate-500">Selected: <span className="font-medium text-slate-700">{selected.size}</span></div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Search DMC by company name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchResults(query)}
          />
        </div>
        <button
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700"
          onClick={() => fetchResults(query)}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button
          className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg"
          onClick={toggleSelectAll}
        >
          {selectAll ? 'Unselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid gap-3 max-h-64 overflow-auto mb-4">
        {results.length === 0 ? (
          <div className="text-sm text-slate-500">No DMCs found</div>
        ) : (
          results.map((dmc) => (
            <div key={dmc.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:shadow-sm">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.has(dmc.id)} onChange={() => toggle(dmc.id)} className="w-4 h-4" />
                <div>
                  <div className="font-medium text-slate-900">{dmc.companyName}</div>
                  <div className="text-sm text-slate-500">{dmc.email} • {dmc.location || '—'}</div>
                </div>
              </div>
              <div className="text-sm text-slate-500">{dmc.rating ? `★ ${dmc.rating}` : ''}</div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700" onClick={() => { setSelected(new Set()); setSelectAll(false); }}>Clear</button>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow" onClick={handleSend}>Send Contract</button>
      </div>
    </div>
  );
}
