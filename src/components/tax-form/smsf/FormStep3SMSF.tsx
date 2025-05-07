import React from 'react';
import { Label } from '../../ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { FileUpload } from '../../ui/file-upload2';

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
  handleFileUpload?: (fieldName: string, file: File | null) => void;
  errors: Record<string, string>;
}

const FormStep3SMSF: React.FC<FormStep3SMSFProps> = ({ 
  formData, 
  handleChange, 
  handleRadioChange, 
  handleFileChange,
  handleFileUpload,
  errors 
}) => {
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
          <FileUpload
            id="trustDeeds"
            name="trustDeeds"
            value={formData.trustDeeds}
            onChange={(file) => handleFileUpload && handleFileUpload('trustDeeds', file)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            error={errors.trustDeeds}
            helper="Upload Trust Deeds of the fund & any Deeds of Variation."
          />
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
          <FileUpload
            id="originalFundRecords"
            name="originalFundRecords"
            value={formData.originalFundRecords}
            onChange={(file) => handleFileUpload && handleFileUpload('originalFundRecords', file)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            error={errors.originalFundRecords}
            helper="Upload Minutes of Meetings"
          />
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
          <FileUpload
            id="memberApplication"
            name="memberApplication"
            value={formData.memberApplication}
            onChange={(file) => handleFileUpload && handleFileUpload('memberApplication', file)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            error={errors.memberApplication}
          />
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
          <FileUpload
            id="trusteeConsent"
            name="trusteeConsent"
            value={formData.trusteeConsent}
            onChange={(file) => handleFileUpload && handleFileUpload('trusteeConsent', file)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            error={errors.trusteeConsent}
          />
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
          <FileUpload
            id="fundInvestmentStrategy"
            name="fundInvestmentStrategy"
            value={formData.fundInvestmentStrategy}
            onChange={(file) => handleFileUpload && handleFileUpload('fundInvestmentStrategy', file)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            error={errors.fundInvestmentStrategy}
          />
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
          <FileUpload
            id="rolloverStatements"
            name="rolloverStatements"
            value={formData.rolloverStatements}
            onChange={(file) => handleFileUpload && handleFileUpload('rolloverStatements', file)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            error={errors.rolloverStatements}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStep3SMSF;
