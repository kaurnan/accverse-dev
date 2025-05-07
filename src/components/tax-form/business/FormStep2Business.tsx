import React from 'react';
import { Label } from '../../ui/label';
import { SecuredBankingSection } from '../../ui/secured-banking-section';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface FormStep2Props {
  formData: {
    bankBsb: string;
    bankAccountNo: string;
    bankAccountName: string;
    bankName: string;
    confirmAccountNo: string;
    prevAccountantName: string;
    prevAccountantAddress: string;
    prevAccountantCity: string;
    prevAccountantState: string;
    prevAccountantPhone: string;
    financialYear: string;
    updateAtoDetails: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const FormStep2Business: React.FC<FormStep2Props> = ({ 
  formData, 
  handleChange, 
  handleRadioChange,
  errors
}) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Business Bank & Previous Accountant Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Bank Account Details */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            Business Bank Account for TAX REFUND
            <span className="text-red-500 ml-1">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">These details will be used for any tax refunds or payments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
            <div className="absolute -top-3 right-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200 flex items-center">
              <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secured
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              Please provide your business banking details for any refunds or payments. This information is encrypted and securely stored.
            </p>
            
            <SecuredBankingSection
              formData={{
                bankBsb: formData.bankBsb,
                bankAccountNo: formData.bankAccountNo,
                bankAccountName: formData.bankAccountName,
                bankName: formData.bankName,
                confirmAccountNo: formData.confirmAccountNo,
              }}
              handleChange={handleChange}
              errors={errors}
              required={true}
            />
            </div>
        </div>

        {/* Previous Accountant */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            Previous Accountant's Details, if had one
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Providing previous accountant details helps with a smooth transition of your accounting records</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          
          {/* Accountant Name */}
          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantName" className="block text-gray-700 font-medium mb-2">Full Name / Business Name</Label>
            <div className="relative">
              <input
                type="text"
                id="prevAccountantName"
                name="prevAccountantName"
                value={formData.prevAccountantName}
                onChange={handleChange}
                className={`w-full border ${errors.prevAccountantName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                maxLength={100}
              />
              {errors.prevAccountantName && (
                <p className="mt-1 text-xs text-red-500">{errors.prevAccountantName}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantAddress" className="block text-gray-700 font-medium mb-2">Street Address Line 1</Label>
            <div className="relative">
              <input
                type="text"
                id="prevAccountantAddress"
                name="prevAccountantAddress"
                value={formData.prevAccountantAddress}
                onChange={handleChange}
                className={`w-full border ${errors.prevAccountantAddress ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                maxLength={100}
              />
              {errors.prevAccountantAddress && (
                <p className="mt-1 text-xs text-red-500">{errors.prevAccountantAddress}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* City */}
            <div className="form-group">
              <Label htmlFor="prevAccountantCity" className="block text-gray-700 font-medium mb-2">City</Label>
              <div className="relative">
                <input
                  type="text"
                  id="prevAccountantCity"
                  name="prevAccountantCity"
                  value={formData.prevAccountantCity}
                  onChange={handleChange}
                  className={`w-full border ${errors.prevAccountantCity ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                  maxLength={50}
                />
                {errors.prevAccountantCity && (
                  <p className="mt-1 text-xs text-red-500">{errors.prevAccountantCity}</p>
                )}
              </div>
            </div>

            {/* State */}
            <div className="form-group">
              <Label htmlFor="prevAccountantState" className="block text-gray-700 font-medium mb-2">State</Label>
              <div className="relative">
                <select
                  id="prevAccountantState"
                  name="prevAccountantState"
                  value={formData.prevAccountantState}
                  onChange={handleChange}
                  className={`w-full border ${errors.prevAccountantState ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                >
                  <option value="">Select a state</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NSW">New South Wales</option>
                  <option value="NT">Northern Territory</option>
                  <option value="QLD">Queensland</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="VIC">Victoria</option>
                  <option value="WA">Western Australia</option>
                </select>
                {errors.prevAccountantState && (
                  <p className="mt-1 text-xs text-red-500">{errors.prevAccountantState}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <Label htmlFor="prevAccountantPhone" className="block text-gray-700 font-medium mb-2">
              Telephone Number
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter in format: 02XXXXXXXX or 04XXXXXXXX</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <input
                type="tel"
                id="prevAccountantPhone"
                name="prevAccountantPhone"
                value={formData.prevAccountantPhone}
                onChange={handleChange}
                className={`w-full border ${errors.prevAccountantPhone ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                maxLength={12}
                placeholder="e.g., 0412345678 or 0212345678"
              />
              {errors.prevAccountantPhone && (
                <p className="mt-1 text-xs text-red-500">{errors.prevAccountantPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Financial Year */}
        <div className="form-group">
          <Label htmlFor="financialYear" className="block text-gray-700 font-medium mb-2">
            Tax Return for Financial Year Ended 30 June <span className="text-red-500">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>State the Financial Year End for which this tax return will be prepared</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <p className="text-sm text-gray-500 mb-2">State the Financial Year End you require the accounts and tax return to be prepared.</p>
          <div className="relative">
            <select
              id="financialYear"
              name="financialYear"
              value={formData.financialYear}
              onChange={handleChange}
              className={`w-full border ${errors.financialYear ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            >
              <option value="">Select a financial year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
            {errors.financialYear && (
              <p className="mt-1 text-xs text-red-500">{errors.financialYear}</p>
            )}
          </div>
        </div>

        {/* Update ATO Details */}
        <div className="form-group">
          <Label htmlFor="updateAtoDetails" className="block text-gray-700 font-medium mb-2">
            Would you authorise us to update your business address and contact details with the ATO? <span className="text-red-500">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This allows us to keep your ATO details current</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="updateAtoDetails"
                checked={formData.updateAtoDetails === 'yes'}
                onChange={() => handleRadioChange('updateAtoDetails', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="updateAtoDetails"
                checked={formData.updateAtoDetails === 'no'}
                onChange={() => handleRadioChange('updateAtoDetails', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.updateAtoDetails && (
            <p className="mt-1 text-xs text-red-500">{errors.updateAtoDetails}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStep2Business;