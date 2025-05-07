
import React from 'react';
import { SecuredBankingSection } from '../ui/secured-banking-section';

interface BankingDetailsSectionProps {
  // formData: any;
  formData: {
    bankBsb?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
    bankName?: string;
    confirmAccountNo?: string;
    [key: string]: string | undefined ;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  required?: boolean;
}

const BankingDetailsSection: React.FC<BankingDetailsSectionProps> = ({ 
  formData, 
  handleChange,
  errors,
  required = true
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">
        Banking Details {required && <span className="text-red-500">*</span>}
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
          Please provide your banking details for any refunds or payments. This information is encrypted and securely stored.
        </p>
        
      <SecuredBankingSection
        // formData={formData}
        formData={{
          bankBsb: formData.bankBsb || '',
          bankAccountNo: formData.bankAccountNo || '',
          bankAccountName: formData.bankAccountName || '',
          bankName: formData.bankName || '',
          confirmAccountNo: formData.confirmAccountNo
        }}
        handleChange={handleChange}
        errors={errors}
        required={required}
      />
      </div>
    </div>
  );
};

export default BankingDetailsSection;
