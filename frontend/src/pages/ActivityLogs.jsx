import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { 
  Activity, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  FileText
} from 'lucide-react';

const ActivityLogs = ({ portalType = 'dmc' }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Theme colors based on portal type
  const themeColors = portalType === 'dmc' 
    ? {
        primary: 'blue',
        headerBg: 'bg-blue-50',
        headerText: 'text-blue-900',
        headerBorder: 'border-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        buttonText: 'text-blue-600',
        focusRing: 'focus:ring-blue-500'
      }
    : {
        primary: 'cyan',
        headerBg: 'bg-green-50',
        headerText: 'text-gray-900',
        headerBorder: 'border-green-100',
        iconColor: 'text-cyan-600',
        buttonBg: 'bg-cyan-600 hover:bg-cyan-700',
        buttonText: 'text-cyan-600',
        focusRing: 'focus:ring-cyan-500'
      };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const endpoint = portalType === 'dmc' ? '/dmc/activity-logs' : '/hotel/activity-logs';
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString()
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`${endpoint}?${params.toString()}`);
      if (response.data.success) {
        const pageData = response.data.data;
        setLogs(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      }
    } catch (error) {
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchLogs();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityTypeLabel = (type) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'LOGIN':
      case 'LOGOUT':
        return <User className="w-4 h-4" />;
      case 'STAFF_CREATED':
      case 'STAFF_UPDATED':
      case 'STAFF_DELETED':
      case 'STAFF_STATUS_CHANGED':
      case 'STAFF_PASSWORD_RESET':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    if (type.includes('CREATED') || type === 'LOGIN') return 'text-green-600 bg-green-50';
    if (type.includes('DELETED')) return 'text-red-600 bg-red-50';
    if (type.includes('UPDATED') || type.includes('CHANGED')) return 'text-blue-600 bg-blue-50';
    if (type === 'LOGOUT') return 'text-gray-600 bg-gray-50';
    return 'text-purple-600 bg-purple-50';
  };

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.activityType?.toLowerCase().includes(searchLower) ||
      log.performedBy?.toLowerCase().includes(searchLower) ||
      log.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className={`w-8 h-8 ${themeColors.iconColor} mr-3`} />
            Activity Logs
          </h1>
          <p className="text-gray-600 mt-2">
            Track all activities and changes in your {portalType.toUpperCase()} portal
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg ${themeColors.focusRing} focus:border-transparent`}
                />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${themeColors.focusRing} focus:border-transparent`}
                placeholder="Start Date"
              />
            </div>

            {/* End Date */}
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${themeColors.focusRing} focus:border-transparent`}
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className={`${themeColors.buttonBg} text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors`}
            >
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${themeColors.primary}-600`}></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No activity logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${themeColors.headerBg} border-b ${themeColors.headerBorder}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${themeColors.headerText} uppercase tracking-wider`}>
                      Timestamp
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${themeColors.headerText} uppercase tracking-wider`}>
                      Activity Type
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${themeColors.headerText} uppercase tracking-wider`}>
                      Performed By
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${themeColors.headerText} uppercase tracking-wider`}>
                      Description
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${themeColors.headerText} uppercase tracking-wider`}>
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getActivityColor(log.activityType)}`}>
                          {getActivityIcon(log.activityType)}
                          <span className="ml-2">{getActivityTypeLabel(log.activityType)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{log.performedBy || '-'}</div>
                          {log.companyName && (
                            <div className="text-gray-500 text-xs">{log.companyName}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.ipAddress || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalElements > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg ${currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : `${themeColors.buttonText} hover:bg-gray-100`}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={`p-2 rounded-lg ${currentPage >= totalPages - 1 ? 'text-gray-300 cursor-not-allowed' : `${themeColors.buttonText} hover:bg-gray-100`}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
