
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import FormStep1 from './tax-form/FormStep1';
import FormStep2 from './tax-form/FormStep2';
import FormStep3 from './tax-form/FormStep3';
import FormStep4 from './tax-form/FormStep4';
import FormStep5 from './tax-form/FormStep5';
import apiClient from '../services/api';
import * as validation from '../utils/form-validation';
import { Shield, Check, AlertCircle } from 'lucide-react';

// Define the form data interface
interface FormData {
  // Part 1: Personal Details
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
  tfn: string;
  abn: string;
  gstRequired: string;
  otherServices: string;
  fiscalYear: string;
  bankBsb: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  updateAtoDetails: string;
  identification: File | null;

  // Part 2: Tax Residency & Offsets
  citizenStatus: string;
  spouse: string;
  dependents: string;
  medicare: string;
  privateHealth: string;
  hecsDebt: string;
  privateHealthFile: File | null;

  // Part 3: Taxable Income
  salary: string;
  interest: string;
  dividends: string;
  partnership: string;
  personalServiceIncome: string;
  soleTraderIncome: string;
  soldInvestments: string;
  soldRental: string;
  foreignIncome: string;
  rentalIncome: string;
  sharingEconomyIncome: string;
  pensionIncome: string;
  employeeShareScheme: string;
  otherIncome: string;

  // Part 4: Expenses
  carExpense: string;
  uniformExpense: string;
  travelExpense: string;
  educationExpense: string;
  phoneExpense: string;
  toolsExpense: string;
  otherWorkExpenses: string;
  incomeProtectionInsurance: string;
  donations: string;
  taxAgentFees: string;
  superContribution: string;
  interestExpense: string;
  workFromHome: string;
  
  // Part 5: Declaration
  signature: string;
  supportingDocs: File | null;
  
  [key: string]: string | string[] | boolean | File | null;
}

const TaxSolutionsForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Part 1: Personal Details
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
    tfn: '',
    abn: '',
    gstRequired: '',
    otherServices: '',
    fiscalYear: '',
    bankBsb: '',
    bankAccountNo: '',
    bankAccountName: '',
    bankName: '',
    updateAtoDetails: '',
    identification: null,

    // Part 2: Tax Residency & Offsets
    citizenStatus: '',
    spouse: '',
    dependents: '',
    medicare: '',
    privateHealth: '',
    hecsDebt: '',
    privateHealthFile: null,

    // Part 3: Taxable Income
    salary: '',
    interest: '',
    dividends: '',
    partnership: '',
    personalServiceIncome: '',
    soleTraderIncome: '',
    soldInvestments: '',
    soldRental: '',
    foreignIncome: '',
    rentalIncome: '',
    sharingEconomyIncome: '',
    pensionIncome: '',
    employeeShareScheme: '',
    otherIncome: '',

    // Part 4: Expenses
    carExpense: '',
    uniformExpense: '',
    travelExpense: '',
    educationExpense: '',
    phoneExpense: '',
    toolsExpense: '',
    otherWorkExpenses: '',
    incomeProtectionInsurance: '',
    donations: '',
    taxAgentFees: '',
    superContribution: '',
    interestExpense: '',
    workFromHome: '',
    
    // Part 5: Declaration
    signature: '',
    supportingDocs: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        // Validate personal details
        if (!formData.firstName) {
          newErrors.firstName = 'First name is required';
          isValid = false;
        }
        if (!formData.lastName) {
          newErrors.lastName = 'Last name is required';
          isValid = false;
        }
        if (!formData.email) {
          newErrors.email = 'Email is required';
          isValid = false;
        } else if (!validation.validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
          isValid = false;
        }
        if (!formData.mobile) {
          newErrors.mobile = 'Mobile number is required';
          isValid = false;
        } else if (!validation.validatePhone(formData.mobile)) {
          newErrors.mobile = 'Please enter a valid Australian mobile number';
          isValid = false;
        }
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required';
          isValid = false;
        } else if (validation.isFutureDate(formData.dateOfBirth)) {
          newErrors.dateOfBirth = 'Date of birth cannot be in the future';
          isValid = false;
        }
        if (!formData.address) {
          newErrors.address = 'Address is required';
          isValid = false;
        }
        if (!formData.suburb) {
          newErrors.suburb = 'Suburb is required';
          isValid = false;
        }
        if (!formData.state) {
          newErrors.state = 'State is required';
          isValid = false;
        }
        if (!formData.postcode) {
          newErrors.postcode = 'Postcode is required';
          isValid = false;
        } else if (!validation.validatePostcode(formData.postcode)) {
          newErrors.postcode = 'Please enter a valid Australian postcode';
          isValid = false;
        }
        if (formData.taxpayerType === 'soleTrader' && !formData.abn) {
          newErrors.abn = 'ABN is required for Sole Traders';
          isValid = false;
        }
        break;

      case 5:
        // Validate declaration
        if (!formData.signature) {
          newErrors.signature = 'Signature is required';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        // Save progress to backend
        if (formData.email) {
          handleSaveProgress();
        }
      }
    } else {
      toast.error("Please correct the errors before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name] === 'yes' ? 'no' : 'yes'
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: e.target.files ? e.target.files[0] : null
      }));
      console.log(`File selected for ${fieldName}:`, e.target.files[0]);
      
      // Clear error when field is changed
      if (errors[fieldName]) {
        setErrors(prev => {
          const updated = { ...prev };
          delete updated[fieldName];
          return updated;
        });
      }
    }
  };

  const handleSaveProgress = async () => {
    try {
      setSaveSuccess(false);
      // Create a JSON representation of the form data (without files)
      const formDataForSaving = { ...formData };
      
      // Remove file objects which can't be stringified
      Object.keys(formDataForSaving).forEach(key => {
        if (formDataForSaving[key] instanceof File) {
          formDataForSaving[key] = null;
        }
      });
      
      // Add saved form ID if available
      if (savedFormId) {
        formDataForSaving.id = savedFormId;
      }

      // Send save request to backend
      const response = await apiClient.post('/tax-solutions/save-progress', formDataForSaving);
      
      if (response.data && response.data.id) {
        setSavedFormId(response.data.id);
        setSaveSuccess(true);
        toast.success('Progress saved successfully! You can resume later.');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check
    if (!validateCurrentStep()) {
      toast.error('Please correct the errors before submitting');
      return;
    }
    
    setSubmitting(true);

    try {
      // Create a FormData object to handle file uploads
      const submissionData = new FormData();
      
      // Add all form fields to the FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          console.log(`Appending file for ${key}:`, value);
          submissionData.append(key, value);
        } else if (value !== null && value !== undefined) {
          submissionData.append(key, value.toString());
        }
      });
      
      console.log('About to submit form data:');
      
      // Send data to backend API
      const response = await apiClient.post('/tax-solutions/submit', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Form submission response:', response.data);
      
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <span>Tax form submitted successfully!</span>
        </div>, 
        {
          autoClose: 5000,
          style: { background: '#f0fdf4', borderLeft: '4px solid #22c55e' }
        }
      );
      
      // Reset form after successful submission
      setFormData({
        // Reset to initial state
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
        tfn: '',
        abn: '',
        gstRequired: '',
        otherServices: '',
        fiscalYear: '',
        bankBsb: '',
        bankAccountNo: '',
        bankAccountName: '',
        bankName: '',
        updateAtoDetails: '',
        identification: null,
    
        // Part 2: Tax Residency & Offsets
        citizenStatus: '',
        spouse: '',
        dependents: '',
        medicare: '',
        privateHealth: '',
        hecsDebt: '',
        privateHealthFile: null,
    
        // Part 3: Taxable Income
        salary: '',
        interest: '',
        dividends: '',
        partnership: '',
        personalServiceIncome: '',
        soleTraderIncome: '',
        soldInvestments: '',
        soldRental: '',
        foreignIncome: '',
        rentalIncome: '',
        sharingEconomyIncome: '',
        pensionIncome: '',
        employeeShareScheme: '',
        otherIncome: '',
    
        // Part 4: Expenses
        carExpense: '',
        uniformExpense: '',
        travelExpense: '',
        educationExpense: '',
        phoneExpense: '',
        toolsExpense: '',
        otherWorkExpenses: '',
        incomeProtectionInsurance: '',
        donations: '',
        taxAgentFees: '',
        superContribution: '',
        interestExpense: '',
        workFromHome: '',
        
        // Part 5: Declaration
        signature: '',
        supportingDocs: null
      });
      
      // Return to first step
      setCurrentStep(1);
      setSavedFormId(null);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Error submitting form. Please try again.</span>
        </div>,
        {
          autoClose: 5000,
          style: { background: '#fef2f2', borderLeft: '4px solid #ef4444' }
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Render the appropriate step component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1 
            formData={formData} 
            handleChange={handleChange} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange} 
          />
        );
      case 2:
        return (
          <FormStep2 
            formData={formData} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange} 
          />
        );
      case 3:
        return (
          <FormStep3 
            formData={formData} 
            handleRadioChange={handleRadioChange} 
          />
        );
      case 4:
        return (
          <FormStep4 
            formData={formData} 
            handleRadioChange={handleRadioChange}
          />
        );
      case 5:
        return (
          <FormStep5 
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-purple-700">Step {currentStep} of 5</h2>
            <p className="text-sm text-gray-500">Complete all steps to submit your tax information</p>
          </div>
          
          {currentStep < 5 && (
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={handleSaveProgress} 
                type="button"
                className="border-purple-300 hover:bg-purple-50 flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Save & Continue Later
              </Button>
              
              {saveSuccess && (
                <div className="absolute right-0 top-full mt-2 bg-green-50 text-green-700 text-sm p-2 rounded border border-green-200 flex items-center gap-1 z-10">
                  <Check className="h-4 w-4" />
                  Progress saved!
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${currentStep * 20}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderCurrentStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              type="button"
              className="border-purple-300 hover:bg-purple-50"
            >
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {currentStep < 5 && (
              <Button 
                onClick={handleNext}
                type="button"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
              </Button>
            )}
            
            {currentStep === 5 && (
              <Button 
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> 
                    Submit Form
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaxSolutionsForm;
