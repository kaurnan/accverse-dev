import React, { useState } from 'react';
import { Shield, Eye, EyeOff, LockIcon } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '../../lib/utils';

interface SecuredBankingSectionProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  required?: boolean;
}

export const SecuredBankingSection: React.FC<SecuredBankingSectionProps> = ({ 
  formData, 
  handleChange,
  errors,
  required = true
}) => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(formData.confirmBankAccountNo || '');
  const [confirmError, setConfirmError] = useState('');
  
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmAccountNumber(value);
    
    if (value !== formData.bankAccountNo) {
      setConfirmError('Account numbers do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    
    if (confirmAccountNumber && e.target.value !== confirmAccountNumber) {
      setConfirmError('Account numbers do not match');
    } else {
      setConfirmError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6 relative">
      <div className="absolute -top-3 left-4 bg-white px-2 py-1 rounded-md border border-blue-200">
        <div className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Secured Section</span>
        </div>
      </div>
      
      <div className="flex items-center mb-4 gap-2">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Banking Details</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-6">
        Your banking details are securely encrypted and protected. We comply with industry-standard security protocols.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="form-group">
          <Label htmlFor="bankBsb" className="block text-sm font-medium text-gray-700 mb-1">
            BSB Number {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="text"
            id="bankBsb"
            name="bankBsb"
            value={formData.bankBsb || ''}
            onChange={handleChange}
            placeholder="e.g., 123-456"
            required={required}
            error={errors.bankBsb}
            tooltip="BSB (Bank-State-Branch) is a 6-digit number that identifies your bank branch."
            className="bg-white"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            placeholder="e.g., Commonwealth Bank"
            required={required}
            error={errors.bankName}
            className="bg-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="form-group">
          <Label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Name {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="text"
            id="bankAccountName"
            name="bankAccountName"
            value={formData.bankAccountName || ''}
            onChange={handleChange}
            placeholder="e.g., John Smith"
            required={required}
            error={errors.bankAccountName}
            tooltip="The name associated with your bank account"
            className="bg-white"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="bankAccountNo" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type={showAccountNumber ? "text" : "password"}
            id="bankAccountNo"
            name="bankAccountNo"
            value={formData.bankAccountNo || ''}
            onChange={handleAccountNumberChange}
            placeholder="Enter account number"
            required={required}
            error={errors.bankAccountNo}
            tooltip="Your bank account number (6-10 digits)"
            className={cn("bg-white pr-10", errors.bankAccountNo ? "border-red-500" : "")}
            isPassword={true}
            isPasswordVisible={showAccountNumber}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </div>
      </div>
        
      <div className="form-group">
        <Label htmlFor="confirmBankAccountNo" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Account Number {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type={showAccountNumber ? "text" : "password"}
          id="confirmBankAccountNo"
          name="confirmBankAccountNo"
          value={confirmAccountNumber}
          onChange={handleConfirmChange}
          placeholder="Re-enter account number"
          required={required}
          error={confirmError}
          className={cn("bg-white pr-10", confirmError ? "border-red-500" : "")}
          isPassword={true}
          isPasswordVisible={showAccountNumber}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>
    </div>
  );
};
