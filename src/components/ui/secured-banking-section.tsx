
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, LockIcon } from 'lucide-react';
import { Label } from './label';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface SecuredBankingSectionProps {
  formData: {
    [key: string]: any;
  };
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
          <div className="relative">
            <input
              type="text"
              id="bankBsb"
              name="bankBsb"
              value={formData.bankBsb || ''}
              onChange={handleChange}
              placeholder="e.g., 123-456"
              required={required}
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                errors.bankBsb ? "border-red-500" : "border-gray-300"
              )}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 z-50">
                  <p className="text-sm">BSB (Bank-State-Branch) is a 6-digit number that identifies your bank branch.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {errors.bankBsb && <p className="mt-1 text-xs text-red-500">{errors.bankBsb}</p>}
        </div>
        
        <div className="form-group">
          <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name {required && <span className="text-red-500">*</span>}
          </Label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            placeholder="e.g., Commonwealth Bank"
            required={required}
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
              errors.bankName ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.bankName && <p className="mt-1 text-xs text-red-500">{errors.bankName}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="form-group">
          <Label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Name {required && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <input
              type="text"
              id="bankAccountName"
              name="bankAccountName"
              value={formData.bankAccountName || ''}
              onChange={handleChange}
              placeholder="e.g., John Smith"
              required={required}
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                errors.bankAccountName ? "border-red-500" : "border-gray-300"
              )}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 z-50">
                  <p className="text-sm">The name associated with your bank account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {errors.bankAccountName && <p className="mt-1 text-xs text-red-500">{errors.bankAccountName}</p>}
        </div>
        
        <div className="form-group">
          <Label htmlFor="bankAccountNo" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number {required && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <input
              type={showAccountNumber ? "text" : "password"}
              id="bankAccountNo"
              name="bankAccountNo"
              value={formData.bankAccountNo || ''}
              onChange={handleAccountNumberChange}
              placeholder="Enter account number"
              required={required}
              className={cn(
                "w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                errors.bankAccountNo ? "border-red-500" : "border-gray-300"
              )}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-white p-2 z-50">
                  <p className="text-sm">Your bank account number (6-10 digits)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showAccountNumber ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.bankAccountNo && <p className="mt-1 text-xs text-red-500">{errors.bankAccountNo}</p>}
        </div>
      </div>
        
      <div className="form-group">
        <Label htmlFor="confirmBankAccountNo" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Account Number {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <input
            type={showAccountNumber ? "text" : "password"}
            id="confirmBankAccountNo"
            name="confirmBankAccountNo"
            value={confirmAccountNumber}
            onChange={handleConfirmChange}
            placeholder="Re-enter account number"
            required={required}
            className={cn(
              "w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
              confirmError ? "border-red-500" : "border-gray-300"
            )}
          />
          <button 
            type="button" 
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showAccountNumber ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {confirmError && <p className="mt-1 text-xs text-red-500">{confirmError}</p>}
      </div>
    </div>
  );
};
