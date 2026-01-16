import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';

const SubscriptionPlanIntro = () => {
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const plans = [
    {
      name: 'Free Trial',
      duration: '30 Days',
      price: '$0',
      description: 'Start with a full-featured free trial',
      features: [
        'Full platform access',
        'Unlimited inquiries',
        'Bid submission',
        'Contract management',
        'Message system',
        'Profile customization',
        'No credit card required',
        'No obligations'
      ],
      badge: 'Start Free',
      popular: true
    },
    {
      name: 'Monthly',
      duration: 'Per Month',
      price: '$200',
      description: 'Perfect for growing businesses',
      features: [
        'Everything in Free Trial',
        'Unlimited access',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom branding',
        'Cancel anytime',
        'Monthly billing'
      ],
      badge: null,
      popular: false
    },
    {
      name: 'Yearly',
      duration: 'Per Year',
      price: '$2,000',
      description: 'Best value for committed partners',
      features: [
        'Everything in Monthly',
        'Save $400 per year',
        'Dedicated account manager',
        'Premium support',
        'Custom integrations',
        'Training & onboarding',
        'Annual billing',
        'Exclusive features'
      ],
      badge: 'Best Value',
      popular: false
    }
  ];

  const handleGetStarted = () => {
    setShowRoleModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Rezpitch</span>
          </h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 px-6 py-2 rounded-full text-sm font-semibold border border-teal-200">
              🎉 Start Your Free 30-Day Trial Today!
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4" style={{fontFamily: 'Inter, sans-serif'}}>
            Start with a <span className="font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">completely free 30-day trial</span> with full access to all features. 
            No credit card required. No obligations.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            After your trial, continue with a plan that fits your business needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-teal-500' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                  {plan.badge}
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/ {plan.duration}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {index === 0 && (
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Start Free Trial →
                  </button>
                )}
                
                {index !== 0 && (
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-slate-100 text-slate-800 py-4 rounded-lg font-semibold text-lg hover:bg-slate-200 transition-all duration-300"
                  >
                    Get Started →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Start Your Free Trial?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">No Credit Card Required</h3>
                <p className="text-gray-600">
                  Start your trial instantly without any payment information. Cancel anytime.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Full Feature Access</h3>
                <p className="text-gray-600">
                  Experience all premium features during your 30-day trial period.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Activation</h3>
                <p className="text-gray-600">
                  Get approved by our admin team and start using the platform immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <summary className="font-semibold text-lg">When does my free trial start?</summary>
              <p className="mt-3 text-gray-600">
                Your 30-day free trial starts immediately after an admin approves your profile registration. 
                You'll receive an email notification when your account is activated.
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <summary className="font-semibold text-lg">Do I need to provide payment information?</summary>
              <p className="mt-3 text-gray-600">
                No! You can start your free trial without entering any payment information. 
                You'll only need to provide payment details when you decide to continue after the trial.
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <summary className="font-semibold text-lg">What happens after the trial ends?</summary>
              <p className="mt-3 text-gray-600">
                You'll receive email notifications 7 days before your trial expires. 
                After the trial ends, you can choose to subscribe to a Monthly ($200) or Yearly ($2000) plan to continue using the platform.
              </p>
            </details>
            
            <details className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <summary className="font-semibold text-lg">Can I cancel anytime?</summary>
              <p className="mt-3 text-gray-600">
                Yes! You can cancel your subscription at any time from your dashboard. 
                There are no cancellation fees or penalties.
              </p>
            </details>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4" style={{fontFamily: 'Inter, sans-serif'}}>
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{fontFamily: 'Inter, sans-serif'}}>
            Join hundreds of hotels and DMCs already using Rezpitch to grow their partnerships.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-teal-600 px-12 py-4 rounded-lg font-bold text-xl hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Your Free Trial Now →
          </button>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • Cancel anytime • Full support
          </p>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <RoleSelectionModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </div>
  );
};

export default SubscriptionPlanIntro;
