
import React from 'react';
import { Label } from '../../ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface FormStep4SMSFProps {
  formData: {
    capitalGains: string;
    propertyCapitalGains: string;
    rentalIncome: string;
    trustDistribution: string;
    partnershipDistribution: string;
    dividendIncome: string;
    investmentExpenses: string;
    managementExpenses: string;
    expenseInvoices: File | null;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  errors: Record<string, string>;
}

const FormStep4SMSF: React.FC<FormStep4SMSFProps> = ({ formData, handleChange, handleRadioChange, handleFileChange, errors }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 4: Income and Expense Details</h2>
        <p className="text-gray-600 mt-1">Please provide information about the fund's income and expenses</p>
      </div>
      
      <div className="space-y-6">
        {/* Capital Gains */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="capitalGains" className="block text-gray-700 font-medium">Did the fund have any capital gains on its investments?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Capital gains are profits from selling investments for more than their purchase price.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="capitalGains"
                checked={formData.capitalGains === 'yes'}
                onChange={() => handleRadioChange('capitalGains', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="capitalGains"
                checked={formData.capitalGains === 'no'}
                onChange={() => handleRadioChange('capitalGains', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Property Capital Gains */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="propertyCapitalGains" className="block text-gray-700 font-medium">Did the fund sell any properties during the financial year?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select yes if your SMSF sold any real estate holdings during this financial year.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="propertyCapitalGains"
                checked={formData.propertyCapitalGains === 'yes'}
                onChange={() => handleRadioChange('propertyCapitalGains', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="propertyCapitalGains"
                checked={formData.propertyCapitalGains === 'no'}
                onChange={() => handleRadioChange('propertyCapitalGains', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Rental Income */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="rentalIncome" className="block text-gray-700 font-medium">Did the fund receive any rental income?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select yes if your SMSF received income from renting properties it owns.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="rentalIncome"
                checked={formData.rentalIncome === 'yes'}
                onChange={() => handleRadioChange('rentalIncome', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="rentalIncome"
                checked={formData.rentalIncome === 'no'}
                onChange={() => handleRadioChange('rentalIncome', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Trust Distribution */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="trustDistribution" className="block text-gray-700 font-medium">Did the fund receive any trust distributions?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select yes if your SMSF received income from trust investments.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trustDistribution"
                checked={formData.trustDistribution === 'yes'}
                onChange={() => handleRadioChange('trustDistribution', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trustDistribution"
                checked={formData.trustDistribution === 'no'}
                onChange={() => handleRadioChange('trustDistribution', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Partnership Distribution */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="partnershipDistribution" className="block text-gray-700 font-medium">Did the fund receive any partnership distributions?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select yes if your SMSF received income from business partnership interests.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="partnershipDistribution"
                checked={formData.partnershipDistribution === 'yes'}
                onChange={() => handleRadioChange('partnershipDistribution', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="partnershipDistribution"
                checked={formData.partnershipDistribution === 'no'}
                onChange={() => handleRadioChange('partnershipDistribution', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Dividend Income */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="dividendIncome" className="block text-gray-700 font-medium">Did the fund receive dividend income?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select yes if your SMSF received dividends from shares it owns.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="dividendIncome"
                checked={formData.dividendIncome === 'yes'}
                onChange={() => handleRadioChange('dividendIncome', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="dividendIncome"
                checked={formData.dividendIncome === 'no'}
                onChange={() => handleRadioChange('dividendIncome', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Investment Expenses */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="investmentExpenses" className="block text-gray-700 font-medium">Did the fund have any investment expenses?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>These include costs directly related to generating investment income like brokerage fees.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="investmentExpenses"
                checked={formData.investmentExpenses === 'yes'}
                onChange={() => handleRadioChange('investmentExpenses', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="investmentExpenses"
                checked={formData.investmentExpenses === 'no'}
                onChange={() => handleRadioChange('investmentExpenses', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Management Expenses */}
        <div className="form-group mb-4">
          <div className="flex items-center mb-2">
            <Label htmlFor="managementExpenses" className="block text-gray-700 font-medium">Did the fund incur management expenses?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>These include accounting fees, audit fees, legal fees, and other administrative costs.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="managementExpenses"
                checked={formData.managementExpenses === 'yes'}
                onChange={() => handleRadioChange('managementExpenses', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="managementExpenses"
                checked={formData.managementExpenses === 'no'}
                onChange={() => handleRadioChange('managementExpenses', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Expense Invoices */}
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label htmlFor="expenseInvoices" className="block text-gray-700 font-medium">Upload Expense Invoices</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 text-gray-400 cursor-help">
                    <HelpCircle size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload copies of invoices for expenses claimed by the fund.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-gray-500 mb-2">Upload invoices for expenses claimed by the fund.</p>
          <input
            type="file"
            id="expenseInvoices"
            name="expenseInvoices"
            onChange={(e) => handleFileChange(e, 'expenseInvoices')}
            className={`w-full border ${errors.expenseInvoices ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.expenseInvoices ? `Selected file: ${formData.expenseInvoices.name}` : 'No file selected'}
          </p>
          {errors.expenseInvoices && <p className="text-red-500 text-sm mt-1">{errors.expenseInvoices}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormStep4SMSF;
