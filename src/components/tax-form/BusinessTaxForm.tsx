import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import FormStep1Business from './business/FormStep1Business';
import FormStep2Business from './business/FormStep2Business';
import FormStep3Business from './business/FormStep3Business';
import FormStep4Business from './business/FormStep4Business';
import apiClient from '../../services/api';

// Define the form data interface for business
interface BusinessFormData {
  // Part 1: Business Details
  taxLodgement: string;
  entityType: string;
  entityName: string;
  abn: string;
  acn: string;
  tfn: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactMobile: string;
  contactPosition: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  postcode: string;
  gstRegistered: string;
  asicAgent: string;
  bankBsb: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  prevAccountantName: string;
  prevAccountantAddress: string;
  prevAccountantCity: string;
  prevAccountantState: string;
  prevAccountantPhone: string;
  financialYear: string;
  updateAtoDetails: string;
  entityDocument: File | null;
  ownerIdDocument: File | null;
  directorId: string;

  // Part 2: Income & Expenses
  accountingSoftware: string;
  motorVehicles: string;
  fbtRegistered: string;

  // Part 3: Payroll / Employees
  employeeCount: string;
  relatedEntityName: string;
  relatedEntitySoftware: string;
  relatedEntityTFN: string;
  relatedEntityABN: string;
  div7aLoans: string;
  trustType: string;

  // Part 4: Declaration
  signature: string;
  signature2: string;
  declarationAccepted: string;

  // Other
  formType: string;
  
  [key: string]: string | File | null;
}

const BusinessTaxForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    // Part 1: Business Details
    taxLodgement: '',
    entityType: '',
    entityName: '',
    abn: '',
    acn: '',
    tfn: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactMobile: '',
    contactPosition: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    postcode: '',
    gstRegistered: '',
    asicAgent: '',
    bankBsb: '',
    bankAccountNo: '',
    bankAccountName: '',
    bankName: '',
    prevAccountantName: '',
    prevAccountantAddress: '',
    prevAccountantCity: '',
    prevAccountantState: '',
    prevAccountantPhone: '',
    financialYear: '',
    updateAtoDetails: '',
    entityDocument: null,
    ownerIdDocument: null,
    directorId: '',

    // Part 2: Income & Expenses
    accountingSoftware: '',
    motorVehicles: '',
    fbtRegistered: '',

    // Part 3: Payroll / Employees
    employeeCount: '',
    relatedEntityName: '',
    relatedEntitySoftware: '',
    relatedEntityTFN: '',
    relatedEntityABN: '',
    div7aLoans: '',
    trustType: '',

    // Part 4: Declaration
    signature: '',
    signature2: '',
    declarationAccepted: '',

    // Other
    formType: 'business'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        // Validate Business Details
        if (!formData.entityName) {
          newErrors.entityName = 'Entity name is required';
          isValid = false;
        }
        if (!formData.contactName) {
          newErrors.contactName = 'Contact name is required';
          isValid = false;
        }
        if (!formData.contactEmail) {
          newErrors.contactEmail = 'Contact email is required';
          isValid = false;
        }
        if (!formData.contactPhone && !formData.contactMobile) {
          newErrors.contactPhone = 'At least one contact number is required';
          isValid = false;
        }
        if (!formData.streetAddress) {
          newErrors.streetAddress = 'Street address is required';
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
        break;
        
      case 4:
        // Validate Declaration and Banking
        if (!formData.bankBsb) {
          newErrors.bankBsb = 'BSB is required';
          isValid = false;
        }
        if (!formData.bankAccountNo) {
          newErrors.bankAccountNo = 'Account number is required';
          isValid = false;
        }
        if (!formData.bankAccountName) {
          newErrors.bankAccountName = 'Account name is required';
          isValid = false;
        }
        if (!formData.bankName) {
          newErrors.bankName = 'Bank name is required';
          isValid = false;
        }
        if (!formData.ownerIdDocument) {
          newErrors.ownerIdDocument = 'Owner ID document is required';
          isValid = false;
        }
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

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        // Save progress to backend
        if (formData.contactEmail) {
          handleSaveProgress();
        }
      }
    } else {
      toast.error("Please correct the errors before proceeding.");
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
        toast.success('Progress saved successfully!');
      }
      
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validation
      if (!formData.entityName || !formData.contactEmail || !formData.signature) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
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
      
      console.log('About to submit business form data');
      
      // Send data to backend API
      const response = await apiClient.post('/tax-solutions/submit', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Business form submission response:', response.data);
      toast.success('Business tax form submitted successfully! We will contact you soon.');
      
      // Reset form after successful submission
      setFormData({
        // Reset to initial state
        taxLodgement: '',
        entityType: '',
        entityName: '',
        abn: '',
        acn: '',
        tfn: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactMobile: '',
        contactPosition: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        postcode: '',
        gstRegistered: '',
        asicAgent: '',
        bankBsb: '',
        bankAccountNo: '',
        bankAccountName: '',
        bankName: '',
        prevAccountantName: '',
        prevAccountantAddress: '',
        prevAccountantCity: '',
        prevAccountantState: '',
        prevAccountantPhone: '',
        financialYear: '',
        updateAtoDetails: '',
        entityDocument: null,
        ownerIdDocument: null,
        directorId: '',
        accountingSoftware: '',
        motorVehicles: '',
        fbtRegistered: '',
        employeeCount: '',
        relatedEntityName: '',
        relatedEntitySoftware: '',
        relatedEntityTFN: '',
        relatedEntityABN: '',
        div7aLoans: '',
        trustType: '',
        signature: '',
        signature2: '',
        declarationAccepted: '',
        formType: 'business'
      });
      
      // Return to first step
      setCurrentStep(1);
      setSavedFormId(null);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render the appropriate step component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1Business 
            formData={formData} 
            handleChange={handleChange} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange} 
            errors={errors}
          />
        );
      case 2:
        return (
          <FormStep2Business 
            formData={formData} 
            handleChange={handleChange}
            handleRadioChange={handleRadioChange} 
            errors={errors}
          />
        );
      case 3:
        return (
          <FormStep3Business 
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <FormStep4Business 
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleRadioChange={handleRadioChange}
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
          <h2 className="text-xl font-bold text-gray-800">Step {currentStep} of 4</h2>
          {currentStep < 4 && (
            <Button variant="outline" onClick={handleSaveProgress} type="button">
              Save & Continue Later
            </Button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${currentStep * 25}%` }}
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
            >
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {currentStep < 4 && (
              <Button 
                onClick={handleNext}
                type="button"
              >
                Next
              </Button>
            )}
            
            {currentStep === 4 && (
              <Button 
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BusinessTaxForm;
