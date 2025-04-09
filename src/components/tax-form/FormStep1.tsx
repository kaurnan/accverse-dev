import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SecuredBankingSection } from '../ui/secured-banking-section';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FileUpload } from '../ui/file-upload';
import * as validation from '../../utils/form-validation';

interface FormStep1Props {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  errors: Record<string, string>;
}

const FormStep1: React.FC<FormStep1Props> = ({ 
  formData, 
  handleChange,
  handleRadioChange,
  handleFileChange,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  
  const markAsTouched = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const validateField = (name: string, value: string) => {
    return validation.validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    markAsTouched(name);
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
    
    handleChange(e);
  };

  const handleFileDrop = (file: File | null, fieldName: string) => {
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event, fieldName);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 1: Personal Information</h2>
        <p className="text-gray-600 mt-1">Please provide your personal details for tax purposes.</p>
      </div>
      
      <div className="space-y-6">
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="taxpayerType" className="block text-gray-700 font-medium">Taxpayer Type <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="Taxpayer Type Information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Select your taxpayer category for proper tax assessment.
              </div>
            </div>
          </div>
          <select
            id="taxpayerType"
            name="taxpayerType"
            value={formData.taxpayerType}
            onChange={handleChange}
            className={`w-full border ${errors.taxpayerType ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
          >
            <option value="">Select Type</option>
            <option value="individual">Individual</option>
            <option value="partnership">Partnership</option>
            <option value="company">Company</option>
            <option value="trust">Trust</option>
            <option value="smsf">Self-Managed Super Fund</option>
          </select>
          {errors.taxpayerType && <p className="mt-1 text-xs text-red-500">{errors.taxpayerType}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="prefix" className="block text-gray-700 font-medium">Title</Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Title Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your preferred title or honorific.
                </div>
              </div>
            </div>
            <select
              id="prefix"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              className={`w-full border ${errors.prefix ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            >
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
            {errors.prefix && <p className="mt-1 text-xs text-red-500">{errors.prefix}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="firstName" className="block text-gray-700 font-medium">First Name <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="First Name Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your legal first name as it appears on official documents.
                </div>
              </div>
            </div>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="lastName" className="block text-gray-700 font-medium">Last Name <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Last Name Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your legal last name as it appears on official documents.
                </div>
              </div>
            </div>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`${errors.lastName ? 'border-red-500' : ''}`}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="dateOfBirth" className="block text-gray-700 font-medium">Date of Birth <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Date of Birth Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your date of birth in DD/MM/YYYY format.
                </div>
              </div>
            </div>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`${errors.dateOfBirth ? 'border-red-500' : ''}`}
            />
            {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="maritalStatus" className="block text-gray-700 font-medium">Marital Status</Label>
            <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="Marital Status Information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Your current marital status for tax purposes.
              </div>
            </div>
          </div>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className={`w-full border ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="defacto">De Facto</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          {errors.maritalStatus && <p className="mt-1 text-xs text-red-500">{errors.maritalStatus}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="mobile" className="block text-gray-700 font-medium">Mobile Number <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Mobile Number Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your current mobile number for contact purposes.
                </div>
              </div>
            </div>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              className={`${errors.mobile ? 'border-red-500' : ''}`}
            />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="email" className="block text-gray-700 font-medium">Email <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Email Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your email address for correspondence and notifications.
                </div>
              </div>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="address" className="block text-gray-700 font-medium">Address Line 1 <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="Address Line 1 Information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Your street address including house/unit number.
              </div>
            </div>
          </div>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`${errors.address ? 'border-red-500' : ''}`}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="address2" className="block text-gray-700 font-medium">Address Line 2</Label>
            <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="Address Line 2 Information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Additional address information if needed.
              </div>
            </div>
          </div>
          <Input
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className={`${errors.address2 ? 'border-red-500' : ''}`}
          />
          {errors.address2 && <p className="mt-1 text-xs text-red-500">{errors.address2}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="suburb" className="block text-gray-700 font-medium">Suburb <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Suburb Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your city or suburb name.
                </div>
              </div>
            </div>
            <Input
              id="suburb"
              name="suburb"
              value={formData.suburb}
              onChange={handleChange}
              className={`${errors.suburb ? 'border-red-500' : ''}`}
            />
            {errors.suburb && <p className="mt-1 text-xs text-red-500">{errors.suburb}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="state" className="block text-gray-700 font-medium">State <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="State Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Select your state or territory.
                </div>
              </div>
            </div>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            >
              <option value="">Select State</option>
              <option value="ACT">Australian Capital Territory</option>
              <option value="NSW">New South Wales</option>
              <option value="NT">Northern Territory</option>
              <option value="QLD">Queensland</option>
              <option value="SA">South Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="VIC">Victoria</option>
              <option value="WA">Western Australia</option>
            </select>
            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label htmlFor="postcode" className="block text-gray-700 font-medium">Postcode <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                  type="button"
                  className="text-blue-500"
                  aria-label="Postcode Information"
                >
                  <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  Your 4-digit Australian postal code.
                </div>
              </div>
            </div>
            <Input
              id="postcode"
              name="postcode"
              type="text"
              value={formData.postcode}
              onChange={handleChange}
              className={`${errors.postcode ? 'border-red-500' : ''}`}
            />
            {errors.postcode && <p className="mt-1 text-xs text-red-500">{errors.postcode}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="taxFileNumber" className="block text-gray-700 font-medium">Tax File Number <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
                <button
                    type="button"
                    className="text-blue-500"
                    aria-label="TFN information">
                <Info size={16} />
                </button>
                <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    Your unique TFN assigned by the ATO. This is stored securely.
                </div>
              </div>
          </div>
          <Input
            id="taxFileNumber"
            name="taxFileNumber"
            type="text"
            value={formData.taxFileNumber}
            onChange={handleChange}
            className={`${errors.taxFileNumber ? 'border-red-500' : ''}`}
          />
          {errors.taxFileNumber && <p className="mt-1 text-xs text-red-500">{errors.taxFileNumber}</p>}
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
           <Label className="text-gray-800 font-semibold mb-1 block">
             Would you like to have GST services included?
             <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="GST information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                GST (Goods and Services Tax) is a 10% tax applied to most goods and services sold in Australia.
              </div>
            </div>
          </Label>
           <p className="text-sm text-gray-500 mb-3">Select Yes if you require our GST/BAS Lodgement services.</p>
           <RadioGroup 
            value={formData.gstRequired || ''} 
            onValueChange={(value: string) => handleRadioChange('gstRequired', value)}
            className="flex flex-row space-x-4 mt-2"
            error={touched.gstRequired ? errors.gstRequired : ""}
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="gstYes" />
              <Label htmlFor="gstYes" className="text-gray-700 cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="gstNo" />
              <Label htmlFor="gstNo" className="text-gray-700 cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="fiscalYear" className="flex items-center text-gray-700 mb-1">
            Fiscal Year Ended <span className="text-red-500">*</span>
            <div className="group relative ml-2">
              <button
                type="button"
                className="text-blue-500"
                aria-label="Fiscal Year information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                The fiscal year in Australia typically ends on June 30th.
              </div>
            </div>
          </Label>
          <Input 
            id="fiscalYear" 
            name="fiscalYear" 
            type="date"
            value={formData.fiscalYear || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Do not insert multiple years"
            error={touched.fiscalYear ? errors.fiscalYear : ""}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            required
          />
        </div>

        {/* Banking Details Section */}
        <SecuredBankingSection 
          formData={formData} 
          handleChange={handleInputChange}
          errors={errors}
        />

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Label className="text-gray-800 font-semibold mb-1 block">
            Would you authorise us to update your contact details with the ATO?
            <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="ATO information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                The ATO (Australian Taxation Office) is the government agency responsible for administering the tax system in Australia.
              </div>
            </div>
          </Label>
          <RadioGroup 
            value={formData.updateAtoDetails || ''} 
            onValueChange={(value: string) => handleRadioChange('updateAtoDetails', value)}
            className="flex flex-row space-x-4 mt-2"
            error={touched.updateAtoDetails ? errors.updateAtoDetails : ""}
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="updateAtoYes" />
              <Label htmlFor="updateAtoYes" className="text-gray-700 cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="updateAtoNo" />
              <Label htmlFor="updateAtoNo" className="text-gray-700 cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="idDocument" className="block text-gray-700 font-medium">ID Document <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button
                type="button"
                className="text-blue-500"
                aria-label="ID Document Information"
              >
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                Upload a scan of your driver's license, passport or other government ID for verification purposes.
              </div>
            </div>
          </div>
          <FileUpload
            id="idDocument"
            name="idDocument"
            value={formData.idDocument}
            onChange={(file) => handleFileDrop(file, 'idDocument')}
            accept=".pdf,.jpg,.jpeg,.png"
            tooltip="Upload a government-issued ID for verification purposes"
            error={errors.idDocument}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStep1;
