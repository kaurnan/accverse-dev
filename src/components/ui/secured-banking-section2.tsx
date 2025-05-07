
import React from 'react';
import { Label } from './label';
import { Input } from './input';

interface SecuredBankingSectionProps {
  formData: {
    bankBsb: string;
    bankAccountNo: string;
    bankAccountName: string;
    bankName: string;
    confirmAccountNo?: string;
    [key: string]: string | undefined | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBsbChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAccountNoChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  required?: boolean;
}

export const SecuredBankingSection: React.FC<SecuredBankingSectionProps> = ({
  formData,
  handleChange,
  handleBsbChange,
  handleAccountNoChange,
  errors,
  required = true
}) => {
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    
    if (name === 'bankBsb' && handleBsbChange) {
      handleBsbChange(e);
      return;
    }
    
    if ((name === 'bankAccountNo' || name === 'confirmAccountNo') && handleAccountNoChange) {
      handleAccountNoChange(e);
      return;
    }
    
    handleChange(e);
  };

  const formatBsb = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/[^\d]/g, '');
    
    // Format with a dash after 3 digits
    if (cleaned.length > 3) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}`;
    }
    return cleaned;
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <Label htmlFor="bankBsb" className="block text-gray-700 font-medium mb-2">
            BSB Number {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="text"
            id="bankBsb"
            name="bankBsb"
            value={formData.bankBsb}
            onChange={handleCustomChange}
            required={required}
            maxLength={7} // 6 digits + 1 dash
            placeholder="e.g., 123-456"
            tooltip="Enter your 6-digit BSB number with a dash (e.g., 123-456)"
            error={errors.bankBsb}
            className={`${errors.bankBsb ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.bankBsb ? "true" : "false"}
            aria-describedby={errors.bankBsb ? "bankBsb-error" : undefined}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="bankName" className="block text-gray-700 font-medium mb-2">
            Bank Name {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required={required}
            maxLength={50}
            placeholder="e.g., Commonwealth Bank"
            tooltip="Enter the name of your banking institution"
            error={errors.bankName}
            className={`${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.bankName ? "true" : "false"}
            aria-describedby={errors.bankName ? "bankName-error" : undefined}
          />
        </div>
      </div>

      <div className="form-group">
        <Label htmlFor="bankAccountNo" className="block text-gray-700 font-medium mb-2">
          Account Number {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type="text"
          id="bankAccountNo"
          name="bankAccountNo"
          value={formData.bankAccountNo}
          onChange={handleCustomChange}
          required={required}
          maxLength={10}
          placeholder="Enter account number"
          tooltip="Enter your bank account number (6-10 digits)"
          error={errors.bankAccountNo}
          className={`${errors.bankAccountNo ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={errors.bankAccountNo ? "true" : "false"}
          aria-describedby={errors.bankAccountNo ? "bankAccountNo-error" : undefined}
        />
      </div>

      {/* Confirm Account Number field */}
      <div className="form-group">
        <Label htmlFor="confirmAccountNo" className="block text-gray-700 font-medium mb-2">
          Confirm Account Number {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type="text"
          id="confirmAccountNo"
          name="confirmAccountNo"
          value={formData.confirmAccountNo || ''}
          onChange={handleCustomChange}
          required={required}
          maxLength={10}
          placeholder="Confirm account number"
          tooltip="Re-enter your bank account number to confirm"
          error={errors.confirmAccountNo}
          className={`${errors.confirmAccountNo ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={errors.confirmAccountNo ? "true" : "false"}
          aria-describedby={errors.confirmAccountNo ? "confirmAccountNo-error" : undefined}
        />
        {formData.bankAccountNo && formData.confirmAccountNo && 
         formData.bankAccountNo !== formData.confirmAccountNo && 
         !errors.confirmAccountNo && (
          <p className="mt-1 text-xs text-red-500">Account numbers do not match</p>
        )}
      </div>

      <div className="form-group">
        <Label htmlFor="bankAccountName" className="block text-gray-700 font-medium mb-2">
          Account Name {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type="text"
          id="bankAccountName"
          name="bankAccountName"
          value={formData.bankAccountName}
          onChange={handleChange}
          required={required}
          maxLength={100}
          placeholder="e.g., John Smith"
          tooltip="Enter the name on your bank account"
          error={errors.bankAccountName}
          className={`${errors.bankAccountName ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={errors.bankAccountName ? "true" : "false"}
          aria-describedby={errors.bankAccountName ? "bankAccountName-error" : undefined}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
        <p>Your banking information is kept secure and encrypted. It will only be used for tax-related refunds or payments.</p>
      </div>
    </div>
  );
};
