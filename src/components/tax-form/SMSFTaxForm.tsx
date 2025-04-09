
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import FormStep1SMSF from './smsf/FormStep1SMSF';
import FormStep2SMSF from './smsf/FormStep2SMSF';
import FormStep3SMSF from './smsf/FormStep3SMSF';
import FormStep4SMSF from './smsf/FormStep4SMSF';
import FormStep5SMSF from './smsf/FormStep5SMSF';
import apiClient from '../../services/api';
import { Check, AlertCircle, ArrowRight, ArrowLeft, Save } from 'lucide-react';

// Define the form data interface for SMSF
interface SMSFFormData {
  // Part 1: SMSF Details
  smsfName: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  postcode: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactMobile: string;
  contactEmail: string;
  trusteeType: string;
  financialYear: string;
  updateAtoDetails: string;
  bankBsb: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  electronicServiceAddress: string;

  // Part 2: Member Details
  memberCount: string;
  prevAccountantName: string;
  prevAccountantContact: string;
  prevAccountantPhone: string;
  prevAccountantMobile: string;
  prevAccountantEmail: string;
  lastFinancialStatements: File | null;
  lastTaxReturn: File | null;

  // Part 3: Fund Records
  trustDeeds: File | null;
  originalFundRecords: File | null;
  memberApplication: File | null;
  trusteeConsent: File | null;
  fundInvestmentStrategy: File | null;
  rolloverStatements: File | null;

  // Part 3: Assets Details
  bankAccountCount: string;
  termDeposits: string;
  shares: string;
  shareRegistryCount: string;
  srn: string;
  unlistedShares: string;
  unlistedShareCertificate: string;
  unlistedShareFinancials: string;
  property: string;
  propertyLoanAgreement: string;
  propertyLoanStatements: string;
  propertyTitleDeed: string;
  propertySettlementStatement: string;
  propertyLeaseAgreement: string;
  propertyInsurancePolicy: string;
  propertyContractOfSale: string;
  propertyDeclarationOfCustody: string;
  preciousMetals: string;
  preciousMetalsPurchase: string;
  preciousMetalsStatements: string;
  preciousMetalsStorage: string;
  preciousMetalsInsurance: string;
  preciousMetalsBullions: string;
  preciousMetalsPhotos: string;
  cryptoCurrency: string;
  cryptoStatements: string;
  cryptoTrading: string;

  // Part 4: Income and Expense Details
  capitalGains: string;
  propertyCapitalGains: string;
  rentalIncome: string;
  trustDistribution: string;
  partnershipDistribution: string;
  dividendIncome: string;
  investmentExpenses: string;
  managementExpenses: string;
  expenseInvoices: File | null;

  // Part 5: Declaration
  signature: string;
  declarationAccepted: string;

  // Other
  formType: string;
  
  [key: string]: string | File | null;
}

const SMSFTaxForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SMSFFormData>({
    // Part 1: SMSF Details
    smsfName: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    postcode: '',
    contactName: '',
    contactPosition: '',
    contactPhone: '',
    contactMobile: '',
    contactEmail: '',
    trusteeType: '',
    financialYear: '',
    updateAtoDetails: '',
    bankBsb: '',
    bankAccountNo: '',
    bankAccountName: '',
    bankName: '',
    electronicServiceAddress: '',

    // Part 2: Member Details
    memberCount: '',
    prevAccountantName: '',
    prevAccountantContact: '',
    prevAccountantPhone: '',
    prevAccountantMobile: '',
    prevAccountantEmail: '',
    lastFinancialStatements: null,
    lastTaxReturn: null,

    // Part 3: Fund Records
    trustDeeds: null,
    originalFundRecords: null,
    memberApplication: null,
    trusteeConsent: null,
    fundInvestmentStrategy: null,
    rolloverStatements: null,

    // Part 3: Assets Details
    bankAccountCount: '',
    termDeposits: '',
    shares: '',
    shareRegistryCount: '',
    srn: '',
    unlistedShares: '',
    unlistedShareCertificate: '',
    unlistedShareFinancials: '',
    property: '',
    propertyLoanAgreement: '',
    propertyLoanStatements: '',
    propertyTitleDeed: '',
    propertySettlementStatement: '',
    propertyLeaseAgreement: '',
    propertyInsurancePolicy: '',
    propertyContractOfSale: '',
    propertyDeclarationOfCustody: '',
    preciousMetals: '',
    preciousMetalsPurchase: '',
    preciousMetalsStatements: '',
    preciousMetalsStorage: '',
    preciousMetalsInsurance: '',
    preciousMetalsBullions: '',
    preciousMetalsPhotos: '',
    cryptoCurrency: '',
    cryptoStatements: '',
    cryptoTrading: '',

    // Part 4: Income and Expense Details
    capitalGains: '',
    propertyCapitalGains: '',
    rentalIncome: '',
    trustDistribution: '',
    partnershipDistribution: '',
    dividendIncome: '',
    investmentExpenses: '',
    managementExpenses: '',
    expenseInvoices: null,

  // Part 5: Declaration
  signature: '',
  declarationAccepted: '',
    
    // Other
    formType: 'smsf'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        // Validate SMSF Details
        if (!formData.smsfName) {
          newErrors.smsfName = 'SMSF name is required';
          isValid = false;
        }
        if (!formData.streetAddress) {
          newErrors.streetAddress = 'Address is required';
          isValid = false;
        }
        if (!formData.city) {
          newErrors.city = 'City is required';
          isValid = false;
        }
        if (!formData.state) {
          newErrors.state = 'State is required';
          isValid = false;
        }
        if (!formData.postcode) {
          newErrors.postcode = 'Postcode is required';
          isValid = false;
        }
        if (!formData.contactName) {
          newErrors.contactName = 'Contact name is required';
          isValid = false;
        }
        if (!formData.contactEmail) {
          newErrors.contactEmail = 'Contact email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          newErrors.contactEmail = 'Please enter a valid email address';
          isValid = false;
        }
        if (!formData.contactPhone && !formData.contactMobile) {
          newErrors.contactPhone = 'At least one contact number is required';
          isValid = false;
        }
        break;
        
      case 2:
        // Validate Member Details
        if (!formData.memberCount) {
          newErrors.memberCount = 'Please select the number of members';
          isValid = false;
        }
        break;

      case 5:
        // Validate Declaration
        if (!formData.signature) {
          newErrors.signature = 'Signature is required';
          isValid = false;
        }
        if (!formData.declarationAccepted || formData.declarationAccepted !== 'yes') {
          newErrors.declarationAccepted = 'You must agree to the declaration';
          isValid = false;
        }
        break;

      default:
        // No specific validations for other steps
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const scrollToFirstError = () => {
    setTimeout(() => {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        // Save progress to backend
        if (formData.contactEmail) {
          handleSaveProgress();
        }
      }
    } else {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Please correct the errors before proceeding.</span>
        </div>,
        {
          autoClose: 5000,
          style: { background: '#fef2f2', borderLeft: '4px solid #ef4444' }
        }
      );
      scrollToFirstError();
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
      setSaveError(false);
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
      console.log('Saving form progress...');
      const response = await apiClient.post('/tax-solutions/save-progress', formDataForSaving);
      
      if (response.data && response.data.id) {
        setSavedFormId(response.data.id);
        setSaveSuccess(true);
        toast.success(
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>Progress saved successfully!</span>
          </div>,
          {
            autoClose: 3000,
            style: { background: '#f0fdf4', borderLeft: '4px solid #22c55e' }
          }
        );
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error saving progress:', error);
      setSaveError(true);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Failed to save progress</span>
        </div>,
        {
          autoClose: 5000,
          style: { background: '#fef2f2', borderLeft: '4px solid #ef4444' }
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validation
      if (!validateCurrentStep()) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        scrollToFirstError();
        return;
      }

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
      
      console.log('About to submit SMSF form data');
      
      // Send data to backend API
      const response = await apiClient.post('/tax-solutions/submit', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('SMSF form submission response:', response.data);
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <span>SMSF tax form submitted successfully! We will contact you soon.</span>
        </div>,
        {
          autoClose: 5000,
          style: { background: '#f0fdf4', borderLeft: '4px solid #22c55e' }
        }
      );
      
      // Reset form after successful submission
      setFormData({
        // Reset to initial state
        smsfName: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        postcode: '',
        contactName: '',
        contactPosition: '',
        contactPhone: '',
        contactMobile: '',
        contactEmail: '',
        trusteeType: '',
        financialYear: '',
        updateAtoDetails: '',
        bankBsb: '',
        bankAccountNo: '',
        bankAccountName: '',
        bankName: '',
        electronicServiceAddress: '',
        memberCount: '',
        prevAccountantName: '',
        prevAccountantContact: '',
        prevAccountantPhone: '',
        prevAccountantMobile: '',
        prevAccountantEmail: '',
        lastFinancialStatements: null,
        lastTaxReturn: null,
        trustDeeds: null,
        originalFundRecords: null,
        memberApplication: null,
        trusteeConsent: null,
        fundInvestmentStrategy: null,
        rolloverStatements: null,
        bankAccountCount: '',
        termDeposits: '',
        shares: '',
        shareRegistryCount: '',
        srn: '',
        unlistedShares: '',
        unlistedShareCertificate: '',
        unlistedShareFinancials: '',
        property: '',
        propertyLoanAgreement: '',
        propertyLoanStatements: '',
        propertyTitleDeed: '',
        propertySettlementStatement: '',
        propertyLeaseAgreement: '',
        propertyInsurancePolicy: '',
        propertyContractOfSale: '',
        propertyDeclarationOfCustody: '',
        preciousMetals: '',
        preciousMetalsPurchase: '',
        preciousMetalsStatements: '',
        preciousMetalsStorage: '',
        preciousMetalsInsurance: '',
        preciousMetalsBullions: '',
        preciousMetalsPhotos: '',
        cryptoCurrency: '',
        cryptoStatements: '',
        cryptoTrading: '',
        capitalGains: '',
        propertyCapitalGains: '',
        rentalIncome: '',
        trustDistribution: '',
        partnershipDistribution: '',
        dividendIncome: '',
        investmentExpenses: '',
        managementExpenses: '',
        expenseInvoices: null,
        signature: '',
        declarationAccepted: '',
        formType: 'smsf'
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
          <FormStep1SMSF 
            formData={formData} 
            handleChange={handleChange} 
            handleRadioChange={handleRadioChange}
            errors={errors} 
          />
        );
      case 2:
        return (
          <FormStep2SMSF 
            formData={formData} 
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <FormStep3SMSF 
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <FormStep4SMSF 
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <FormStep5SMSF 
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" ref={formRef}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Step {currentStep} of 5</h2>
            <p className="text-sm text-gray-500">Complete all steps to submit your SMSF information</p>
          </div>
          
          {currentStep < 5 && (
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={handleSaveProgress} 
                type="button"
                className="border-blue-300 hover:bg-blue-50 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save & Continue Later
              </Button>
              
              {saveSuccess && (
                <div className="absolute right-0 top-full mt-2 bg-green-50 text-green-700 text-sm p-2 rounded border border-green-200 flex items-center gap-1 z-10">
                  <Check className="h-4 w-4" />
                  Progress saved!
                </div>
              )}
              
              {saveError && (
                <div className="absolute right-0 top-full mt-2 bg-red-50 text-red-700 text-sm p-2 rounded border border-red-200 flex items-center gap-1 z-10">
                  <AlertCircle className="h-4 w-4" />
                  Save failed. Try again.
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
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
              className="border-blue-300 hover:bg-blue-50 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {currentStep < 5 && (
              <Button 
                onClick={handleNext}
                type="button"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
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

export default SMSFTaxForm;
