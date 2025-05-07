import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import apiClient from "../services/api";

const businessPlans = [
  {
    id: "small-business",
    name: "Small Business Tax Return",
    basePrice: 1500,
    priceLabel: "Per Return",
    features: [
      "GST Reconciliation",
      "Payroll Reconciliation",
      "Depreciation Schedule",
      "Profit & Loss Statement",
      "Balance Sheet & Notes",
      "Prepare & File Business Tax Return",
    ],
  },
  {
    id: "vcfo",
    name: "VCFO Service including Tax Return",
    basePrice: 499,
    priceLabel: "Per Month",
    features: [
      "Annual Financial Statements",
      "Income Tax Return",
      "Business Activity Statements (BAS)",
      "Tax Administration (Tax Assessments and reminders)",
      "ASIC Management",
      "Annual Tax Planning Review",
      "Annual Business Performance Health Check",
      "Regular Management Reports for tax, budget & cash flow",
      "Regular email updates on relevant tax and business issues",
      "Telephone or email access for ad hoc advice/information",
    ],
  },
];

const BusinessPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState(businessPlans[0].id);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    } else {
      toast({
        title: "No form data found",
        description: "Please complete the business tax form first.",
        variant: "destructive",
      });
      navigate("/tax-forms/business");
    }
  }, [location.state, toast, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handlePlanSelect = (planId: string) => setSelectedPlan(planId);

  const handlePayment = async () => {
    if (!formData) return;
    setIsSubmitting(true);

    // Find selected plan
    const plan = businessPlans.find((p) => p.id === selectedPlan);

    // Prepare payment info
    const paymentInfo = {
      plan: plan?.name,
      basePrice: plan?.basePrice,
      paymentStatus: "completed", // In real scenario - get from processor
      paymentDate: new Date().toISOString(),
    };

    const finalSubmission = {
      ...formData,
      payment: paymentInfo,
    };

    try {
      const res = await apiClient.post("/tax-solutions/business-complete-submission", finalSubmission);

      if (res.status === 200) {
        toast({
          title: "Payment successful!",
          description: "Your business tax form has been submitted.",
          variant: "default",
        });
        navigate("/tax-forms", {
          state: {
            submissionComplete: true,
            message: "Your business tax form and payment have been processed successfully.",
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-12 max-w-5xl mx-auto px-4">
      {/* Back button */}
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2 border-purple-200 hover:bg-purple-50"
        onClick={() => navigate("/tax-forms/business")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Business Form
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Business Service Plans
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a plan for your business tax form submission
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {businessPlans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 transition-all cursor-pointer ${
              selectedPlan === plan.id
                ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50"
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <div className="bg-black text-white inline-block px-3 py-1 rounded text-sm font-medium mb-3">
              {plan.name}
            </div>
            <div className="mb-4">
              <div className="text-gray-500 text-sm">From $</div>
              <div className="text-5xl font-bold">{plan.basePrice}</div>
              <div className="text-gray-500 mt-1">{plan.priceLabel}</div>
            </div>
            <div className="mb-6">
              <p className="font-medium mb-2">The fee includes:</p>
              <ul className="space-y-1.5">
                {plan.features.map((feature, idx) => (
                  <li className="flex items-start" key={idx}>
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              className={`w-full ${
                selectedPlan === plan.id
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {selectedPlan === plan.id ? "Selected" : "Select Plan"}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-gray-600">Selected plan</p>
          </div>
          <div className="text-3xl font-bold">
            $
            {
              businessPlans.find((p) => p.id === selectedPlan)
                ?.basePrice
            }
          </div>
        </div>
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            Your payment is secure. We use industry-standard encryption to protect your information.
          </div>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 flex items-center justify-center gap-2"
          onClick={handlePayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-1" />
              Complete Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BusinessPaymentPage;
