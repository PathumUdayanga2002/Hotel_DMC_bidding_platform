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
            {/* Section 1 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Introduction</h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                Rezpitch ("Company," "we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our platform.
              </p>
            </section>

            {/* Section 2 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">2. Information We Collect</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">2.1 Information You Provide</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Registration information (name, email, phone, company details)</li>
                    <li>Profile information (business type, service descriptions, certifications)</li>
                    <li>Payment and billing information</li>
                    <li>Communication messages and inquiries</li>
                    <li>Contract and bidding documents</li>
                    <li>Customer support interactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">2.2 Information Collected Automatically</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Log data (IP address, browser type, pages visited, timestamp)</li>
                    <li>Cookies and tracking technologies</li>
                    <li>Device information</li>
                    <li>Usage analytics and behavior patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h3>
              <p className="text-slate-700 leading-relaxed mb-4">We use collected information for:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Providing and improving our services</li>
                <li>Processing transactions and payments</li>
                <li>Sending platform notifications and updates</li>
                <li>Customer support and problem resolution</li>
                <li>Verifying user identity and preventing fraud</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Complying with legal obligations</li>
                <li>Marketing communications (with your consent)</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">4. Data Sharing and Disclosure</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not sell your personal information. However, we may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Service providers and vendors (payment processors, email services)</li>
                <li>Other users (limited profile information for business connections)</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners for fraud prevention</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">5. Data Security</h3>
              <p className="text-slate-700 leading-relaxed">
                We implement industry-standard security measures including SSL encryption, secure databases, and access controls. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </section>

            {/* Section 6 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">6. Your Rights and Choices</h3>
              <p className="text-slate-700 leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">7. Cookies and Tracking</h3>
              <p className="text-slate-700 leading-relaxed">
                We use cookies to enhance your experience. You can control cookie preferences through your browser settings. Disabling cookies may affect platform functionality.
              </p>
            </section>

            {/* Section 8 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">8. GDPR Compliance</h3>
              <p className="text-slate-700 leading-relaxed">
                We comply with GDPR regulations for users in the European Union. We process data based on legal bases including consent, contract performance, and legitimate business interests.
              </p>
            </section>

            {/* Section 9 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">9. Data Retention</h3>
              <p className="text-slate-700 leading-relaxed">
                We retain personal data for as long as your account is active or as needed to provide services. You may request data deletion subject to legal retention requirements.
              </p>
            </section>

            {/* Section 10 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">10. Third-Party Links</h3>
              <p className="text-slate-700 leading-relaxed">
                Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Review their privacy policies before providing information.
              </p>
            </section>

            {/* Section 11 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">11. Policy Updates</h3>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent platform notification.
              </p>
            </section>

            {/* Contact Section */}
            <section className="p-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">12. Contact Us</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                For privacy-related inquiries or to exercise your rights, contact us at:
              </p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@hoteldmcbidding.com" className="text-teal-600 hover:text-teal-700">privacy@hoteldmcbidding.com</a></p>
                <p><strong>Postal Address:</strong> Rezpitch, Privacy Department, [Your Address]</p>
                <p><strong>Response Time:</strong> We aim to respond to all requests within 30 days.</p>
              </div>
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
