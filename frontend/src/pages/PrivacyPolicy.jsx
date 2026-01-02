import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-600">Hotel & DMC Bidding Platform</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
          <p className="text-gray-600 mb-8">Last Updated: December 2024</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hotel & DMC Bidding Platform ("Company," "we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our platform.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">2.1 Information You Provide</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Registration information (name, email, phone, company details)</li>
                    <li>Profile information (business type, service descriptions, certifications)</li>
                    <li>Payment and billing information</li>
                    <li>Communication messages and inquiries</li>
                    <li>Contract and bidding documents</li>
                    <li>Customer support interactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">2.2 Information Collected Automatically</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Log data (IP address, browser type, pages visited, timestamp)</li>
                    <li>Cookies and tracking technologies</li>
                    <li>Device information</li>
                    <li>Usage analytics and behavior patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">We use collected information for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
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
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. However, we may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Service providers and vendors (payment processors, email services)</li>
                <li>Other users (limited profile information for business connections)</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners for fraud prevention</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures including SSL encryption, secure databases, and access controls. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies to enhance your experience. You can control cookie preferences through your browser settings. Disabling cookies may affect platform functionality.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">8. GDPR Compliance</h3>
              <p className="text-gray-700 leading-relaxed">
                We comply with GDPR regulations for users in the European Union. We process data based on legal bases including consent, contract performance, and legitimate business interests.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                We retain personal data for as long as your account is active or as needed to provide services. You may request data deletion subject to legal retention requirements.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h3>
              <p className="text-gray-700 leading-relaxed">
                Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Review their privacy policies before providing information.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">11. Policy Updates</h3>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent platform notification.
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For privacy-related inquiries or to exercise your rights, contact us at:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@hoteldmcbidding.com" className="text-blue-600 hover:underline">privacy@hoteldmcbidding.com</a></p>
                <p><strong>Postal Address:</strong> Hotel & DMC Bidding Platform, Privacy Department, [Your Address]</p>
                <p><strong>Response Time:</strong> We aim to respond to all requests within 30 days.</p>
              </div>
            </section>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
              className="inline-block"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Hotel & DMC Bidding Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
