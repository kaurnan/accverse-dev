import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import apiClient from '../services/api';

interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

const SMSFPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'premium'>('essential');
  const [addOns, setAddOns] = useState<AddOnService[]>([
    {
      id: 'actuarial',
      name: 'Actuarial Certificate Fees',
      description: 'Professional actuarial certificate for your SMSF',
      price: 125,
      selected: false
    },
    {
      id: 'multi-member',
      name: 'SMSF with more than 4 members',
      description: 'Additional services for funds with 5+ members',
      price: 200,
      selected: false
    },
    {
      id: 'individual-setup',
      name: 'SMSF set-up with Individual Trustees',
      description: 'Complete setup service with individual trustees',
      price: 450,
      selected: false
    },
    {
      id: 'corporate-setup',
      name: 'SMSF set-up with a Corporate Trustee',
      description: 'Complete setup service with a corporate trustee structure',
      price: 1400,
      selected: false
    },
    {
      id: 'payg',
      name: 'PAYG Instalment, BAS, GST lodgement',
      description: 'Per statement processing and lodgement',
      price: 200,
      selected: false
    },
    {
      id: 'takeon',
      name: 'Existing SMSF take-on',
      description: 'One-off fee for transferring existing SMSF',
      price: 100,
      selected: false
    },
    {
      id: 'audit-only',
      name: 'Audit only (i.e. you handle your own accounting and tax)',
      description: 'Independent audit services only',
      price: 300,
      selected: false
    },
    {
      id: 'consulting',
      name: 'Consulting fees',
      description: '$200 per hour, phone and email support',
      price: 200,
      selected: false
    }
  ]);

  // Essential plan base features
  const essentialFeatures = [
    'SMSF Financial Statements',
    'SMSF Tax Return',
    'Preparation of annual Trustee Resolutions and Minutes',
    'Audit Fees',
    'Software Subscription',
    'Annual member statements',
    'Annual investment and performance reports'
  ];

  // Premium plan base features
  const premiumFeatures = [
    'SMSF Financial Statements',
    'SMSF Tax Return',
    'Independent Audit Fees',
    'Software Subscription',
    "Ongoing administration and reconciliation of SMSF's transaction data",
    'Preparation of annual Trustee Resolutions and Minutes',
    'Annual member statements',
    'Annual investment and performance reports',
    'General technical advice and guidance',
    'Actuarial Certificate Fees +$125'
  ];

  // Retrieve form data from state or localStorage
  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    } else {
      // If no form data in state, redirect back to the form
      toast({
        title: "No form data found",
        description: "Please complete the SMSF form first.",
        variant: "destructive",
      });
      navigate('/tax-solutions/smsf');
    }
  }, [location.state, navigate, toast]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handlePlanChange = (plan: 'essential' | 'premium') => {
    setSelectedPlan(plan);
    
    // If switching to Premium, automatically include actuarial certificate
    if (plan === 'premium') {
      setAddOns(prev => prev.map(addon => 
        addon.id === 'actuarial' ? {...addon, selected: true} : addon
      ));
    }
  };

  const toggleAddOn = (id: string) => {
    setAddOns(prev => prev.map(addon => 
      addon.id === id ? {...addon, selected: !addon.selected} : addon
    ));
  };

  const calculateTotal = () => {
    const basePlan = selectedPlan === 'essential' ? 900 : 1500;
    const addOnTotal = addOns.reduce((sum, addon) => 
      addon.selected ? sum + addon.price : sum, 0);
    
    return basePlan + addOnTotal;
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    try {
      // Add payment information to the form data
      const paymentInfo = {
        plan: selectedPlan,
        basePrice: selectedPlan === 'essential' ? 900 : 1500,
        selectedAddOns: addOns.filter(addon => addon.selected),
        totalAmount: calculateTotal(),
        paymentStatus: 'completed', // In a real scenario, this would come from payment processor
        paymentDate: new Date().toISOString()
      };
      
      // In a real implementation, you would process payment here
      // For now, we'll simulate a successful payment and update the form status
      
      // Combine form data with payment info
      const finalData = {
        ...formData,
        payment: paymentInfo
      };
      
      // Send the updated data to the server
      const response = await apiClient.post("/tax-solutions/complete-submission", finalData);
      
      if (response.status === 200) {
        toast({
          title: "Payment successful!",
          description: "Your SMSF form has been submitted successfully.",
          variant: "default",
        });
        
        // Redirect to a success page or back to the dashboard
        navigate("/tax-forms", { 
          state: { 
            submissionComplete: true, 
            message: "Your SMSF form and payment have been processed successfully." 
          } 
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
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
        onClick={() => navigate('/tax-solutions/smsf')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to SMSF Form
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          SMSF Service Plans
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a plan and add-on services for your Self-Managed Superannuation Fund
        </p>
      </div>

      <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
        <div className="flex items-start">
          <CheckCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Form Completed Successfully</h3>
            <p className="text-gray-600">
              Your SMSF form has been saved. Please select a service plan to complete your submission.
            </p>
            {formData?.smsfName && (
              <p className="font-medium mt-1">SMSF Name: {formData.smsfName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
        {/* Essential Plan */}
        <div 
          className={`border rounded-lg p-6 transition-all ${
            selectedPlan === 'essential' 
              ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
          }`}
          onClick={() => handlePlanChange('essential')}
        >
          <div className="bg-black text-white inline-block px-3 py-1 rounded text-sm font-medium mb-3">
            Essential Plan
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm">From $</div>
            <div className="text-5xl font-bold">900</div>
            <div className="text-gray-500 mt-1">per year</div>
          </div>
          
          <div className="mb-6">
            <p className="font-medium mb-2">The fee includes:</p>
            <ul className="space-y-1.5">
              {essentialFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            className={`w-full ${selectedPlan === 'essential' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => handlePlanChange('essential')}
          >
            {selectedPlan === 'essential' ? 'Selected' : 'Select Plan'}
          </Button>
        </div>
        
        {/* Premium Plan */}
        <div 
          className={`border rounded-lg p-6 transition-all ${
            selectedPlan === 'premium' 
              ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
          }`}
          onClick={() => handlePlanChange('premium')}
        >
          <div className="bg-black text-white inline-block px-3 py-1 rounded text-sm font-medium mb-3">
            Premium Plan
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm">From $</div>
            <div className="text-5xl font-bold">1500</div>
            <div className="text-gray-500 mt-1">per year</div>
          </div>
          
          <div className="mb-6">
            <p className="font-medium mb-2">The fee includes:</p>
            <ul className="space-y-1.5">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            className={`w-full ${selectedPlan === 'premium' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => handlePlanChange('premium')}
          >
            {selectedPlan === 'premium' ? 'Selected' : 'Select Plan'}
          </Button>
        </div>
      </div>
      
      {/* Add-on Services */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Other Services</h2>
        <p className="text-gray-600 mb-6">Select additional services you may require:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addOns.map((addon) => (
            <div 
              key={addon.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                addon.selected 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
              }`}
              onClick={() => toggleAddOn(addon.id)}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  addon.selected ? 'bg-green-500 border-green-500' : 'border-gray-400'
                }`}>
                  {addon.selected && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{addon.name}</h3>
                  <p className="text-sm text-gray-600">{addon.description}</p>
                </div>
                <div className="font-bold text-right whitespace-nowrap">
                  ${addon.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Total and Checkout */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-gray-600">Selected plan with add-ons</p>
          </div>
          <div className="text-3xl font-bold">${calculateTotal()}</div>
        </div>
        
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            Your payment is secure. We use industry-standard encryption to protect your information.
          </div>
        </div>
        
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 flex items-center justify-center gap-2"
          onClick={handleSubmitPayment}
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

export default SMSFPaymentPage;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button } from "../components/ui/button";
// import { getSMSFPricingPlans, getSMSFAdditionalServices, completeFormSubmission } from '../services/tax-form-service';
// import { Card } from "../components/ui/card";
// import { Checkbox } from "../components/ui/checkbox";
// import { toast } from "sonner";

// interface AdditionalService {
//   id: string;
//   name: string;
//   price: number;
// }

// interface PricingPlan {
//     name: string;
//     price: number;
//     features: string[];
// }
  
// interface PricingPlans {
//     essential: PricingPlan;
//     premium: PricingPlan;
// }

// const SMSFPaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [selectedPlan, setSelectedPlan] = useState<'essential' | 'premium'>('essential');
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const formData = location.state?.formData;
//   const pricingPlans: PricingPlans = getSMSFPricingPlans();
//   const additionalServices: AdditionalService[] = getSMSFAdditionalServices();

//   useEffect(() => {
//     if (!formData) {
//       navigate('/tax-solutions');
//       return;
//     }
//     calculateTotal();
//   }, [selectedPlan, selectedAddOns, formData]);

//   const calculateTotal = () => {
//     let total = pricingPlans[selectedPlan].price;
//     selectedAddOns.forEach(addonId => {
//     const addon = additionalServices.find((service: AdditionalService) => service.id === addonId);
//         if (addon) {
//         total += addon.price;
//       }
//     });
//     setTotalAmount(total);
//   };

//   const handlePlanSelection = (plan: 'essential' | 'premium') => {
//     setSelectedPlan(plan);
//   };

//   const handleAddonToggle = (addonId: string) => {
//     setSelectedAddOns(prev => {
//       if (prev.includes(addonId)) {
//         return prev.filter(id => id !== addonId);
//       }
//       return [...prev, addonId];
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const submissionData = {
//         ...formData,
//         selectedPlan,
//         selectedAddOns,
//         totalAmount,
//         paymentStatus: 'pending'
//       };

//       const response = await completeFormSubmission(submissionData);
      
//       if (response.success) {
//         toast.success("Form submitted successfully!");
//         navigate('/submission-success');
//       } else {
//         toast.error("Failed to submit form. Please try again.");
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">SMSF Service Plans</h1>
      
//       <div className="grid md:grid-cols-2 gap-8 mb-8">
//         {/* Essential Plan */}
//         <Card className={`p-6 ${selectedPlan === 'essential' ? 'border-2 border-primary' : ''}`}>
//           <h2 className="text-2xl font-semibold mb-4">{pricingPlans.essential.name}</h2>
//           <p className="text-3xl font-bold mb-4">${pricingPlans.essential.price}</p>
//           <ul className="list-disc pl-6 mb-6">
//             {pricingPlans.essential.features.map((feature: string, index: number) => (
//               <li key={index} className="mb-2">{feature}</li>
//             ))}
//           </ul>
//           <Button 
//             onClick={() => handlePlanSelection('essential')}
//             variant={selectedPlan === 'essential' ? 'default' : 'outline'}
//             className="w-full"
//           >
//             {selectedPlan === 'essential' ? 'Selected' : 'Select Essential Plan'}
//           </Button>
//         </Card>

//         {/* Premium Plan */}
//         <Card className={`p-6 ${selectedPlan === 'premium' ? 'border-2 border-primary' : ''}`}>
//           <h2 className="text-2xl font-semibold mb-4">{pricingPlans.premium.name}</h2>
//           <p className="text-3xl font-bold mb-4">${pricingPlans.premium.price}</p>
//           <ul className="list-disc pl-6 mb-6">
//             {pricingPlans.premium.features.map((feature: string, index: number) => (
//               <li key={index} className="mb-2">{feature}</li>
//             ))}
//           </ul>
//           <Button 
//             onClick={() => handlePlanSelection('premium')}
//             variant={selectedPlan === 'premium' ? 'default' : 'outline'}
//             className="w-full"
//           >
//             {selectedPlan === 'premium' ? 'Selected' : 'Select Premium Plan'}
//           </Button>
//         </Card>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Additional Services</h2>
//         <div className="grid md:grid-cols-2 gap-4">
//           {additionalServices.map((service: AdditionalService) => (
//             <div key={service.id} className="flex items-center space-x-4">
//               <Checkbox 
//                 id={service.id}
//                 checked={selectedAddOns.includes(service.id)}
//                 onCheckedChange={() => handleAddonToggle(service.id)}
//               />
//               <label htmlFor={service.id} className="flex-1">
//                 {service.name} - ${service.price}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-gray-100 p-6 rounded-lg mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Summary</h2>
//         <div className="flex justify-between mb-2">
//           <span>Base Plan ({selectedPlan})</span>
//           <span>${pricingPlans[selectedPlan].price}</span>
//         </div>
//         {selectedAddOns.map(addonId => {
//           const addon = additionalServices.find((service: AdditionalService) => service.id === addonId);
//           return addon ? (
//             <div key={addon.id} className="flex justify-between mb-2">
//               <span>{addon.name}</span>
//               <span>${addon.price}</span>
//             </div>
//           ) : null;
//         })}
//         <div className="border-t pt-4 mt-4">
//           <div className="flex justify-between font-bold">
//             <span>Total Amount</span>
//             <span>${totalAmount}</span>
//           </div>
//         </div>
//       </div>

//       <Button onClick={handleSubmit} className="w-full">
//         Proceed to Payment
//       </Button>
//     </div>
//   );
// };

// export default SMSFPaymentPage;

