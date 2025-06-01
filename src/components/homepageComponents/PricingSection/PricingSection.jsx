import React, { useState } from "react";
import { Check, X, Sparkles, Zap, Star, ChevronDown } from "lucide-react";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("yearly");

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out the service",
      monthlyPrice: 0,
      yearlyPrice: 0,
      savings: null,
      color: "from-gray-500 to-gray-600",
      features: [
        { title: "30 images per month", included: true },
        { title: "Basic AI tagging", included: true },
        { title: "Export PNG, JPEG files", included: true },
        { title: "Standard support", included: true },
        { title: "Lightroom integration", included: false },
        { title: "API access", included: false },
        { title: "Bulk processing", included: false },
      ],
      popular: false,
      ctaText: "Get Started",
    },
    {
      name: "Pro",
      description: "For serious photographers and creators",
      monthlyPrice: 19.99,
      yearlyPrice: 14.99,
      savings: "25%",
      color: "from-blue-500 to-indigo-600",
      features: [
        { title: "200 images per month", included: true },
        { title: "Advanced AI tagging", included: true },
        { title: "Export all file formats", included: true },
        { title: "Priority support", included: true },
        { title: "Lightroom integration", included: true },
        { title: "API access", included: false },
        { title: "Bulk processing", included: true },
      ],
      popular: true,
      ctaText: "Go Pro",
    },
    {
      name: "Business",
      description: "For agencies and high-volume needs",
      monthlyPrice: 49.99,
      yearlyPrice: 39.99,
      savings: "20%",
      color: "from-pink-500 to-purple-600",
      features: [
        { title: "Unlimited images", included: true },
        { title: "Premium AI tagging", included: true },
        { title: "Export all file formats", included: true },
        { title: "Dedicated support", included: true },
        { title: "Lightroom integration", included: true },
        { title: "API access", included: true },
        { title: "Bulk processing", included: true },
      ],
      popular: false,
      ctaText: "Contact Sales",
    },
  ];

  const handlePlanSelection = (plan) => {
    // For free plan, don't navigate to payment
    if (plan.name === "Free") {
      alert("Free plan selected! You can start using the service immediately.");
      return;
    }

    // For Business plan, show contact sales message
    if (plan.name === "Business") {
      alert("Please contact our sales team for Business plan setup.");
      return;
    }

    // For paid plans, navigate to payment with plan data
    const currentPrice =
      billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    const queryParams = new URLSearchParams({
      plan: plan.name.toLowerCase(),
      billing: billingCycle,
      price: currentPrice.toString(),
      planName: plan.name,
      description: plan.description,
    });

    // Navigate to payment page with plan details
    window.location.href = `/payment?${queryParams.toString()}`;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-3/4 -left-40 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 right-1/2 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose the perfect plan for your needs
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Simple, transparent pricing that scales with your usage. No hidden
            fees or surprises.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative p-1 bg-gray-100 rounded-full flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none ${
                billingCycle === "monthly"
                  ? "text-indigo-700 bg-white shadow-md"
                  : "text-gray-700 hover:text-indigo-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative ml-0.5 rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none ${
                billingCycle === "yearly"
                  ? "text-indigo-700 bg-white shadow-md"
                  : "text-gray-700 hover:text-indigo-700"
              }`}
            >
              Yearly
              {billingCycle === "yearly" && (
                <span className="absolute -top-3 -right-3 px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800">
                  Save 20%+
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-indigo-500 shadow-lg scale-105 bg-white z-10"
                  : "border border-gray-200 shadow-md hover:-translate-y-1 bg-white/90"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                    <Star className="w-3 h-3 mr-1 fill-white" /> Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $
                    {billingCycle === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /mo
                  </span>
                  {billingCycle === "yearly" && plan.savings && (
                    <span className="ml-2 text-sm font-semibold text-green-500">
                      Save {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features list */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? `text-white bg-gradient-to-r ${plan.color}`
                            : "text-gray-400 bg-gray-100"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </div>
                      <span
                        className={`ml-3 text-sm ${
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {feature.title}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-8">
                  <button
                    onClick={() => handlePlanSelection(plan)}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-300 ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-indigo-200 hover:scale-105`
                        : `bg-gradient-to-r ${plan.color} hover:shadow-lg hover:scale-105`
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise callout */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Need a custom solution?
              </h3>
              <p className="mt-3 max-w-3xl text-lg text-indigo-100">
                Get in touch with our sales team to discuss custom pricing,
                dedicated support, and tailored features for large enterprises.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
              <button className="px-8 py-3 rounded-lg text-indigo-600 bg-white font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
        {/* Guarantee banner */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center p-1 pr-4 rounded-full bg-green-100 text-green-800">
            <div className="bg-white p-1 rounded-full mr-2">
              <Sparkles className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium">
              14-day money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
