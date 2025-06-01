import * as React from "react";
import { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Sparkles,
} from "lucide-react";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily:
        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      "::placeholder": {
        color: "#9ca3af",
      },
      padding: "12px 0",
      lineHeight: "24px",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
    complete: {
      color: "#059669",
      iconColor: "#059669",
    },
  },
};

export default function UserPayment() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Default plans data
  const plans = {
    free: {
      name: "Free",
      description: "Perfect for trying out the service",
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: "from-gray-500 to-gray-600",
      popular: false,
    },
    pro: {
      name: "Pro",
      description: "For serious photographers and creators",
      monthlyPrice: 19.99,
      yearlyPrice: 14.99,
      color: "from-blue-500 to-indigo-600",
      popular: true,
      savings: "25%",
    },
    business: {
      name: "Business",
      description: "For agencies and high-volume needs",
      monthlyPrice: 49.99,
      yearlyPrice: 39.99,
      color: "from-pink-500 to-purple-600",
      popular: false,
      savings: "20%",
    },
  };

  useEffect(() => {
    // Get plan data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const planName = urlParams.get("plan") || "pro";
    const billing = urlParams.get("billing") || "monthly";
    const price = parseFloat(urlParams.get("price")) || 19.99;
    const planDisplayName = urlParams.get("planName") || "Pro";
    const description =
      urlParams.get("description") || "For serious photographers and creators";

    // Create plan object from URL params or use default
    const planFromUrl = plans[planName.toLowerCase()] || {
      name: planDisplayName,
      description: description,
      monthlyPrice: billing === "monthly" ? price : price * 1.25,
      yearlyPrice: billing === "yearly" ? price : price * 0.8,
      color:
        planName === "business"
          ? "from-pink-500 to-purple-600"
          : "from-blue-500 to-indigo-600",
      popular: planName === "pro",
      savings: billing === "yearly" ? "25%" : null,
    };

    setSelectedPlan(planFromUrl);
    setBillingCycle(billing);
  }, []);

  const getCurrentPrice = () => {
    if (!selectedPlan) return 0;
    // Get price from URL params if available, otherwise use plan pricing
    const urlParams = new URLSearchParams(window.location.search);
    const urlPrice = parseFloat(urlParams.get("price"));

    if (urlPrice) {
      return urlPrice;
    }

    return billingCycle === "monthly"
      ? selectedPlan.monthlyPrice
      : selectedPlan.yearlyPrice;
  };

  const handleSubmit = async () => {
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setPaymentError("");

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setPaymentError(
        "Payment form not loaded properly. Please refresh and try again."
      );
      setIsProcessing(false);
      return;
    }

    try {
      const { token, error } = await stripe.createToken(cardNumberElement);

      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
        return;
      }

      if (token) {
        console.log("Payment token:", token);

        const paymentData = {
          tokenId: token.id,
          selected_plan_price: (getCurrentPrice() * 100).toString(), // Convert to cents
          selected_plan_name: selectedPlan?.name.toLowerCase() || "pro",
          billing_cycle: billingCycle,
          amount: getCurrentPrice(),
          email: "sasindu2@gmail.com",
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setPaymentSuccess(true);
        console.log("Payment processed successfully", paymentData);
      }
    } catch (err) {
      setPaymentError("An unexpected error occurred. Please try again.");
      console.error("Payment processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. You'll receive a
            confirmation email shortly.
          </p>
          <button
            onClick={() => setPaymentSuccess(false)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Secure Payment
          </h1>
          <p className="text-gray-600">
            Complete your payment securely with Stripe
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Selected Plan Info */}
          {selectedPlan && (
            <div
              className={`bg-gradient-to-r ${selectedPlan.color} p-4 sm:p-6 text-white relative overflow-hidden`}
            >
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
                <div className="flex-1 sm:pr-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">
                    {selectedPlan.name} Plan
                  </h3>
                  <p className="text-white/90 text-sm mb-3 sm:mb-4">
                    {selectedPlan.description}
                  </p>
                  <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                    <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md ${
                          billingCycle === "monthly"
                            ? "bg-white text-gray-700 shadow-sm"
                            : "text-white/80"
                        }`}
                      >
                        Monthly
                      </span>
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md ${
                          billingCycle === "yearly"
                            ? "bg-white text-gray-700 shadow-sm"
                            : "text-white/80"
                        }`}
                      >
                        Yearly
                      </span>
                    </div>
                    {selectedPlan.popular && (
                      <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        <span className="hidden sm:inline">Popular</span>
                        <span className="sm:hidden">★</span>
                      </div>
                    )}
                  </div>
                  {billingCycle === "yearly" && selectedPlan.savings && (
                    <div className="mt-3 sm:mt-4">
                      <div className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/20 backdrop-blur-sm border border-green-400/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span className="text-xs font-medium">
                          Save {selectedPlan.savings}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-right sm:ml-6 border-t border-white/20 pt-4 sm:border-t-0 sm:pt-0">
                  <div className="text-2xl sm:text-3xl font-bold">
                    ${getCurrentPrice().toFixed(2)}
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm">
                    per{" "}
                    {billingCycle === "monthly"
                      ? "month"
                      : "month, billed yearly"}
                  </div>
                  {billingCycle === "yearly" && getCurrentPrice() > 0 && (
                    <div className="text-xs text-white/70 mt-1">
                      ${(getCurrentPrice() * 12).toFixed(2)} billed annually
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Error Message */}
            {paymentError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{paymentError}</p>
              </div>
            )}

            {/* Card Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Card Information
                </label>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-200">
                  <CardNumberElement options={cardElementOptions} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Expiry Date
                  </label>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-200">
                    <CardExpiryElement options={cardElementOptions} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    CVC
                  </label>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-200">
                    <CardCvcElement options={cardElementOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <Lock className="w-4 h-4 text-green-500" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!stripe || isProcessing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>
                    Complete Payment - ${getCurrentPrice().toFixed(2)}
                  </span>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold">Stripe</span> •
                256-bit SSL encryption
              </p>
              <p className="text-xs text-gray-400">
                By completing this payment, you agree to our terms of service
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs">Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
