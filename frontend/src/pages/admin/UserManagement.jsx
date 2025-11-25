import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const formatShortId = (id) => (id ? `USR-${String(id).slice(0, 8).toUpperCase()}` : '—');

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=0&size=50&q=${encodeURIComponent(query)}`);
      setUsers(res?.data?.content || res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const toggleStatus = async (user) => {
    try {
      const next = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`/admin/users/${user.id}/status`, { status: next });
      toast.success(`User ${next.toLowerCase()}`);
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600">View and manage platform users</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="px-3 py-2 border rounded-md text-sm"
          />
          <button
            onClick={() => navigate('/admin/users/create')}
            className="px-3 py-2 bg-cyan-600 text-white rounded-md text-sm"
          >
            New User
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatShortId(u.id)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.username || u.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">{(u.roles || ['USER'])[0]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.status || 'UNKNOWN'}</td>
                  <td className="px-4 py-3 text-right text-sm space-x-2">
                    <button onClick={() => navigate(`/admin/users/${u.id}`)} className="px-2 py-1 text-sm text-cyan-600">View</button>
                    <button onClick={() => navigate(`/admin/users/${u.id}/edit`)} className="px-2 py-1 text-sm text-indigo-600">Edit</button>
                    <button onClick={() => toggleStatus(u)} className="px-2 py-1 text-sm text-red-600">{u.status === 'ACTIVE' ? 'Disable' : 'Enable'}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
