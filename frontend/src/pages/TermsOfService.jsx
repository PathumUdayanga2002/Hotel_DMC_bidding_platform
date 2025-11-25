import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
          Terms of Service
        </h1>
        <p className="text-gray-400 mb-12 font-light">
          Last updated: November 25, 2024
        </p>

        <div className="space-y-8 text-gray-300">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">1. Acceptance of Terms</h2>
            <p className="leading-relaxed font-light mb-4">
              By accessing and using the Hotel & DMC Bidding Platform ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Platform.
            </p>
            <p className="leading-relaxed font-light">
              These Terms of Service govern your use of our platform and services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">2. User Accounts</h2>
            <p className="leading-relaxed font-light mb-4">
              To access certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Promptly notify us of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">3. Platform Services</h2>
            <p className="leading-relaxed font-light mb-4">
              Our Platform provides a marketplace connecting hotels with Destination Management Companies (DMCs) through a competitive bidding system. Services include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Posting and managing guest requirement inquiries</li>
              <li>Submitting and managing bids on inquiries</li>
              <li>Direct communication between hotels and DMCs</li>
              <li>Contract management and digital agreements</li>
              <li>Payment processing and transaction management</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">4. User Obligations</h2>
            <p className="leading-relaxed font-light mb-4">
              As a user of this Platform, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Provide truthful and accurate information in all listings and bids</li>
              <li>Conduct all business transactions in good faith</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect intellectual property rights of others</li>
              <li>Not engage in fraudulent or deceptive practices</li>
              <li>Not use the Platform for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">5. Bidding and Transactions</h2>
            <p className="leading-relaxed font-light mb-4">
              All bids placed on the Platform constitute a binding offer. When a bid is accepted, both parties enter into a contractual agreement. You acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>All bids are legally binding commitments</li>
              <li>Cancellation of accepted bids may result in penalties</li>
              <li>Payment terms must be honored as agreed</li>
              <li>Service delivery must meet the specifications outlined in the bid</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">6. Fees and Payments</h2>
            <p className="leading-relaxed font-light mb-4">
              The Platform charges service fees for successful transactions. All fees are clearly disclosed before confirmation of any transaction. Users agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 font-light">
              <li>Pay all applicable platform fees and charges</li>
              <li>Provide valid payment information</li>
              <li>Accept that all fees are non-refundable unless otherwise stated</li>
              <li>Be responsible for any taxes or duties related to their transactions</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">7. Intellectual Property</h2>
            <p className="leading-relaxed font-light">
              All content on the Platform, including but not limited to text, graphics, logos, images, and software, is the property of Hotel & DMC Bidding Platform or its content suppliers and is protected by international copyright laws. Unauthorized use of any content may violate copyright, trademark, and other laws.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">8. Limitation of Liability</h2>
            <p className="leading-relaxed font-light">
              The Platform acts as a marketplace facilitator and is not a party to any transaction between hotels and DMCs. We shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from your use of the Platform or any transactions conducted through it.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">9. Termination</h2>
            <p className="leading-relaxed font-light">
              We reserve the right to terminate or suspend your account and access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">10. Contact Information</h2>
            <p className="leading-relaxed font-light mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <p className="font-light">Email: legal@hotelbidding.com</p>
              <p className="font-light">Phone: +1 (555) 123-4567</p>
              <p className="font-light">Address: 123 Business Avenue, Suite 100, New York, NY 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
