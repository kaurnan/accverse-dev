
import React from 'react';
import { SecuredBankingSection } from '../ui/secured-banking-section';

interface BankingDetailsSectionProps {
  formData: any;
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
      <SecuredBankingSection
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        required={required}
      />
    </div>
  );
};

export default BankingDetailsSection;
