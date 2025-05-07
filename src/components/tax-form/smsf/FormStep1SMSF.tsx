
import React, { FC } from 'react';
import { Label } from '../../ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import BankingDetailsSection from '../BankingDetailsSection';
import { Input } from '../../ui/input';

interface FormStep1SMSFProps {
  formData: {
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
    confirmAccountNo?: string;
    electronicServiceAddress: string;
    [key: string]: string | undefined | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const FormStep1SMSF: React.FC<FormStep1SMSFProps> = ({ formData, handleChange, handleRadioChange, errors }) => {
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If the input is for postcode or phone numbers, only allow digits
    if (name === 'postcode') {
      const onlyDigits = value.replace(/[^\d]/g, '').substring(0, 4);
      const event = {
        ...e,
        target: {
          ...e.target,
          name,
          value: onlyDigits
        }
      };
      handleChange(event);
    } else if (name === 'contactPhone' || name === 'contactMobile') {
      const onlyDigits = value.replace(/[^\d]/g, '').substring(0, 10);
      const event = {
        ...e,
        target: {
          ...e.target,
          name,
          value: onlyDigits
        }
      };
      handleChange(event);
    } else {
      handleChange(e);
    }
  };
  
  // Handle limited text input
  const handleLimitedTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, maxLength } = e.target;
    const limit = maxLength || 100;
    
    const truncatedValue = value.substring(0, limit);
    const event = {
      ...e,
      target: {
        ...e.target,
        name,
        value: truncatedValue
      }
    };
    
    handleChange(event);
  };
  
  // Handle email input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const truncatedValue = value.substring(0, 100);
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name,
        value: truncatedValue
      }
    };
    
    handleChange(event);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 1: SMSF Details</h2>
        <p className="text-gray-600 mt-1">Please provide the basic information about your Self-Managed Superannuation Fund</p>
      </div>
      
      <div className="space-y-6">
        {/* SMSF Name */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="smsfName" className="block text-gray-700 font-medium">SMSF Name <span className="text-red-500">*</span></Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Enter the full legal name of your Self-Managed Superannuation Fund.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="text"
            id="smsfName"
            name="smsfName"
            value={formData.smsfName}
            onChange={handleLimitedTextChange}
            required
            maxLength={100}
            placeholder="e.g., Smith Family Superannuation Fund"
            error={errors.smsfName}
            className={`${errors.smsfName ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.smsfName ? "true" : "false"}
            aria-describedby={errors.smsfName ? "smsfName-error" : undefined}
          />
        </div>

        {/* SMSF Address */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">SMSF Address</h3>
          
          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="streetAddress" className="block text-gray-700 font-medium">Street Address <span className="text-red-500">*</span></Label>
            </div>
            <Input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleLimitedTextChange}
              required
              maxLength={100}
              placeholder="Street address"
              error={errors.streetAddress}
              className={`${errors.streetAddress ? 'border-red-500' : 'border-gray-300'}`}
              aria-invalid={errors.streetAddress ? "true" : "false"}
              aria-describedby={errors.streetAddress ? "streetAddress-error" : undefined}
            />
          </div>

          <div className="form-group mb-4">
            <Label htmlFor="streetAddress2" className="block text-gray-700 font-medium mb-2">Address Line 2</Label>
            <Input
              type="text"
              id="streetAddress2"
              name="streetAddress2"
              value={formData.streetAddress2}
              onChange={handleLimitedTextChange}
              maxLength={100}
              placeholder="Suite, apartment, unit, building, floor, etc. (optional)"
              error={errors.streetAddress2}
              className={`${errors.streetAddress2 ? 'border-red-500' : 'border-gray-300'}`}
              aria-invalid={errors.streetAddress2 ? "true" : "false"}
              aria-describedby={errors.streetAddress2 ? "streetAddress2-error" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="city" className="block text-gray-700 font-medium">City/Suburb <span className="text-red-500">*</span></Label>
              </div>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleLimitedTextChange}
                required
                maxLength={50}
                placeholder="City/Suburb"
                error={errors.city}
                className={`${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors.city ? "true" : "false"}
                aria-describedby={errors.city ? "city-error" : undefined}
              />
            </div>

            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="state" className="block text-gray-700 font-medium">State <span className="text-red-500">*</span></Label>
              </div>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`w-full h-10 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 bg-background`}
                aria-invalid={errors.state ? "true" : "false"}
                aria-describedby={errors.state ? "state-error" : undefined}
              >
                <option value="">Select State</option>
                <option value="ACT">ACT</option>
                <option value="NSW">NSW</option>
                <option value="NT">NT</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="VIC">VIC</option>
                <option value="WA">WA</option>
              </select>
              {errors.state && <p id="state-error" className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="postcode" className="block text-gray-700 font-medium">Postcode <span className="text-red-500">*</span></Label>
              </div>
              <Input
                type="text"
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleNumberInputChange}
                required
                maxLength={4}
                pattern="\d{4}"
                inputMode="numeric"
                placeholder="e.g., 2000"
                error={errors.postcode}
                className={`${errors.postcode ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors.postcode ? "true" : "false"}
                aria-describedby={errors.postcode ? "postcode-error" : undefined}
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Details</h3>
          
          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="contactName" className="block text-gray-700 font-medium">Contact Name <span className="text-red-500">*</span></Label>
            </div>
            <Input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleLimitedTextChange}
              required
              maxLength={100}
              placeholder="Full name"
              error={errors.contactName}
              className={`${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
              aria-invalid={errors.contactName ? "true" : "false"}
              aria-describedby={errors.contactName ? "contactName-error" : undefined}
            />
          </div>
          
          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="contactPosition" className="block text-gray-700 font-medium">Position</Label>
            </div>
            <Input
              type="text"
              id="contactPosition"
              name="contactPosition"
              value={formData.contactPosition}
              onChange={handleLimitedTextChange}
              maxLength={50}
              placeholder="e.g., Trustee"
              error={errors.contactPosition}
              className={`${errors.contactPosition ? 'border-red-500' : 'border-gray-300'}`}
              aria-invalid={errors.contactPosition ? "true" : "false"}
              aria-describedby={errors.contactPosition ? "contactPosition-error" : undefined}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="contactPhone" className="block text-gray-700 font-medium">Phone Number <span className="text-red-500">*</span></Label>
              </div>
              <Input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleNumberInputChange}
                required
                maxLength={10}
                pattern="[0-9]{10}"
                inputMode="tel"
                placeholder="0412345678"
                error={errors.contactPhone}
                className={`${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors.contactPhone ? "true" : "false"}
                aria-describedby={errors.contactPhone ? "contactPhone-error" : undefined}
              />
            </div>

            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="contactMobile" className="block text-gray-700 font-medium">Mobile Number</Label>
              </div>
              <Input
                type="tel"
                id="contactMobile"
                name="contactMobile"
                value={formData.contactMobile}
                onChange={handleNumberInputChange}
                maxLength={10}
                pattern="[0-9]{10}"
                inputMode="tel"
                placeholder="0412345678"
                error={errors.contactMobile}
                className={`${errors.contactMobile ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors.contactMobile ? "true" : "false"}
                aria-describedby={errors.contactMobile ? "contactMobile-error" : undefined}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="contactEmail" className="block text-gray-700 font-medium">Email Address <span className="text-red-500">*</span></Label>
            </div>
            <Input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleEmailChange}
              required
              maxLength={100}
              placeholder="email@example.com"
              error={errors.contactEmail}
              className={`${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
              aria-invalid={errors.contactEmail ? "true" : "false"}
              aria-describedby={errors.contactEmail ? "contactEmail-error" : undefined}
            />
          </div>
        </div>

        {/* Trustee Type */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="trusteeType" className="block text-gray-700 font-medium">Trustee Type <span className="text-red-500">*</span></Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select the type of trustee for your SMSF. This can be individual trustees or a corporate trustee.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className={`form-radio ${errors.trusteeType ? 'text-red-500' : 'text-blue-600'}`}
                name="trusteeType"
                checked={formData.trusteeType === 'individual'}
                onChange={() => handleRadioChange('trusteeType', 'individual')}
                required
              />
              <span className="ml-2">Individual Trustees</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className={`form-radio ${errors.trusteeType ? 'text-red-500' : 'text-blue-600'}`}
                name="trusteeType"
                checked={formData.trusteeType === 'corporate'}
                onChange={() => handleRadioChange('trusteeType', 'corporate')}
                required
              />
              <span className="ml-2">Corporate Trustee</span>
            </label>
          </div>
          {errors.trusteeType && <p className="text-red-500 text-sm mt-1">{errors.trusteeType}</p>}
        </div>

        {/* Financial Year */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="financialYear" className="block text-gray-700 font-medium">Financial Year <span className="text-red-500">*</span></Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select the financial year for which you're submitting this form.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <select
            id="financialYear"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            required
            className={`w-full border ${errors.financialYear ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            aria-invalid={errors.financialYear ? "true" : "false"}
            aria-describedby={errors.financialYear ? "financialYear-error" : undefined}
          >
            <option value="">Select Financial Year</option>
            <option value="2025">2024-2025</option>
            <option value="2024">2023-2024</option>
            <option value="2023">2022-2023</option>
            <option value="2022">2021-2022</option>
            <option value="2021">2020-2021</option>
          </select>
          {errors.financialYear && <p id="financialYear-error" className="text-red-500 text-sm mt-1">{errors.financialYear}</p>}
        </div>

        {/* Update ATO Details */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="updateAtoDetails" className="block text-gray-700 font-medium">Update ATO Details <span className="text-red-500">*</span></Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select whether you'd like us to update your fund's details with the ATO.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className={`form-radio ${errors.updateAtoDetails ? 'text-red-500' : 'text-blue-600'}`}
                name="updateAtoDetails"
                checked={formData.updateAtoDetails === 'yes'}
                onChange={() => handleRadioChange('updateAtoDetails', 'yes')}
                required
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className={`form-radio ${errors.updateAtoDetails ? 'text-red-500' : 'text-blue-600'}`}
                name="updateAtoDetails"
                checked={formData.updateAtoDetails === 'no'}
                onChange={() => handleRadioChange('updateAtoDetails', 'no')}
                required
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.updateAtoDetails && <p className="text-red-500 text-sm mt-1">{errors.updateAtoDetails}</p>}
        </div>

        {/* Electronic Service Address */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="electronicServiceAddress" className="block text-gray-700 font-medium">Electronic Service Address</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Enter your SMSF's electronic service address (optional).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="text"
            id="electronicServiceAddress"
            name="electronicServiceAddress"
            value={formData.electronicServiceAddress}
            onChange={handleLimitedTextChange}
            maxLength={100}
            placeholder="Electronic service address (optional)"
            error={errors.electronicServiceAddress}
            className={`${errors.electronicServiceAddress ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.electronicServiceAddress ? "true" : "false"}
            aria-describedby={errors.electronicServiceAddress ? "electronicServiceAddress-error" : undefined}
          />
        </div>

        {/* Banking Details Section */}
        <BankingDetailsSection 
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          required={true}
        />
      </div>
    </div>
  );
};

export default FormStep1SMSF;
