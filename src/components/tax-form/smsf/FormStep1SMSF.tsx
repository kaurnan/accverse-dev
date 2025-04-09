
import React from 'react';
import { Label } from '../../ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

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
    electronicServiceAddress: string;
    [key: string]: string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const FormStep1SMSF: React.FC<FormStep1SMSFProps> = ({ formData, handleChange, handleRadioChange, errors }) => {
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
          <input
            type="text"
            id="smsfName"
            name="smsfName"
            value={formData.smsfName}
            onChange={handleChange}
            required
            className={`w-full border ${errors.smsfName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            placeholder="e.g., Smith Family Superannuation Fund"
          />
          {errors.smsfName && <p className="text-red-500 text-sm mt-1">{errors.smsfName}</p>}
        </div>

        {/* SMSF Address */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">SMSF Address</h3>
          
          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="streetAddress" className="block text-gray-700 font-medium">Street Address <span className="text-red-500">*</span></Label>
            </div>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
              className={`w-full border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="Street address"
            />
            {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
          </div>

          <div className="form-group mb-4">
            <Label htmlFor="streetAddress2" className="block text-gray-700 font-medium mb-2">Street Address Line 2</Label>
            <input
              type="text"
              id="streetAddress2"
              name="streetAddress2"
              value={formData.streetAddress2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Apartment, suite, unit, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group mb-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="city" className="block text-gray-700 font-medium">City <span className="text-red-500">*</span></Label>
              </div>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div className="form-group mb-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="state" className="block text-gray-700 font-medium">State <span className="text-red-500">*</span></Label>
              </div>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
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
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div className="form-group mb-4">
              <div className="flex items-center mb-2">
                <Label htmlFor="postcode" className="block text-gray-700 font-medium">Postcode <span className="text-red-500">*</span></Label>
              </div>
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                required
                className={`w-full border ${errors.postcode ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Postcode"
              />
              {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Details</h3>
          
          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="contactName" className="block text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></Label>
            </div>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className={`w-full border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="Full name"
            />
            {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
          </div>

          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="contactPosition" className="block text-gray-700 font-medium">Position</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 text-gray-400 cursor-help">
                      <HelpCircle size={16} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Your role or position in relation to the SMSF (e.g., Trustee, Member, Director)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <input
              type="text"
              id="contactPosition"
              name="contactPosition"
              value={formData.contactPosition}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="e.g., Trustee, Member, Director"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="contactPhone" className="block text-gray-700 font-medium">Phone <span className="text-red-500">*</span></Label>
              </div>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={`w-full border ${(errors.contactPhone && !formData.contactMobile) ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Phone number"
              />
              {errors.contactPhone && !formData.contactMobile && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
            </div>

            <div className="form-group">
              <div className="flex items-center mb-2">
                <Label htmlFor="contactMobile" className="block text-gray-700 font-medium">Mobile <span className="text-red-500">*</span></Label>
              </div>
              <input
                type="tel"
                id="contactMobile"
                name="contactMobile"
                value={formData.contactMobile}
                onChange={handleChange}
                className={`w-full border ${(errors.contactMobile && !formData.contactPhone) ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Mobile number"
              />
              {errors.contactMobile && !formData.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactMobile}</p>}
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="contactEmail" className="block text-gray-700 font-medium">Email <span className="text-red-500">*</span></Label>
            </div>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className={`w-full border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="Email address"
            />
            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
          </div>
        </div>

        {/* Additional Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Details</h3>
          
          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="trusteeType" className="block text-gray-700 font-medium">Trustee Type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 text-gray-400 cursor-help">
                      <HelpCircle size={16} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Select whether your fund has individual trustees or a corporate trustee.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="trusteeType"
                  checked={formData.trusteeType === 'individual'}
                  onChange={() => handleRadioChange('trusteeType', 'individual')}
                />
                <span className="ml-2">Individual Trustees</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="trusteeType"
                  checked={formData.trusteeType === 'corporate'}
                  onChange={() => handleRadioChange('trusteeType', 'corporate')}
                />
                <span className="ml-2">Corporate Trustee</span>
              </label>
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="financialYear" className="block text-gray-700 font-medium">Financial Year</Label>
            </div>
            <select
              id="financialYear"
              name="financialYear"
              value={formData.financialYear}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select a financial year</option>
              <option value="2023">2022-2023</option>
              <option value="2022">2021-2022</option>
              <option value="2021">2020-2021</option>
              <option value="2020">2019-2020</option>
            </select>
          </div>

          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="updateAtoDetails" className="block text-gray-700 font-medium">Would you like us to update your SMSF details with the ATO?</Label>
            </div>
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
          </div>

          <div className="form-group mb-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="electronicServiceAddress" className="block text-gray-700 font-medium">Electronic Service Address (ESA)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 text-gray-400 cursor-help">
                      <HelpCircle size={16} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Your fund's Electronic Service Address is used for SuperStream compliance.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <input
              type="text"
              id="electronicServiceAddress"
              name="electronicServiceAddress"
              value={formData.electronicServiceAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Electronic Service Address (if available)"
            />
          </div>
        </div>
        
        {/* Bank Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Bank Account Details</h3>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
            <p className="text-blue-800 text-sm">Banking details will be securely stored and used only for processing refunds or payments related to your SMSF.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <Label htmlFor="bankBsb" className="block text-gray-700 font-medium mb-2">BSB</Label>
              <input
                type="text"
                id="bankBsb"
                name="bankBsb"
                value={formData.bankBsb}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., 123-456"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="bankAccountNo" className="block text-gray-700 font-medium mb-2">Account Number</Label>
              <input
                type="text"
                id="bankAccountNo"
                name="bankAccountNo"
                value={formData.bankAccountNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <Label htmlFor="bankAccountName" className="block text-gray-700 font-medium mb-2">Account Name</Label>
              <input
                type="text"
                id="bankAccountName"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="bankName" className="block text-gray-700 font-medium mb-2">Bank Name</Label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Commonwealth Bank"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep1SMSF;
