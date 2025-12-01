import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check,
  X,
  Building2
} from 'lucide-react';

const AdminPayoutManagement = () => {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingPayoutId, setProcessingPayoutId] = useState(null);
  const pageSize = 10;

  const payoutStatusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    APPROVED: 'bg-blue-100 text-blue-800 border-blue-300',
    PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const payoutStatusIcons = {
    PENDING: Clock,
    APPROVED: CheckCircle,
    PROCESSING: AlertCircle,
    COMPLETED: CheckCircle,
    FAILED: XCircle,
    CANCELLED: XCircle
  };

  useEffect(() => {
    fetchPayouts();
  }, [currentPage, statusFilter]);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      // Get all payments with completed status
      const response = await axios.get('/admin/payments/status/COMPLETED', { 
        params: { page: currentPage, size: pageSize } 
      });
      
      setPayouts(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = searchTerm === '' || 
      payout.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.hotelUsername?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || payout.payoutStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprovePayout = async (paymentId) => {
    if (!confirm('Are you sure you want to approve this payout?')) {
      return;
    }

    setProcessingPayoutId(paymentId);
    try {
      await axios.post('/admin/payments/approve-payout', { paymentId });
      toast.success('Payout approved successfully');
      fetchPayouts();
    } catch (error) {
      console.error('Error approving payout:', error);
      toast.error(error.response?.data?.message || 'Failed to approve payout');
    } finally {
      setProcessingPayoutId(null);
    }
  };

  const handleRejectPayout = async (paymentId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessingPayoutId(paymentId);
    try {
      // This endpoint should be implemented in backend for rejection
      await axios.post(`/admin/payments/${paymentId}/reject-payout`, { reason });
      toast.success('Payout rejected');
      fetchPayouts();
    } catch (error) {
      console.error('Error rejecting payout:', error);
      toast.error(error.response?.data?.message || 'Failed to reject payout');
    } finally {
      setProcessingPayoutId(null);
    }
  };

  const handleProcessPayouts = async () => {
    if (!confirm('Process all approved payouts now?')) {
      return;
    }

    try {
      const response = await axios.post('/admin/payments/process-payouts');
      toast.success(response.data.message || 'Payouts processed successfully');
      fetchPayouts();
    } catch (error) {
      console.error('Error processing payouts:', error);
      toast.error(error.response?.data?.message || 'Failed to process payouts');
    }
  };

  const viewBankDetails = async (hotelUserId) => {
    try {
      const response = await axios.get(`/admin/payments/hotel/${hotelUserId}/bank-details`);
      const bank = response.data;
      
      alert(`Bank Details:\n\nAccount Holder: ${bank.accountHolderName}\nAccount Number: ${bank.accountNumber}\nBank: ${bank.bankName}\nBranch: ${bank.branchName}\nSWIFT: ${bank.swiftCode || 'N/A'}\nVerified: ${bank.verified ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('Failed to load bank details');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
                <p className="text-gray-600">Review and approve hotel payouts</p>
              </div>
            </div>
            <button
              onClick={handleProcessPayouts}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-medium transition-all flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Process Approved Payouts
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
                placeholder="Search by order ID or hotel..."
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
                <option value="PENDING">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No payouts found</p>
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
                        Hotel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout Status
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
                    {filteredPayouts.map((payout) => {
                      const PayoutStatusIcon = payoutStatusIcons[payout.payoutStatus];
                      return (
                        <tr key={payout.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {payout.orderId}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">
                                {payout.hotelUsername || 'N/A'}
                              </span>
                              <button
                                onClick={() => viewBankDetails(payout.hotelUserId)}
                                className="ml-2 text-purple-600 hover:text-purple-900"
                                title="View bank details"
                              >
                                <Building2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {payout.currency} {payout.totalAmount?.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm font-medium text-green-600">
                                {payout.currency} {payout.hotelPayout?.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${payoutStatusColors[payout.payoutStatus]}`}>
                              <PayoutStatusIcon className="w-3 h-3 mr-1" />
                              {payout.payoutStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(payout.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {payout.payoutStatus === 'PENDING' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprovePayout(payout.id)}
                                  disabled={processingPayoutId === payout.id}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium disabled:opacity-50 flex items-center"
                                  title="Approve payout"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectPayout(payout.id)}
                                  disabled={processingPayoutId === payout.id}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium disabled:opacity-50 flex items-center"
                                  title="Reject payout"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {payout.payoutStatus !== 'PENDING' && (
                              <span className="text-gray-500">
                                {payout.payoutStatus === 'COMPLETED' ? 'Processed' : payout.payoutStatus}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
                    of <span className="font-medium">{totalElements}</span> payouts
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

export default AdminPayoutManagement;
