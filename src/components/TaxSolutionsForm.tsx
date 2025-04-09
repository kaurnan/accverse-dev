import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { scrollToElement } from '../lib/utils';

// Import form step components
import FormStep1 from './tax-form/FormStep1';
import FormStep2 from './tax-form/FormStep2';
import FormStep3 from './tax-form/FormStep3';
import FormStep4 from './tax-form/FormStep4';
import FormStep5 from './tax-form/FormStep5';

interface TaxSolutionsFormProps {
  onSubmit?: (data: any) => void;
}

interface FormDataType {
  [key: string]: string | File | null;
  taxpayerType: string;
  prefix: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: string;
  mobile: string;
  email: string;
  address: string;
  address2: string;
  suburb: string;
  state: string;
  postcode: string;
  taxFileNumber: string;
  signature: string;
}

const TaxSolutionsForm: React.FC<TaxSolutionsFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    taxpayerType: '',
    prefix: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    maritalStatus: '',
    mobile: '',
    email: '',
    address: '',
    address2: '',
    suburb: '',
    state: '',
    postcode: '',
    taxFileNumber: '',
    signature: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 5;

  // Load form data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('taxFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // File objects can't be serialized, so we handle them separately
        setFormData(prevData => ({ ...prevData, ...parsedData }));
        
        // Also try to restore the current step
        const savedStep = localStorage.getItem('taxFormStep');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
        
        toast({
          title: "Form data loaded",
          description: "Your previously saved progress has been restored.",
          variant: "default",
        });
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fieldName]: file }));
    
    // Clear validation error for this field if it exists
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      // Basic validation for Step 1
      if (!formData.taxpayerType) newErrors.taxpayerType = "Please select a taxpayer type";
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.suburb) newErrors.suburb = "Suburb is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.postcode) newErrors.postcode = "Postcode is required";
      if (!formData.taxFileNumber) newErrors.taxFileNumber = "Tax File Number is required";
    }
    else if (step === 2) {
      // Basic validation for Step 2
      if (!formData.citizenStatus) newErrors.citizenStatus = "Please select your citizen status";
      if (!formData.spouse) newErrors.spouse = "Please indicate if you have a spouse";
      if (!formData.dependents) newErrors.dependents = "Please indicate if you have dependents";
      if (!formData.medicare) newErrors.medicare = "Please indicate if you have Medicare";
      if (!formData.privateHealth) newErrors.privateHealth = "Please indicate if you have private health insurance";
      if (formData.privateHealth === 'yes' && !formData.privateHealthFile) {
        newErrors.privateHealthFile = "Please upload your private health insurance statement";
      }
      if (!formData.hecsDebt) newErrors.hecsDebt = "Please indicate if you have HECS/HELP debt";
    }
    else if (step === 3) {
      // Basic validation for Step 3
      if (!formData.salary) newErrors.salary = "Please answer this question";
      if (!formData.interest) newErrors.interest = "Please answer this question";
      if (!formData.dividends) newErrors.dividends = "Please answer this question";
      if (!formData.partnership) newErrors.partnership = "Please answer this question";
      if (!formData.personalServiceIncome) newErrors.personalServiceIncome = "Please answer this question";
      if (!formData.soleTraderIncome) newErrors.soleTraderIncome = "Please answer this question";
      if (!formData.soldInvestments) newErrors.soldInvestments = "Please answer this question";
      if (!formData.soldRental) newErrors.soldRental = "Please answer this question";
      if (!formData.foreignIncome) newErrors.foreignIncome = "Please answer this question";
      if (!formData.rentalIncome) newErrors.rentalIncome = "Please answer this question";
      if (!formData.sharingEconomyIncome) newErrors.sharingEconomyIncome = "Please answer this question";
      if (!formData.pensionIncome) newErrors.pensionIncome = "Please answer this question";
      if (!formData.employeeShareScheme) newErrors.employeeShareScheme = "Please answer this question";
      if (!formData.otherIncome) newErrors.otherIncome = "Please answer this question";
    }
    else if (step === 4) {
      // Basic validation for Step 4
      if (!formData.carExpense) newErrors.carExpense = "Please answer this question";
      if (!formData.uniformExpense) newErrors.uniformExpense = "Please answer this question";
      if (!formData.travelExpense) newErrors.travelExpense = "Please answer this question";
      if (!formData.educationExpense) newErrors.educationExpense = "Please answer this question";
      if (!formData.phoneExpense) newErrors.phoneExpense = "Please answer this question";
      if (!formData.toolsExpense) newErrors.toolsExpense = "Please answer this question";
      if (!formData.otherWorkExpenses) newErrors.otherWorkExpenses = "Please answer this question";
      if (!formData.incomeProtectionInsurance) newErrors.incomeProtectionInsurance = "Please answer this question";
      if (!formData.donations) newErrors.donations = "Please answer this question";
      if (!formData.taxAgentFees) newErrors.taxAgentFees = "Please answer this question";
      if (!formData.superContribution) newErrors.superContribution = "Please answer this question";
      if (!formData.interestExpense) newErrors.interestExpense = "Please answer this question";
      if (!formData.workFromHome) newErrors.workFromHome = "Please answer this question";
    }
    else if (step === 5) {
      // Basic validation for Step 5
      if (!formData.declarationAccepted || formData.declarationAccepted !== 'yes') {
        newErrors.declarationAccepted = "You must accept the declaration to proceed";
      }
      if (!formData.signature) newErrors.signature = "Please sign the form";
    }
    
    setErrors(newErrors);
    
    // If errors exist, scroll to the first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        scrollToElement(element);
      }
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        
        // Save current step to localStorage
        localStorage.setItem('taxFormStep', (currentStep + 1).toString());
        
        // Also save form data
        const dataToSave = { ...formData };
        // Remove file objects before serializing
        Object.keys(dataToSave).forEach(key => {
          if (dataToSave[key] instanceof File) {
            delete dataToSave[key];
          }
        });
        localStorage.setItem('taxFormData', JSON.stringify(dataToSave));
      } else {
        toast({
          title: "Please correct the errors",
          description: "There are validation errors that need to be fixed before proceeding.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
      
      // Save current step to localStorage
      localStorage.setItem('taxFormStep', (currentStep - 1).toString());
    }
  };
  
  const handleSaveProgress = () => {
    try {
      // Save form data without file objects
      const dataToSave = { ...formData };
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] instanceof File) {
          delete dataToSave[key];
        }
      });
      
      localStorage.setItem('taxFormData', JSON.stringify(dataToSave));
      localStorage.setItem('taxFormStep', currentStep.toString());
      
      toast({
        title: "Progress saved",
        description: "You can return to complete the form later.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving form progress:", error);
      toast({
        title: "Failed to save progress",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast({
        title: "Form submitted successfully",
        description: "Thank you for your submission. We will process your information shortly.",
        variant: "success",
      });
      
      // Clear form data from localStorage after successful submission
      localStorage.removeItem('taxFormData');
      localStorage.removeItem('taxFormStep');
      
      // Reset form to first step
      setCurrentStep(1);
      setFormData({
        taxpayerType: '',
        prefix: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        maritalStatus: '',
        mobile: '',
        email: '',
        address: '',
        address2: '',
        suburb: '',
        state: '',
        postcode: '',
        taxFileNumber: '',
        signature: '',
      });
    } else {
      toast({
        title: "Please correct the errors",
        description: "There are validation errors that need to be fixed before submitting.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div 
              key={step} 
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step < currentStep 
                  ? 'bg-green-500 text-white border-green-500' 
                  : step === currentStep 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-400 border-gray-300'
              } transition-colors z-10`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span>{step}</span>
              )}
              {step !== totalSteps && (
                <div 
                  className={`absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1 text-sm">
          <div className="text-center w-20 -ml-5">Personal Info</div>
          <div className="text-center w-20 -ml-5">Tax Residency</div>
          <div className="text-center w-20 -ml-5">Income</div>
          <div className="text-center w-20 -ml-5">Expenses</div>
          <div className="text-center w-20 -ml-5">Declaration</div>
        </div>
      </div>
      
      {/* Form Steps */}
      <div className="mb-8">
        {currentStep === 1 && (
          <FormStep1 
            formData={formData} 
            handleChange={handleChange} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange}
            errors={errors}
          />
        )}
        
        {currentStep === 2 && (
          <FormStep2 
            formData={formData} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange}
            errors={errors}
          />
        )}
        
        {currentStep === 3 && (
          <FormStep3 
            formData={formData} 
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        )}
        
        {currentStep === 4 && (
          <FormStep4 
            formData={formData} 
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        )}
        
        {currentStep === 5 && (
          <FormStep5 
            formData={formData} 
            handleChange={handleChange} 
            handleFileChange={handleFileChange}
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pb-10">
        <Button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={handleSaveProgress}
            variant="secondary"
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-1" /> Save & Continue Later
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center bg-blue-600 hover:bg-blue-700"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              Submit <CheckCircle className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-red-700 font-medium">Please correct the following errors:</h3>
          </div>
          <ul className="list-disc pl-10 text-red-600">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field} className="text-sm">
                <button 
                  type="button"
                  className="text-left underline"
                  onClick={() => {
                    const element = document.getElementById(field);
                    if (element) scrollToElement(element);
                  }}
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaxSolutionsForm;
