import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home, RotateCcw } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-orange-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 mb-8">
            You have cancelled the payment process.
            <br />
            No charges have been made to your account.
          </p>

          {orderId && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto mb-8">
              <p className="text-sm text-orange-800">
                Order ID: <span className="font-medium">{orderId}</span>
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-8">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your bid award is still active. You can retry the payment
              from your dashboard within 15 minutes of awarding the bid.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dmc/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium transition-all flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
