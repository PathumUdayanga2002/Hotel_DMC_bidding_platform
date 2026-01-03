import { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get('/subscription/payment-history');
      setPayments(response.data.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>
      
      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't made any payments yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Ref
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {payment.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{payment.plan}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold">${payment.amount.toFixed(2)}</span>
                      <span className="text-gray-500 ml-1">{payment.currency}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {payment.transactionReference || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary Card */}
      {payments.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-blue-700">Total Payments</div>
              <div className="text-2xl font-bold text-blue-900">{payments.length}</div>
            </div>
            <div>
              <div className="text-sm text-blue-700">Successful</div>
              <div className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'SUCCESS').length}
              </div>
            </div>
            <div>
              <div className="text-sm text-blue-700">Total Spent</div>
              <div className="text-2xl font-bold text-blue-900">
                ${payments
                  .filter(p => p.status === 'SUCCESS')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
