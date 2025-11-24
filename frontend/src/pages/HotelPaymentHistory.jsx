import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Wallet,
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
  Building2,
  CreditCard,
  Save
} from 'lucide-react';

const HotelPaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('payments'); // payments, bank-details
  const [bankDetails, setBankDetails] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    swiftCode: ''
  });
  const [savingBank, setSavingBank] = useState(false);
  const pageSize = 10;

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
    EXPIRED: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  const payoutStatusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    APPROVED: 'bg-blue-100 text-blue-800 border-blue-300',
    PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const statusIcons = {
    PENDING: Clock,
    PROCESSING: AlertCircle,
    COMPLETED: CheckCircle,
    FAILED: XCircle,
    CANCELLED: XCircle,
    EXPIRED: Clock,
    APPROVED: CheckCircle
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    } else {
      fetchBankDetails();
    }
  }, [currentPage, statusFilter, activeTab]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize
      };

      const response = await axios.get('/payments/hotel/my-payments', { params });
      
      setPayments(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/payments/hotel/bank-details');
      setBankDetails(response.data);
      if (response.data) {
        setBankFormData({
          accountHolderName: response.data.accountHolderName || '',
          accountNumber: response.data.accountNumber || '',
          bankName: response.data.bankName || '',
          branchName: response.data.branchName || '',
          swiftCode: response.data.swiftCode || ''
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching bank details:', error);
        toast.error('Failed to load bank details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBankFormChange = (e) => {
    setBankFormData({
      ...bankFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveBankDetails = async (e) => {
    e.preventDefault();
    setSavingBank(true);
    try {
      await axios.post('/payments/hotel/bank-details', bankFormData);
      toast.success('Bank details saved successfully. Awaiting admin verification.');
      fetchBankDetails();
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error(error.response?.data?.message || 'Failed to save bank details');
    } finally {
      setSavingBank(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === '' || 
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.dmcUsername?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const viewPaymentDetails = (paymentId) => {
    navigate(`/hotel/payments/${paymentId}`);
  };

  const renderPaymentsTab = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      );
    }

    return (
      <>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or DMC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
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
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No payments received yet</p>
              <p className="text-gray-500 text-sm">Payments from DMCs will appear here</p>
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
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Your Payout (95%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
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
                    {filteredPayments.map((payment) => {
                      const PaymentStatusIcon = statusIcons[payment.status];
                      const PayoutStatusIcon = statusIcons[payment.payoutStatus];
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {payment.orderId}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {payment.dmcUsername || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {payment.currency} {payment.totalAmount?.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm font-medium text-green-600">
                                {payment.currency} {payment.hotelPayout?.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[payment.status]}`}>
                              <PaymentStatusIcon className="w-3 h-3 mr-1" />
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${payoutStatusColors[payment.payoutStatus]}`}>
                              <PayoutStatusIcon className="w-3 h-3 mr-1" />
                              {payment.payoutStatus}
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
                              className="text-cyan-600 hover:text-cyan-900 font-medium"
                            >
                              View Details
                            </button>
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
      </>
    );
  };

  const renderBankDetailsTab = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bank Account Information</h2>
          <p className="text-gray-600">
            Add your bank account details to receive payouts. Admin verification required.
          </p>
        </div>

        {bankDetails && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            bankDetails.verified 
              ? 'bg-green-50 border-green-300' 
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <div className="flex items-center">
              {bankDetails.verified ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              )}
              <span className={`font-medium ${
                bankDetails.verified ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {bankDetails.verified 
                  ? 'Bank account verified ✓' 
                  : 'Awaiting admin verification'}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveBankDetails} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={bankFormData.accountHolderName}
                onChange={handleBankFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankFormData.accountNumber}
                onChange={handleBankFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={bankFormData.bankName}
                onChange={handleBankFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Bank of Ceylon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                name="branchName"
                value={bankFormData.branchName}
                onChange={handleBankFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Colombo Main Branch"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SWIFT Code (Optional)
              </label>
              <input
                type="text"
                name="swiftCode"
                value={bankFormData.swiftCode}
                onChange={handleBankFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="BCEYLKLX"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingBank}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium transition-all disabled:opacity-50 flex items-center"
            >
              {savingBank ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Bank Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments & Payouts</h1>
              <p className="text-gray-600">Manage your payments and bank account details</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'payments'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment History
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bank-details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'bank-details'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Bank Details
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'payments' ? renderPaymentsTab() : renderBankDetailsTab()}
      </div>
    </div>
  );
};

export default HotelPaymentHistory;
