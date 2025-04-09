import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { HelpCircle , Info} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface FormStep4Props {
  formData: any;
  handleRadioChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const FormStep4: React.FC<FormStep4Props> = ({ 
  formData, 
  handleRadioChange,
  errors
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 4: Expenses related to Salary/Wages</h2>
        <p className="text-gray-600 mt-1">Answer applicable questions only, otherwise disregard.</p>
      </div>
      
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">To claim a deduction for work-related expenses YOU MUST MEET ALL OF THE ATO'S 3 GOLD RULES:</h3>
        <ol className="list-decimal pl-5 space-y-1 text-blue-700">
          <li>You must have spent the money and not been reimbursed</li>
          <li>The claim must be directly related to earning your taxable income</li>
          <li>You must have records to prove it</li>
        </ol>
        <p className="text-sm text-blue-600 mt-2">Please provide details and upload proof of claims for total claims of $300 or more per tax return (not per item).</p>
      <div className="space-y-6">
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">CAR / MOTOR VEHICLE WORK-RELATED EXPENSE? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                <p>Expenses for using your personal vehicle for work purposes.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.carExpense || ''} 
            onValueChange={(value: string) => handleRadioChange('carExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="carExpenseYes" />
              <Label htmlFor="carExpenseYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="carExpenseNo" />
              <Label htmlFor="carExpenseNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.carExpense && <p className="mt-1 text-xs text-red-500">{errors.carExpense}</p>}
          <p className="text-sm text-gray-500 mt-1">If you use your personal vehicle for work-related travel.</p>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">UNIFORM, PROTECTIVE CLOTHING & DRY CLEANING? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
                <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                <p>Expenses for required work uniforms, protective clothing, and their maintenance.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.uniformExpense || ''} 
            onValueChange={(value: string) => handleRadioChange('uniformExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="uniformExpenseYes" />
              <Label htmlFor="uniformExpenseYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="uniformExpenseNo" />
              <Label htmlFor="uniformExpenseNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.uniformExpense && <p className="mt-1 text-xs text-red-500">{errors.uniformExpense}</p>}
        </div>
      </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">TRAVEL EXPENSE? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
          <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
          <p>Work-related travel expenses (not commuting or car expenses).</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.travelExpense || ''} 
            onValueChange={(value: string) => handleRadioChange('travelExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="travelExpenseYes" />
              <Label htmlFor="travelExpenseYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="travelExpenseNo" />
              <Label htmlFor="travelExpenseNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.travelExpense && <p className="mt-1 text-xs text-red-500">{errors.travelExpense}</p>}
          <p className="text-sm text-gray-500 mt-1">This is NOT WORK-RELATED CAR EXPENSE or RELOCATION EXPENSE.</p>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">SELF-EDUCATION EXPENSE? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
          <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
          <p>Expenses for courses and education directly related to your current employment.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.educationExpense || ''} 
            onValueChange={(value: string) => handleRadioChange('educationExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="educationExpenseYes" />
              <Label htmlFor="educationExpenseYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="educationExpenseNo" />
              <Label htmlFor="educationExpenseNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.educationExpense && <p className="mt-1 text-xs text-red-500">{errors.educationExpense}</p>}
          <p className="text-sm text-gray-500 mt-1">The course must be directly related to your current occupation.</p>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">PHONE & DATA EXPENSE? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
          <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
          <p>Work-related portion of phone, internet and data expenses.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.phoneExpense || ''} 
            onValueChange={(value: string) => handleRadioChange('phoneExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="phoneExpenseYes" />
              <Label htmlFor="phoneExpenseYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="phoneExpenseNo" />
              <Label htmlFor="phoneExpenseNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.phoneExpense && <p className="mt-1 text-xs text-red-500">{errors.phoneExpense}</p>}
          <p className="text-sm text-gray-500 mt-1">If you are required to use personal devices, you can claim the work-related portion of internet & data expenses.</p>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">TOOLS & EQUIPMENT? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
          <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
          <p>Work-related tools, equipment and other assets needed for your job.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.toolsExpense || ''} 
            onValueChange={(value: string) => handleRadioChange('toolsExpense', value)}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="upTo5Items" id="toolsUpTo5" />
              <Label htmlFor="toolsUpTo5" className="cursor-pointer">Yes: up to 5 Items</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="upTo10Items" id="toolsUpTo10" />
              <Label htmlFor="toolsUpTo10" className="cursor-pointer">Yes: up to 10 Items</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="upTo20Items" id="toolsUpTo20" />
              <Label htmlFor="toolsUpTo20" className="cursor-pointer">Yes: up to 20 Items</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="toolsNo" />
              <Label htmlFor="toolsNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.toolsExpense && <p className="mt-1 text-xs text-red-500">{errors.toolsExpense}</p>}
          <p className="text-sm text-gray-500 mt-1">e.g. laptop, computer, hand-tools, goggles, calculator etc.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">OTHER WORK-RELATED EXPENSES? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
          <button type="button" className="text-blue-500" aria-label="TFN information">
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            <p>Any other work expenses not covered in previous categories.</p>
          </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.otherWorkExpenses || ''} 
              onValueChange={(value: string) => handleRadioChange('otherWorkExpenses', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="yes" id="otherWorkExpensesYes" />
          <Label htmlFor="otherWorkExpensesYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="no" id="otherWorkExpensesNo" />
          <Label htmlFor="otherWorkExpensesNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.otherWorkExpenses && <p className="mt-1 text-xs text-red-500">{errors.otherWorkExpenses}</p>}
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">PAID FOR INCOME PROTECTION INSURANCE? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
          <button type="button" className="text-blue-500" aria-label="TFN information">
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            <p>Premiums paid for insurance that replaces income if you can't work.</p>
          </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.incomeProtectionInsurance || ''} 
              onValueChange={(value: string) => handleRadioChange('incomeProtectionInsurance', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="yes" id="incomeProtectionYes" />
          <Label htmlFor="incomeProtectionYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="no" id="incomeProtectionNo" />
          <Label htmlFor="incomeProtectionNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.incomeProtectionInsurance && <p className="mt-1 text-xs text-red-500">{errors.incomeProtectionInsurance}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">DONATIONS of $2+? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
          <button type="button" className="text-blue-500" aria-label="TFN information">
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            <p>Donations to registered charities and deductible gift recipients.</p>
          </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.donations || ''} 
              onValueChange={(value: string) => handleRadioChange('donations', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="yes" id="donationsYes" />
          <Label htmlFor="donationsYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="no" id="donationsNo" />
          <Label htmlFor="donationsNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.donations && <p className="mt-1 text-xs text-red-500">{errors.donations}</p>}
            <p className="text-sm text-gray-500 mt-1">Must be made 'only' to Registered Charities & DGRs. e.g Red Cross, St Vincent DePaul, Bushfire Relief.</p>
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">TAX AGENT FEES PAID? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
          <button type="button" className="text-blue-500" aria-label="TFN information">
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            <p>Fees paid to tax agents for preparing previous year's tax return.</p>
          </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.taxAgentFees || ''} 
              onValueChange={(value: string) => handleRadioChange('taxAgentFees', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="yes" id="taxAgentFeesYes" />
          <Label htmlFor="taxAgentFeesYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="no" id="taxAgentFeesNo" />
          <Label htmlFor="taxAgentFeesNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.taxAgentFees && <p className="mt-1 text-xs text-red-500">{errors.taxAgentFees}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">PERSONAL SUPER CONTRIBUTION? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
          <button type="button" className="text-blue-500" aria-label="TFN information">
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            <p>Additional super contributions you've made from your after-tax income.</p>
          </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.superContribution || ''} 
              onValueChange={(value: string) => handleRadioChange('superContribution', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="yes" id="superContributionYes" />
          <Label htmlFor="superContributionYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="no" id="superContributionNo" />
          <Label htmlFor="superContributionNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.superContribution && <p className="mt-1 text-xs text-red-500">{errors.superContribution}</p>}
            <p className="text-sm text-gray-500 mt-1">(NOT EMPLOYER CONTRIBUTION)</p>
          </div>

          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">INTEREST EXPENSE? <span className="text-red-500">*</span></Label>
                <div className="group relative ml-2 inline-block">
                  <button type="button" className="text-blue-500" aria-label="TFN information">
                  <Info size={16} />
                  </button>
                  <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                    <p>Interest paid on loans used to purchase income-producing investments.</p>
                  </div>
                </div>
            </div>
            <RadioGroup 
              value={formData.interestExpense || ''} 
              onValueChange={(value: string) => handleRadioChange('interestExpense', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <RadioGroupItem value="yes" id="interestExpenseYes" />
                <Label htmlFor="interestExpenseYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <RadioGroupItem value="no" id="interestExpenseNo" />
                <Label htmlFor="interestExpenseNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.interestExpense && <p className="mt-1 text-xs text-red-500">{errors.interestExpense}</p>}
            <p className="text-sm text-gray-500 mt-1">For interest & /or borrowing expenses relating to income earned. DO NOT INCLUDE THE LOAN AMOUNT.</p>
          </div>
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">DID YOU WORK FROM HOME? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
                  <p>Expenses related to working from home including electricity, internet, etc.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.workFromHome || ''} 
            onValueChange={(value: string) => handleRadioChange('workFromHome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="workFromHomeYes" />
              <Label htmlFor="workFromHomeYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="workFromHomeNo" />
              <Label htmlFor="workFromHomeNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.workFromHome && <p className="mt-1 text-xs text-red-500">{errors.workFromHome}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormStep4;
