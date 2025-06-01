import React, { useState } from "react";
import {
  Plus,
  Minus,
  HelpCircle,
  Search,
  MessageCircle,
  CreditCard,
  Zap,
} from "lucide-react";

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const categories = [
    { id: "all", name: "All Questions", icon: <HelpCircle /> },
    { id: "pricing", name: "Pricing", icon: <CreditCard /> },
    { id: "features", name: "Features", icon: <Zap /> },
    { id: "support", name: "Support", icon: <MessageCircle /> },
  ];

  const faqs = [
    {
      id: 1,
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
      category: "pricing",
    },
    {
      id: 2,
      question: "Is there a limit to the file size?",
      answer:
        "Yes, the maximum file size is 50MB per image or video file. This is sufficient for most high-quality photos and short video clips.",
      category: "features",
    },
    {
      id: 3,
      question: "How accurate is the AI tagging?",
      answer:
        "Our AI tagging system achieves over 95% accuracy for common subjects and scenes. The system is constantly learning and improving based on user feedback and new training data.",
      category: "features",
    },
    {
      id: 4,
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 14 days of purchase for a full refund.",
      category: "pricing",
    },
    {
      id: 5,
      question: "Do you offer customer support?",
      answer:
        "Yes, we offer email support for all plans. Pro and Business plans include priority support with faster response times. Business plans also include dedicated support with a personal account manager.",
      category: "support",
    },
    {
      id: 6,
      question: "Can I use the API for my own applications?",
      answer:
        "Yes, Business plan subscribers get full API access with comprehensive documentation. This allows you to integrate our AI tagging capabilities directly into your own applications and workflows.",
      category: "features",
    },
    {
      id: 7,
      question: "Is there a free trial?",
      answer:
        "Yes, our Free plan allows you to process up to 30 images per month at no cost. This gives you a chance to test our service before committing to a paid plan.",
      category: "pricing",
    },
    {
      id: 8,
      question: "How do I contact support?",
      answer:
        "You can reach our support team via email at support@phototag.ai or through the in-app chat. Business plan customers can also schedule video calls with their account manager.",
      category: "support",
    },
  ];

  // Filter FAQs based on active category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white to-gray-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-64 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 -left-64 w-[600px] h-[600px] bg-pink-50 rounded-full blur-3xl opacity-30"></div>

        <div
          className="absolute w-full h-full bg-grid-pattern opacity-[0.03]"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
              <HelpCircle className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our service, features, and
            pricing.
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-10">
          <div className="relative mb-8 max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
              >
                {React.cloneElement(category.icon, { size: 16 })}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`transition-all duration-300 rounded-xl overflow-hidden ${
                    expandedQuestion === index
                      ? "bg-white shadow-lg border-l-4 border-indigo-500"
                      : "bg-white/80 shadow hover:shadow-md border border-gray-100"
                  }`}
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleQuestion(index)}
                  >
                    <span className="font-medium text-gray-900 text-lg">
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 ml-2 p-1.5 rounded-full ${
                        expandedQuestion === index
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {expandedQuestion === index ? (
                        <Minus size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedQuestion === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No results found
                </h3>
                <p className="text-gray-500">
                  We couldn't find any questions matching "{searchQuery}". Try a
                  different search term.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Still have questions banner */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Still have questions?
                </h3>
                <p className="text-gray-600">
                  Can't find the answer you're looking for? Contact our customer
                  support team for personalized assistance.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end">
                <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
