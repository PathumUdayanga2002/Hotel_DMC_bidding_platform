import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

const TermsAndConditions = () => {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
          <p className="text-gray-600 mb-8">Last Updated: December 2024</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Hotel & DMC Bidding Platform (the "Platform"), you accept and agree to be bound by these Terms & Conditions. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. User Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use this Platform, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Be at least 18 years of age</li>
                <li>Represent a legitimate business entity</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Account Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities under your account</li>
                <li>Notifying us immediately of unauthorized access</li>
                <li>Providing accurate and current information</li>
                <li>Using the Platform lawfully and ethically</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Post false, misleading, or defamatory content</li>
                <li>Engage in harassment, abuse, or discrimination</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Interfere with Platform functionality</li>
                <li>Use bots or automated tools without permission</li>
                <li>Violate intellectual property rights</li>
                <li>Engage in illegal activities or fraud</li>
                <li>Share confidential information without authorization</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Bidding and Contracts</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>5.1 Bid Validity:</strong> All bids submitted through the Platform are binding offers. Submitting a bid constitutes agreement to the terms specified.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>5.2 Contract Formation:</strong> Contracts are formed when the bidder and requester reach mutual agreement. All contracts must comply with applicable laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>5.3 Dispute Resolution:</strong> Parties agree to attempt resolution through direct negotiation first. Unresolved disputes may be escalated to Platform administrators for mediation.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>6.1 Fees:</strong> The Platform charges service fees as disclosed at the time of transaction. Fees are non-refundable unless otherwise specified.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>6.2 Payment Processing:</strong> We use third-party payment processors. You agree to provide accurate payment information and comply with their terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>6.3 Refunds:</strong> Refund requests must be submitted within 30 days of transaction. We reserve the right to decline refund requests for completed services.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Platform and its content (design, text, graphics) are owned by Hotel & DMC Bidding Platform and protected by copyright laws. You retain ownership of content you upload but grant us a license to display and share it as necessary for Platform operation.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">8. Liability Limitations</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>The Platform is provided "as is" without warranties</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid in the past 12 months</li>
                <li>We are not responsible for third-party actions or content</li>
                <li>We are not liable for business losses or lost profits</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Hotel & DMC Bidding Platform from any claims, damages, or costs arising from your violation of these Terms or your use of the Platform, including legal fees.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or harmful activities</li>
                <li>Fail to pay owed fees</li>
                <li>Violate applicable laws</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>11.1 Governing Law:</strong> These Terms are governed by applicable laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>11.2 Arbitration:</strong> Disputes shall be resolved through binding arbitration rather than litigation, except for IP infringement claims.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Continued use of the Platform after modifications constitutes acceptance of updated Terms.
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms & Conditions, contact:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:legal@hoteldmcbidding.com" className="text-blue-600 hover:underline">legal@hoteldmcbidding.com</a></p>
                <p><strong>Address:</strong> Hotel & DMC Bidding Platform, Legal Department, [Your Address]</p>
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

export default TermsAndConditions;
