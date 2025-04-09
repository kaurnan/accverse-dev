
import React from 'react';
import { Label } from '../../ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface FormStep3SMSFProps {
  formData: {
    trustDeeds: File | null;
    originalFundRecords: File | null;
    memberApplication: File | null;
    trusteeConsent: File | null;
    fundInvestmentStrategy: File | null;
    rolloverStatements: File | null;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  errors: Record<string, string>;
}

const FormStep3SMSF: React.FC<FormStep3SMSFProps> = ({ formData, handleChange, handleRadioChange, handleFileChange, errors }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 3: Fund Records</h2>
        <p className="text-gray-600 mt-1">Please upload any of the following records that you have:</p>
      </div>
      
      <div className="space-y-6">
        {/* Trust Deeds */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="trustDeeds" className="block text-gray-700 font-medium">Trust Deeds of the Fund</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload Trust Deeds of the fund & any Deeds of Variation.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-gray-500 mb-2">Upload Trust Deeds of the fund & any Deeds of Variation.</p>
          <input
            type="file"
            id="trustDeeds"
            name="trustDeeds"
            onChange={(e) => handleFileChange(e, 'trustDeeds')}
            className={`w-full border ${errors.trustDeeds ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.trustDeeds ? `Selected file: ${formData.trustDeeds.name}` : 'No file selected'}
          </p>
          {errors.trustDeeds && <p className="text-red-500 text-sm mt-1">{errors.trustDeeds}</p>}
        </div>

        {/* Original Fund Records */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="originalFundRecords" className="block text-gray-700 font-medium">Original Fund Records</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload minutes of meetings and other official fund records.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-gray-500 mb-2">Upload Minutes of Meetings</p>
          <input
            type="file"
            id="originalFundRecords"
            name="originalFundRecords"
            onChange={(e) => handleFileChange(e, 'originalFundRecords')}
            className={`w-full border ${errors.originalFundRecords ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.originalFundRecords ? `Selected file: ${formData.originalFundRecords.name}` : 'No file selected'}
          </p>
          {errors.originalFundRecords && <p className="text-red-500 text-sm mt-1">{errors.originalFundRecords}</p>}
        </div>

        {/* Member Application */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="memberApplication" className="block text-gray-700 font-medium">Members Application</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload member application documents for all members of the fund.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <input
            type="file"
            id="memberApplication"
            name="memberApplication"
            onChange={(e) => handleFileChange(e, 'memberApplication')}
            className={`w-full border ${errors.memberApplication ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.memberApplication ? `Selected file: ${formData.memberApplication.name}` : 'No file selected'}
          </p>
          {errors.memberApplication && <p className="text-red-500 text-sm mt-1">{errors.memberApplication}</p>}
        </div>

        {/* Trustee Consent */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="trusteeConsent" className="block text-gray-700 font-medium">Consent to act as Trustees</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload documents showing consent of individuals to act as trustees for the fund.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <input
            type="file"
            id="trusteeConsent"
            name="trusteeConsent"
            onChange={(e) => handleFileChange(e, 'trusteeConsent')}
            className={`w-full border ${errors.trusteeConsent ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.trusteeConsent ? `Selected file: ${formData.trusteeConsent.name}` : 'No file selected'}
          </p>
          {errors.trusteeConsent && <p className="text-red-500 text-sm mt-1">{errors.trusteeConsent}</p>}
        </div>

        {/* Fund Investment Strategy */}
        <div className="form-group mb-6">
          <div className="flex items-center mb-2">
            <Label htmlFor="fundInvestmentStrategy" className="block text-gray-700 font-medium">Fund Investment Strategy</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload documents outlining the investment strategy of the fund.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <input
            type="file"
            id="fundInvestmentStrategy"
            name="fundInvestmentStrategy"
            onChange={(e) => handleFileChange(e, 'fundInvestmentStrategy')}
            className={`w-full border ${errors.fundInvestmentStrategy ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.fundInvestmentStrategy ? `Selected file: ${formData.fundInvestmentStrategy.name}` : 'No file selected'}
          </p>
          {errors.fundInvestmentStrategy && <p className="text-red-500 text-sm mt-1">{errors.fundInvestmentStrategy}</p>}
        </div>

        {/* Rollover Statements */}
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="rolloverStatements" className="block text-gray-700 font-medium">Rollover Statements from other Super funds</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload statements showing rollovers from other superannuation funds.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <input
            type="file"
            id="rolloverStatements"
            name="rolloverStatements"
            onChange={(e) => handleFileChange(e, 'rolloverStatements')}
            className={`w-full border ${errors.rolloverStatements ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.rolloverStatements ? `Selected file: ${formData.rolloverStatements.name}` : 'No file selected'}
          </p>
          {errors.rolloverStatements && <p className="text-red-500 text-sm mt-1">{errors.rolloverStatements}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormStep3SMSF;
