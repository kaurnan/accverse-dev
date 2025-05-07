import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import apiClient from '../services/api';

const SMSFEstablishmentPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'individual' | 'corporate'>('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    } else {
      toast({
        title: "No form data found",
        description: "Please complete the SMSF establishment form first.",
        variant: "destructive",
      });
      navigate("/tax-solutions/smsf-establishment");
    }
  }, [location.state, toast, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const getPrice = () => {
    return selectedType === 'individual' ? 450 : 1400;
  };

  const handlePayment = async () => {
    if (!formData) return;
    setIsSubmitting(true);

    const paymentInfo = {
      trusteeType: selectedType,
      basePrice: getPrice(),
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString(),
    };

    const finalSubmission = {
      ...formData,
      payment: paymentInfo,
    };

    try {
      const res = await apiClient.post("/tax-solutions/smsf-establishment-complete-submission", finalSubmission);

      if (res.status === 200) {
        toast({
          title: "Payment successful!",
          description: "Your SMSF establishment form has been submitted.",
          variant: "default",
        });
        navigate("/tax-forms", {
          state: {
            submissionComplete: true,
            message: "Your SMSF establishment form and payment have been processed successfully.",
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
    <div className="container my-12 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link to="/tax-forms">
          <Button variant="outline" className="mb-4 flex items-center gap-2 border-purple-200 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </Button>
        </Link>
        
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            SMSF Establishment Payment
          </h1>
          <p className="text-gray-600">Select your trustee type and proceed with payment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Individual Trustee Option */}
          <Card 
            className={`flex flex-col cursor-pointer transition-all ${
              selectedType === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedType('individual')}
          >
            <CardHeader>
              <CardTitle>Individual Trustee</CardTitle>
              <CardDescription>Setup SMSF with Individual Trustees</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">$450</div>
              <ul className="space-y-2">
                {['Individual Trustee Setup', 'SMSF Establishment', 'ABN & TFN Registration'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${selectedType === 'individual' ? 'bg-blue-600' : ''}`}
                variant={selectedType === 'individual' ? 'default' : 'outline'}
              >
                Select Individual Trustee
              </Button>
            </CardFooter>
          </Card>

          {/* Corporate Trustee Option */}
          <Card 
            className={`flex flex-col cursor-pointer transition-all ${
              selectedType === 'corporate' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedType('corporate')}
          >
            <CardHeader>
              <CardTitle>Corporate Trustee</CardTitle>
              <CardDescription>Setup SMSF with a Corporate Trustee</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">$1,400</div>
              <ul className="space-y-2">
                {[
                  'Corporate Trustee Setup',
                  'SMSF Establishment',
                  'ABN & TFN Registration',
                  'Company Registration'
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${selectedType === 'corporate' ? 'bg-blue-600' : ''}`}
                variant={selectedType === 'corporate' ? 'default' : 'outline'}
              >
                Select Corporate Trustee
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Total</h3>
              <p className="text-gray-600">
                Selected option: {selectedType === 'individual' ? 'Individual Trustee' : 'Corporate Trustee'}
              </p>
            </div>
            <div className="text-3xl font-bold">${getPrice()}</div>
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
    </div>
  );
};

export default SMSFEstablishmentPaymentPage; 