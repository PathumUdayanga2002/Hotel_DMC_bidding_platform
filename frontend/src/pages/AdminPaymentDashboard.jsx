import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Shield,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText
} from 'lucide-react';

const AdminPaymentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    platformBalance: 0
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
    EXPIRED: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPayments();
  }, [currentPage, statusFilter]);

  const fetchDashboardData = async () => {
    try {
      const balanceResponse = await axios.get('/admin/payments/platform-balance');
      const paymentsResponse = await axios.get('/admin/payments', { 
        params: { page: 0, size: 1000 } 
      });

      const allPayments = paymentsResponse.data.content;
      
      setStats({
        totalPayments: allPayments.length,
        completedPayments: allPayments.filter(p => p.status === 'COMPLETED').length,
        pendingPayments: allPayments.filter(p => p.status === 'PENDING').length,
        platformBalance: balanceResponse.data.currentBalance || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize
      };

      let endpoint = '/admin/payments';
      if (statusFilter !== 'ALL') {
        endpoint = `/admin/payments/status/${statusFilter}`;
      }

      const response = await axios.get(endpoint, { params });
      
      setPayments(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === '' || 
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.dmcUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.hotelUsername?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewPaymentDetails = (paymentId) => {
    navigate(`/admin/payments/${paymentId}`);
  };

  const viewPayoutManagement = () => {
    navigate('/admin/payouts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600">Monitor and manage all payment transactions</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Payments</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPayments}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedPayments}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Platform Balance</h3>
            <p className="text-3xl font-bold text-purple-600">
              LKR {formatCurrency(stats.platformBalance)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={viewPayoutManagement}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-medium transition-all flex items-center"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Manage Payouts
            </button>
            <button
              onClick={() => navigate('/admin/payments/platform-balance')}
              className="px-4 py-2 bg-white border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition-colors flex items-center"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              View Platform Balance
            </button>
            <button
              onClick={() => navigate('/admin/payments/hotels/bank-details')}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Verify Bank Details
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, DMC or hotel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No payments found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DMC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hotel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {payment.orderId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {payment.dmcUsername || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {payment.hotelUsername || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {payment.currency} {payment.totalAmount?.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-purple-600">
                            {payment.currency} {payment.platformCommission?.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[payment.status]}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => viewPaymentDetails(payment.id)}
                            className="text-purple-600 hover:text-purple-900 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min((currentPage + 1) * pageSize, totalElements)}
                    </span>{' '}
                    of <span className="font-medium">{totalElements}</span> payments
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center px-4">
                      Page {currentPage + 1} of {totalPages}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;
