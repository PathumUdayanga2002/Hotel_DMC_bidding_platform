import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { useState } from 'react';

const FAQ = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqCategories = {
    general: {
      title: 'General Questions',
      faqs: [
        {
          id: 'g1',
          question: 'What is Hotel & DMC Bidding Platform?',
          answer: 'Hotel & DMC Bidding Platform is a B2B marketplace that connects hotels with Destination Management Companies (DMCs). Hotels post guest requirements and receive competitive bids from verified DMCs, while DMCs gain access to a steady stream of quality leads.'
        },
        {
          id: 'g2',
          question: 'Is the platform free to use?',
          answer: 'The platform charges a small service fee on completed transactions. This fee is transparent and disclosed upfront. Registration and browsing are completely free.'
        },
        {
          id: 'g3',
          question: 'How do I create an account?',
          answer: 'Click on the "Register" button on the landing page, select your role (Hotel, DMC, or Admin), and fill in the required information. You\'ll receive a verification email to confirm your account.'
        },
        {
          id: 'g4',
          question: 'Is my data secure?',
          answer: 'Yes. We use industry-standard SSL encryption, secure databases, and GDPR-compliant data handling practices. All sensitive information is protected.'
        }
      ]
    },
    hotels: {
      title: 'For Hotels',
      faqs: [
        {
          id: 'h1',
          question: 'How do I post an inquiry?',
          answer: 'After logging in, navigate to "Create Inquiry" and provide details about your guest requirements including dates, destination, group size, and special requests. You can choose to send direct inquiries to specific DMCs or open bidding to all verified DMCs.'
        },
        {
          id: 'h2',
          question: 'Can I contact DMCs directly?',
          answer: 'Yes! You can send direct inquiries to specific DMCs you prefer to work with. You can also open bidding to a wider pool of verified DMCs to compare options.'
        },
        {
          id: 'h3',
          question: 'How long does it take to receive bids?',
          answer: 'Most DMCs respond within 4-24 hours. You\'ll receive notifications in real-time as bids come in through the platform notification system.'
        },
        {
          id: 'h4',
          question: 'Can I negotiate with DMCs after receiving bids?',
          answer: 'Absolutely. You can communicate directly with DMCs through the platform messaging system to negotiate terms, pricing, and special arrangements.'
        },
        {
          id: 'h5',
          question: 'What happens after I select a DMC?',
          answer: 'Once you accept a bid, a contract is generated in the platform. You and the DMC can review, modify, and sign it digitally. The platform facilitates payment and tracks all deliverables.'
        }
      ]
    },
    dmcs: {
      title: 'For DMCs',
      faqs: [
        {
          id: 'd1',
          question: 'How do I get inquiries?',
          answer: 'Once your profile is verified and approved, you\'ll receive notifications about relevant inquiries. You can also browse all open inquiries and submit bids to those that match your services.'
        },
        {
          id: 'd2',
          question: 'How do I create a competitive bid?',
          answer: 'Review the inquiry details carefully and submit a comprehensive bid that includes your pricing, services offered, team expertise, and any value-adds. Upload your company brochure or portfolio to strengthen your proposal.'
        },
        {
          id: 'd3',
          question: 'Can I bid on multiple inquiries?',
          answer: 'Yes! You can bid on as many relevant inquiries as you want. There\'s no limit to the number of active bids.'
        },
        {
          id: 'd4',
          question: 'How is payment handled?',
          answer: 'Payment is processed through the platform once the contract is signed. The platform holds funds securely and releases them upon service completion or as per the contract terms.'
        },
        {
          id: 'd5',
          question: 'What should I include in my profile?',
          answer: 'Include your company name, locations served, services offered, certifications, team experience, past client references, and portfolio. A complete profile significantly increases your chances of winning bids.'
        }
      ]
    },
    payments: {
      title: 'Payments & Billing',
      faqs: [
        {
          id: 'p1',
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards, bank transfers, and digital wallets through our secure payment processor. Payment information is encrypted and PCI-compliant.'
        },
        {
          id: 'p2',
          question: 'Are there hidden fees?',
          answer: 'No. All fees are transparent and disclosed upfront. The service fee is calculated as a percentage of the contract value and is clearly stated before you proceed with payment.'
        },
        {
          id: 'p3',
          question: 'Can I get an invoice?',
          answer: 'Yes. Invoices are automatically generated and sent to your email after payment. You can also download them from your account dashboard anytime.'
        },
        {
          id: 'p4',
          question: 'What is your refund policy?',
          answer: 'Refunds must be requested within 30 days of transaction. Completed services are generally non-refundable. Contact our billing team for specific refund inquiries.'
        },
        {
          id: 'p5',
          question: 'How do I view my billing history?',
          answer: 'Log into your account and navigate to "Billing" or "Transaction History" to view all past payments and invoices.'
        }
      ]
    },
    technical: {
      title: 'Technical Issues',
      faqs: [
        {
          id: 't1',
          question: 'I forgot my password. What do I do?',
          answer: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a reset link. Follow the instructions to create a new password.'
        },
        {
          id: 't2',
          question: 'The platform is not loading properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, then refresh the page. If the issue persists, try a different browser or device. Contact tech support at tech@hoteldmcbidding.com for further assistance.'
        },
        {
          id: 't3',
          question: 'Can I use the platform on mobile?',
          answer: 'Yes! The platform is fully responsive and works on all devices including phones, tablets, and desktop computers.'
        },
        {
          id: 't4',
          question: 'How do I upload documents?',
          answer: 'You can upload documents (PDF, Word, images) by clicking the upload button in the relevant section. Maximum file size is 10MB per file.'
        },
        {
          id: 't5',
          question: 'What browsers does the platform support?',
          answer: 'The platform works on all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for optimal performance.'
        }
      ]
    },
    support: {
      title: 'Support & Policies',
      faqs: [
        {
          id: 's1',
          question: 'How do I report a fraudulent user or activity?',
          answer: 'If you suspect fraudulent activity, contact our support team immediately at support@hoteldmcbidding.com. Provide details and any relevant screenshots. We investigate all reports promptly.'
        },
        {
          id: 's2',
          question: 'How do disputes get resolved?',
          answer: 'We encourage parties to communicate directly first. If not resolved, disputes are escalated to our admin team for mediation. We follow a fair and transparent dispute resolution process.'
        },
        {
          id: 's3',
          question: 'Can I cancel my account?',
          answer: 'Yes, you can deactivate your account anytime from your account settings. Note that you remain responsible for any outstanding payments or active contracts.'
        },
        {
          id: 's4',
          question: 'What if I need more help?',
          answer: 'Contact our support team via email (support@hoteldmcbidding.com), phone (+1 234-567-890), or use our contact form. We\'re available Monday-Friday, 9 AM - 6 PM EST.'
        },
        {
          id: 's5',
          question: 'Can I export my data?',
          answer: 'Yes. You can request your data export from your account settings. We\'ll provide your information in a standard format within 30 days.'
        }
      ]
    }
  };

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

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
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {Object.entries(faqCategories).map(([key, category]) => (
            <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4">
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>

              {/* FAQs */}
              <div className="divide-y">
                {category.faqs.map((faq) => (
                  <div key={faq.id} className="border-b last:border-b-0">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      <h4 className="text-left text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h4>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-600 flex-shrink-0 ml-4 transition-transform ${
                          expandedFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Answer */}
                    {expandedFAQ === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-8 border-2 border-cyan-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
            >
              Back to Home
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

export default FAQ;
