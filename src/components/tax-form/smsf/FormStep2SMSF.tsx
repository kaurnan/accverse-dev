
import React from 'react';
import { Label } from '../../ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { FileUpload } from '../../ui/file-upload2';

interface FormStep2SMSFProps {
  formData: {
    memberCount: string;
    prevAccountantName: string;
    prevAccountantContact: string;
    prevAccountantPhone: string;
    prevAccountantMobile: string;
    prevAccountantEmail: string;
    lastFinancialStatements: File | null;
    lastTaxReturn: File | null;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  handleFileUpload?: (fieldName: string, file: File | null) => void;
  errors: Record<string, string>;
}

const FormStep2SMSF: React.FC<FormStep2SMSFProps> = ({ formData, handleChange, handleRadioChange, handleFileChange, handleFileUpload, errors }) => {
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Apply input validation based on field type
    let validatedValue = value;
    
    if (name === 'prevAccountantPhone' || name === 'prevAccountantMobile') {
      validatedValue = value.replace(/\D/g, '').substring(0, 10);
    } else if (name === 'prevAccountantName' || name === 'prevAccountantContact') {
      validatedValue = value.substring(0, 100);
    }
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name,
        value: validatedValue
      }
    };
    
    handleChange(event);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 2: Member Details</h2>
        <p className="text-gray-600 mt-1">Information about the SMSF members and previous accountant</p>
      </div>
      
      <div className="space-y-6">
        {/* Member Count */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="memberCount" className="block text-gray-700 font-medium">How many members does the SMSF have? <span className="text-red-500">*</span></Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select the number of members in your Self-Managed Superannuation Fund.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <label key={num} className="inline-flex items-center">
                <input
                  type="radio"
                  className={`form-radio ${errors.memberCount ? 'text-red-500' : 'text-blue-600'}`}
                  name="memberCount"
                  checked={formData.memberCount === num.toString()}
                  onChange={() => handleRadioChange('memberCount', num.toString())}
                />
                <span className="ml-2">{num}</span>
              </label>
            ))}
          </div>
          {errors.memberCount && <p className="text-red-500 text-sm mt-1">{errors.memberCount}</p>}
        </div>

        {/* Previous Accountant */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Previous Accountant's Details:</h3>
          
          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantName" className="block text-gray-700 font-medium mb-2">Name of Firm / Responsible Individual</Label>
            <input
              type="text"
              id="prevAccountantName"
              name="prevAccountantName"
              value={formData.prevAccountantName}
              onChange={handleCustomInputChange}
              maxLength={100}
              className={`w-full border ${errors.prevAccountantName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            />
            {errors.prevAccountantName && <p className="text-red-500 text-sm mt-1">{errors.prevAccountantName}</p>}
          </div>

          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantContact" className="block text-gray-700 font-medium mb-2">Contact Name</Label>
            <input
              type="text"
              id="prevAccountantContact"
              name="prevAccountantContact"
              value={formData.prevAccountantContact}
              onChange={handleCustomInputChange}
              maxLength={100}
              className={`w-full border ${errors.prevAccountantContact ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            />
            {errors.prevAccountantContact && <p className="text-red-500 text-sm mt-1">{errors.prevAccountantContact}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <Label htmlFor="prevAccountantPhone" className="block text-gray-700 font-medium mb-2">Telephone No.</Label>
              <input
                type="tel"
                id="prevAccountantPhone"
                name="prevAccountantPhone"
                value={formData.prevAccountantPhone}
                onChange={handleCustomInputChange}
                maxLength={10}
                className={`w-full border ${errors.prevAccountantPhone ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="0412345678"
              />
              {errors.prevAccountantPhone && <p className="text-red-500 text-sm mt-1">{errors.prevAccountantPhone}</p>}
            </div>

            <div className="form-group">
              <Label htmlFor="prevAccountantMobile" className="block text-gray-700 font-medium mb-2">Mobile No.</Label>
              <input
                type="tel"
                id="prevAccountantMobile"
                name="prevAccountantMobile"
                value={formData.prevAccountantMobile}
                onChange={handleCustomInputChange}
                maxLength={10}
                className={`w-full border ${errors.prevAccountantMobile ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="0412345678"
              />
              {errors.prevAccountantMobile && <p className="text-red-500 text-sm mt-1">{errors.prevAccountantMobile}</p>}
            </div>
          </div>

          <div className="form-group mb-6">
            <Label htmlFor="prevAccountantEmail" className="block text-gray-700 font-medium mb-2">Email Address</Label>
            <input
              type="email"
              id="prevAccountantEmail"
              name="prevAccountantEmail"
              value={formData.prevAccountantEmail}
              onChange={handleChange}
              maxLength={100}
              className={`w-full border ${errors.prevAccountantEmail ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="email@example.com"
            />
            {errors.prevAccountantEmail && <p className="text-red-500 text-sm mt-1">{errors.prevAccountantEmail}</p>}
          </div>
        </div>

        {/* Last Financial Statements */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="lastFinancialStatements" className="block text-gray-700 font-medium">Last Financial Statements</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload your most recent Financial Statements & Members Statements.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {handleFileUpload ? (
            <FileUpload
              id="lastFinancialStatements"
              value={formData.lastFinancialStatements}
              onChange={(file) => handleFileUpload('lastFinancialStatements', file)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              error={errors.lastFinancialStatements}
              helper="Upload the most recent Financial Statements & Members Statements."
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">Upload the most recent Financial Statements & Members Statements.</p>
              <input
                type="file"
                id="lastFinancialStatements"
                name="lastFinancialStatements"
                onChange={(e) => handleFileChange(e, 'lastFinancialStatements')}
                className={`w-full border ${errors.lastFinancialStatements ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.lastFinancialStatements ? `Selected file: ${formData.lastFinancialStatements.name}` : 'No file selected'}
              </p>
              {errors.lastFinancialStatements && <p className="text-red-500 text-sm mt-1">{errors.lastFinancialStatements}</p>}
            </>
          )}
        </div>

        {/* Last Tax Return */}
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="lastTaxReturn" className="block text-gray-700 font-medium">Last Income Tax Return</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload your most recent Income Tax Return for the SMSF.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {handleFileUpload ? (
            <FileUpload
              id="lastTaxReturn"
              value={formData.lastTaxReturn}
              onChange={(file) => handleFileUpload('lastTaxReturn', file)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              error={errors.lastTaxReturn}
              helper="Upload the most recent Income Tax Return."
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">Upload the most recent Income Tax Return.</p>
              <input
                type="file"
                id="lastTaxReturn"
                name="lastTaxReturn"
                onChange={(e) => handleFileChange(e, 'lastTaxReturn')}
                className={`w-full border ${errors.lastTaxReturn ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.lastTaxReturn ? `Selected file: ${formData.lastTaxReturn.name}` : 'No file selected'}
              </p>
              {errors.lastTaxReturn && <p className="text-red-500 text-sm mt-1">{errors.lastTaxReturn}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStep2SMSF;
