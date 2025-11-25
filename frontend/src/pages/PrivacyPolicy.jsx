import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-12 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-12 font-light">
          Last updated: November 25, 2024
        </p>

        <div className="space-y-8 text-gray-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">1. Introduction</h2>
            <p className="leading-relaxed font-light mb-4">
              Hotel & DMC Bidding Platform ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="leading-relaxed font-light">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">2. Information We Collect</h2>
            <p className="leading-relaxed font-light mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light mb-4">
              <li><strong className="text-white">Personal Information:</strong> Name, email address, phone number, business address</li>
              <li><strong className="text-white">Business Information:</strong> Company name, business license, tax information</li>
              <li><strong className="text-white">Financial Information:</strong> Payment details, bank account information for transactions</li>
              <li><strong className="text-white">Profile Information:</strong> Photos, descriptions, service offerings, and credentials</li>
              <li><strong className="text-white">Communication Data:</strong> Messages, inquiries, and bids sent through the platform</li>
            </ul>
            <p className="leading-relaxed font-light mb-4">
              We also automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li><strong className="text-white">Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong className="text-white">Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong className="text-white">Location Data:</strong> General geographic location based on IP address</li>
              <li><strong className="text-white">Cookies and Tracking:</strong> Session data and preferences</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">3. How We Use Your Information</h2>
            <p className="leading-relaxed font-light mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Provide, maintain, and improve our platform services</li>
              <li>Process and facilitate transactions between hotels and DMCs</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Send you transaction confirmations, updates, and notifications</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">4. Information Sharing and Disclosure</h2>
            <p className="leading-relaxed font-light mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li><strong className="text-white">With Other Users:</strong> Profile information, bids, and messages are visible to relevant parties</li>
              <li><strong className="text-white">Service Providers:</strong> Third-party vendors who assist with payment processing, analytics, and hosting</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share information</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">5. Data Security</h2>
            <p className="leading-relaxed font-light mb-4">
              We implement appropriate technical and organizational security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication protocols</li>
              <li>Secure data storage and backup systems</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="leading-relaxed font-light mt-4">
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security of your data.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">6. Your Rights and Choices</h2>
            <p className="leading-relaxed font-light mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li><strong className="text-white">Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong className="text-white">Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">7. Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed font-light mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Maintain your session and preferences</li>
              <li>Analyze platform usage and performance</li>
              <li>Personalize your experience</li>
              <li>Deliver relevant advertisements</li>
            </ul>
            <p className="leading-relaxed font-light mt-4">
              You can control cookies through your browser settings, but disabling cookies may limit platform functionality.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">8. Data Retention</h2>
            <p className="leading-relaxed font-light">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When data is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">9. Children's Privacy</h2>
            <p className="leading-relaxed font-light">
              Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information promptly.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">10. Changes to This Privacy Policy</h2>
            <p className="leading-relaxed font-light">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">11. Contact Us</h2>
            <p className="leading-relaxed font-light mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <p className="font-light">Email: privacy@hotelbidding.com</p>
              <p className="font-light">Phone: +1 (555) 123-4567</p>
              <p className="font-light">Address: 123 Business Avenue, Suite 100, New York, NY 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
