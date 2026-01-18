import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
          <img src="/Rezpitch _logo.png" alt="Rezpitch" className="h-8" />
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full w-fit text-sm font-semibold text-teal-700">
            Terms & Conditions
          </div>
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Policy Overview</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Clear, transparent, and fair guidelines that govern how you use the Rezpitch platform and engage with partners.
            </p>
            <p className="text-sm text-slate-500">Last Updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/5 p-10 space-y-10">
          <div className="grid gap-6">
            {/* Section 1 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h3>
              <p className="text-slate-700 leading-relaxed">
                By accessing and using the Rezpitch platform (the "Platform"), you accept and agree to be bound by these Terms & Conditions. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">2. User Eligibility</h3>
              <p className="text-slate-700 leading-relaxed mb-4">To use this Platform, you must:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Be at least 18 years of age</li>
                <li>Represent a legitimate business entity</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Account Responsibilities</h3>
              <p className="text-slate-700 leading-relaxed mb-4">You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities under your account</li>
                <li>Notifying us immediately of unauthorized access</li>
                <li>Providing accurate and current information</li>
                <li>Using the Platform lawfully and ethically</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">4. Acceptable Use Policy</h3>
              <p className="text-slate-700 leading-relaxed mb-4">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
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
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">5. Bidding and Contracts</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p><strong>5.1 Bid Validity:</strong> All bids submitted through the Platform are binding offers. Submitting a bid constitutes agreement to the terms specified.</p>
                <p><strong>5.2 Contract Formation:</strong> Contracts are formed when the bidder and requester reach mutual agreement. All contracts must comply with applicable laws.</p>
                <p><strong>5.3 Dispute Resolution:</strong> Parties agree to attempt resolution through direct negotiation first. Unresolved disputes may be escalated to Platform administrators for mediation.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">6. Payment Terms</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p><strong>6.1 Fees:</strong> The Platform charges service fees as disclosed at the time of transaction. Fees are non-refundable unless otherwise specified.</p>
                <p><strong>6.2 Payment Processing:</strong> We use third-party payment processors. You agree to provide accurate payment information and comply with their terms.</p>
                <p><strong>6.3 Refunds:</strong> Refund requests must be submitted within 30 days of transaction. We reserve the right to decline refund requests for completed services.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">7. Intellectual Property</h3>
              <p className="text-slate-700 leading-relaxed">
                The Platform and its content (design, text, graphics) are owned by Rezpitch and protected by copyright laws. You retain ownership of content you upload but grant us a license to display and share it as necessary for Platform operation.
              </p>
            </section>

            {/* Section 8 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">8. Liability Limitations</h3>
              <p className="text-slate-700 leading-relaxed mb-4">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>The Platform is provided "as is" without warranties</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid in the past 12 months</li>
                <li>We are not responsible for third-party actions or content</li>
                <li>We are not liable for business losses or lost profits</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">9. Indemnification</h3>
              <p className="text-slate-700 leading-relaxed">
                You agree to indemnify and hold harmless Rezpitch from any claims, damages, or costs arising from your violation of these Terms or your use of the Platform, including legal fees.
              </p>
            </section>

            {/* Section 10 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">10. Termination</h3>
              <p className="text-slate-700 leading-relaxed mb-4">We may suspend or terminate your account if you:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or harmful activities</li>
                <li>Fail to pay owed fees</li>
                <li>Violate applicable laws</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">11. Dispute Resolution</h3>
              <div className="space-y-3 text-slate-700 leading-relaxed">
                <p><strong>11.1 Governing Law:</strong> These Terms are governed by applicable laws.</p>
                <p><strong>11.2 Arbitration:</strong> Disputes shall be resolved through binding arbitration rather than litigation, except for IP infringement claims.</p>
              </div>
            </section>

            {/* Section 12 */}
            <section className="p-6 rounded-2xl border border-slate-100 bg-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">12. Modifications</h3>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Continued use of the Platform after modifications constitutes acceptance of updated Terms.
              </p>
            </section>

            {/* Contact Section */}
            <section className="p-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">13. Contact Information</h3>
              <p className="text-slate-700 leading-relaxed mb-4">For questions about these Terms & Conditions, contact:</p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> <a href="mailto:legal@hoteldmcbidding.com" className="text-teal-600 hover:text-teal-700">legal@hoteldmcbidding.com</a></p>
                <p><strong>Address:</strong> Rezpitch, Legal Department, [Your Address]</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center space-y-3 text-sm text-slate-300">
          <p>&copy; 2024 Rezpitch. All rights reserved.</p>
          <p className="text-slate-400">Luxury hospitality where logic meets service.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
