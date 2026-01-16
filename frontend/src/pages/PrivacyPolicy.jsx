import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Rezpitch</span>
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full w-fit text-sm font-semibold text-teal-700">
            Privacy Policy
          </div>
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">How We Protect Your Data</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Transparent practices on how we collect, use, and safeguard your information across the Rezpitch platform.
            </p>
            <p className="text-sm text-slate-500">Last Updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/5 p-10 space-y-10">
          <div className="grid gap-6">
            {/* Introduction */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <p className="text-slate-700 leading-relaxed mb-3">
                At Rezpitch, we are committed to protecting the privacy and security of our customers' personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or use our platform. By using our website, you consent to the practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Information We Collect</h3>
              <p className="text-slate-700 leading-relaxed mb-4">When you visit our website, we may collect certain information about you, including:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 leading-relaxed">
                <li>Personal identification information (such as your name, email address, and phone number) provided voluntarily by you during the registration or checkout process.</li>
                <li>Payment and billing information necessary to process your orders, including credit card details, which are securely handled by trusted third-party payment processors (PayHere).</li>
                <li>Browsing information, such as your IP address, browser type, and device information, collected automatically using cookies and similar technologies.</li>
                <li>Business information including company details, service descriptions, and certifications for Hotels and DMCs.</li>
                <li>Communication messages, inquiries, contract and bidding documents.</li>
              </ul>
            </section>

            {/* Use of Information */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Use of Information</h3>
              <p className="text-slate-700 leading-relaxed mb-4">We may use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 leading-relaxed">
                <li>To process and fulfill your subscriptions and transactions, including payment processing.</li>
                <li>To communicate with you regarding your account, provide customer support, and respond to inquiries or requests.</li>
                <li>To personalize your experience and present relevant features, recommendations and promotions.</li>
                <li>To improve our website, products, and services based on your feedback and browsing patterns.</li>
                <li>To detect and prevent fraud, unauthorized activities, and abuse of our website.</li>
                <li>To facilitate connections between Hotels and DMCs on our bidding platform.</li>
                <li>To send platform notifications and updates about bids, inquiries, and contracts.</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Information Sharing</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We respect your privacy and do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700 leading-relaxed">
                <li><strong>Trusted service providers:</strong> We may share your information with third-party service providers who assist us in operating our website, processing payments (PayHere payment gateway), and delivering services. These providers are contractually obligated to handle your data securely and confidentially.</li>
                <li><strong>Other platform users:</strong> Limited profile information is shared between Hotels and DMCs to facilitate business connections and bidding processes.</li>
                <li><strong>Legal requirements:</strong> We may disclose your information if required to do so by law or in response to valid legal requests or orders.</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Data Security</h3>
              <p className="text-slate-700 leading-relaxed">
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, secure databases, access controls, and secure payment processing through PayHere. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Cookies and Tracking Technologies</h3>
              <p className="text-slate-700 leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and gather information about your preferences and interactions with our website. You have the option to disable cookies through your browser settings, but this may limit certain features and functionality of our website.
              </p>
            </section>

            {/* Your Rights */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Rights and Choices</h3>
              <p className="text-slate-700 leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 leading-relaxed">
                <li>Access your personal data and request a copy</li>
                <li>Correct inaccurate information in your profile</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Changes to the Privacy Policy</h3>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with a revised "last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information.
              </p>
            </section>

            {/* Contact Section */}
            <section className="p-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Contact Us</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding our Privacy Policy or the handling of your personal information, please contact us using the information provided below:
              </p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@rezpitch.com" className="text-teal-600 hover:text-teal-700">privacy@rezpitch.com</a></p>
                <p><strong>Postal Address:</strong> Rezpitch, Privacy Department, [Your Address]</p>
                <p><strong>Response Time:</strong> We aim to respond to all requests within 30 days.</p>
              </div>
            </section>

            {/* Payment Security Note */}
            <section className="p-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Payment Security</h3>
              <p className="text-slate-700 leading-relaxed">
                All payment transactions on Rezpitch are processed securely through PayHere, a certified Payment Service Provider. We do not store or have access to your full payment card details. PayHere handles all payment information in compliance with PCI-DSS security standards. For more information about PayHere's security practices, please visit <a href="https://www.payhere.lk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">www.payhere.lk</a>.
              </p>
            </section>
          </div>

          {/* Back to Home Button */}
          <div className="pt-4 text-center">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-20 py-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-3 text-sm text-slate-300">
          <p>&copy; 2024 Rezpitch. All rights reserved.</p>
          <p className="text-slate-400">Luxury hospitality where logic meets service.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
