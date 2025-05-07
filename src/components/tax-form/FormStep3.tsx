import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FileUpload } from '../ui/file-upload';

interface FormStep3Props {
  formData: any;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  handleFileDelete?: (fieldName: string) => void;
  errors: Record<string, string>;
}

const FormStep3: React.FC<FormStep3Props> = ({ 
  formData, 
  handleRadioChange,
  handleFileChange,
  handleFileDelete,
  errors
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 3: Taxable Income</h2>
        <p className="text-gray-600 mt-1">Answer applicable questions only, otherwise disregard.</p>
      </div>
      
      <div className="space-y-6">
        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">SALARY/WAGES? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Income information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income includes wages, salaries, commission, retainers, tips etc.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.salary || ''} 
            onValueChange={(value: string) => handleRadioChange('salary', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="salary" />
              <Label htmlFor="salary" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="salary" />
              <Label htmlFor="salary" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary}</p>}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">INTEREST INCOME? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Income information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income from bank accounts, term deposits, etc.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.interest || ''} 
            onValueChange={(value: string) => handleRadioChange('interest', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="interest" />
              <Label htmlFor="interest" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="interest" />
              <Label htmlFor="interest" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.interest && <p className="mt-1 text-xs text-red-500">{errors.interest}</p>}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">DIVIDENDS / DIVIDEND RE-INVESTMENTS INCOME? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Income information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income from share investments paid as dividends or reinvested.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.dividends || ''} 
            onValueChange={(value: string) => handleRadioChange('dividends', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="dividends" />
              <Label htmlFor="dividends" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="dividendsNo" />
              <Label htmlFor="dividendsNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.dividends && <p className="mt-1 text-xs text-red-500">{errors.dividends}</p>}
          <p className="text-sm text-gray-500 mt-1">Upload Dividend Statements, or Broker Statement for the FY</p>
          <FileUpload
            id="dividendStatements"
            name="dividendStatements"
            value={formData.dividendStatements}
            onChange={(file) => {
              // Create a synthetic event to use with handleFileChange
              const event = {
                target: {
                  files: [file]
                }
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleFileChange(event, 'dividendStatements');
            }}
            onDelete={handleFileDelete}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            label="Dividend Statements or Broker Statement"
            description="Upload your dividend or broker statements for the financial year."
            error={errors.dividendStatements}
          />
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">PARTNERSHIP / DECEASED ESTATE OR TRUST INCOME? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Income information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income from partnerships, trusts or deceased estates.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.partnership || ''} 
            onValueChange={(value: string) => handleRadioChange('partnership', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="partnership" />
              <Label htmlFor="partnership" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="partnershipNo" />
              <Label htmlFor="partnershipNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.partnership && <p className="mt-1 text-xs text-red-500">{errors.partnership}</p>}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">PERSONAL SERVICE INCOME? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Income information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income earned primarily from your skills or efforts as an individual.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.personalServiceIncome || ''} 
            onValueChange={(value: string) => handleRadioChange('personalServiceIncome', value)}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yesWithVehicle" id="personalServiceIncomeWithVehicle" />
              <Label htmlFor="personalServiceIncomeWithVehicle" className="cursor-pointer">Yes with Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yesNoVehicle" id="personalServiceIncomeNoVehicle" />
              <Label htmlFor="personalServiceIncomeNoVehicle" className="cursor-pointer">Yes with NO Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="personalServiceIncomeNo" />
              <Label htmlFor="personalServiceIncomeNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.personalServiceIncome && <p className="mt-1 text-xs text-red-500">{errors.personalServiceIncome}</p>}
          <p className="text-sm text-gray-500 mt-1">If yes with Motor Vehicle, please provide copies of the latest logbook (not more than 4 years old) and a signed declaration confirming the estimated Business/Private usage portion for the year.</p>
          {formData.personalServiceIncome === 'yesWithVehicle' && (
            <FileUpload
              id="personalServiceLogbook"
              name="personalServiceLogbook"
              value={formData.personalServiceLogbook}
              onChange={(file) => {
                const event = {
                  target: {
                    files: [file]
                  }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(event, 'personalServiceLogbook');
              }}
              onDelete={handleFileDelete}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              label="Logbook & Declaration (Personal Service)"
              description="Upload your latest logbook and signed declaration."
              error={errors.personalServiceLogbook}
              required
            />
          )}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">SOLE TRADER INCOME? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Income information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income from running your own business as a sole trader.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.soleTraderIncome || ''} 
            onValueChange={(value: string) => handleRadioChange('soleTraderIncome', value)}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yesWithVehicle" id="soleTraderIncomeYesWithVehicle" />
              <Label htmlFor="soleTraderIncomeYesWithVehicle" className="cursor-pointer">Yes with Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yesNoVehicle" id="soleTraderIncomeYesNoVehicle" />
              <Label htmlFor="soleTraderIncomeYesNoVehicle" className="cursor-pointer">Yes with No Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="soleTraderIncomeNo" />
              <Label htmlFor="soleTraderIncomeNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.soleTraderIncome && <p className="mt-1 text-xs text-red-500">{errors.soleTraderIncome}</p>}
          <p className="text-sm text-gray-500 mt-1">If yes with Motor Vehicle, please provide copies of the latest logbook (not more than 4 years old) and a signed declaration confirming the estimated Business/Private usage portion for the year.</p>
          {formData.soleTraderIncome === 'yesWithVehicle' && (
            <FileUpload
              id="soleTraderLogbook"
              name="soleTraderLogbook"
              value={formData.soleTraderLogbook}
              onChange={(file) => {
                const event = {
                  target: {
                    files: [file]
                  }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(event, 'soleTraderLogbook');
              }}
              onDelete={handleFileDelete}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              label="Logbook & Declaration (Sole Trader)"
              description="Upload your latest logbook and signed declaration."
              error={errors.soleTraderLogbook}
              required
            />
          )}
        </div>

        <div className="form-group">
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">SOLD SHARES, CRYPTO, ETFS, BONDS, OPTIONS etc? <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Capital gains or losses from selling investments.</p>
              </div>
            </div>
          </div>
          <RadioGroup 
            value={formData.soldInvestments || ''} 
            onValueChange={(value: string) => handleRadioChange('soldInvestments', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="soldInvestmentsYes" />
              <Label htmlFor="soldInvestmentsYes" className="cursor-pointer text-blue-700 font-medium">Yes - UPLOAD BUY & SELL ORDERS HISTORY</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="soldInvestmentsNo" />
              <Label htmlFor="soldInvestmentsNo" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {errors.soldInvestments && <p className="mt-1 text-xs text-red-500">{errors.soldInvestments}</p>}
          <p className="text-sm text-gray-500 mt-1">Do not hide as the ATO already collected data from Brokers/Exchanges.</p>
          {formData.soldInvestments === 'yes' && (
            <FileUpload
              id="soldInvestmentsFile"
              name="soldInvestmentsFile"
              value={formData.soldInvestmentsFile}
              onChange={(file) => {
                const event = {
                  target: {
                    files: [file]
                  }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(event, 'soldInvestmentsFile');
              }}
              onDelete={handleFileDelete}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              label="Buy & Sell Orders History"
              description="Upload your buy and sell orders history for the year."
              error={errors.soldInvestmentsFile}
              required
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">SOLD RENTAL PROPERTIES? <span className="text-red-500">*</span></Label>
          <div className="group relative ml-2 inline-block">
          <button type="button" className="text-blue-500" aria-label="TFN information">
            <Info size={16} />
          </button>
          <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
            <p>Capital gains or losses from selling investment properties.</p>
          </div>
          </div>
            </div>
            <RadioGroup 
              value={formData.soldRental || ''} 
              onValueChange={(value: string) => handleRadioChange('soldRental', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="yes" id="soldRentalYes" />
          <Label htmlFor="soldRentalYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
          <RadioGroupItem value="no" id="soldRentalNo" />
          <Label htmlFor="soldRentalNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.soldRental && <p className="mt-1 text-xs text-red-500">{errors.soldRental}</p>}
          </div>

            <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">FOREIGN INCOME SOURCES? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Any income earned overseas (rental, business, employment, etc.)</p>
              </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.foreignIncome || ''} 
              onValueChange={(value: string) => handleRadioChange('foreignIncome', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="foreignIncomeYes" />
              <Label htmlFor="foreignIncomeYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="foreignIncomeNo" />
              <Label htmlFor="foreignIncomeNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.foreignIncome && <p className="mt-1 text-xs text-red-500">{errors.foreignIncome}</p>}
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">INCOME FROM RENTAL PROPERTY YOU OWNED? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Rental income from investment properties.</p>
              </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.rentalIncome || ''} 
              onValueChange={(value: string) => handleRadioChange('rentalIncome', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="rentalIncomeYes" />
              <Label htmlFor="rentalIncomeYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="rentalIncomeNo" />
              <Label htmlFor="rentalIncomeNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.rentalIncome && <p className="mt-1 text-xs text-red-500">{errors.rentalIncome}</p>}
            {formData.rentalIncome === 'yes' && (
              <FileUpload
                id="rentalIncomeFile"
                name="rentalIncomeFile"
                value={formData.rentalIncomeFile}
                onChange={(file) => {
                  const event = {
                    target: {
                      files: [file]
                    }
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleFileChange(event, 'rentalIncomeFile');
                }}
                onDelete={handleFileDelete}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                label="Rental Property Statements"
                description="Upload your rental property income statements."
                error={errors.rentalIncomeFile}
                required
              />
            )}
            </div>

            <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">SHARING ECONOMY INCOME? e.g. Uber / Airbnb / Ola etc. <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income from gig economy platforms like Uber, Airbnb, Airtasker, etc.</p>
              </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.sharingEconomyIncome || ''} 
              onValueChange={(value: string) => handleRadioChange('sharingEconomyIncome', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="sharingEconomyIncomeYes" />
              <Label htmlFor="sharingEconomyIncomeYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="sharingEconomyIncomeNo" />
              <Label htmlFor="sharingEconomyIncomeNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.sharingEconomyIncome && <p className="mt-1 text-xs text-red-500">{errors.sharingEconomyIncome}</p>}
            {formData.sharingEconomyIncome === 'yes' && (
              <FileUpload
                id="sharingEconomyIncomeFile"
                name="sharingEconomyIncomeFile"
                value={formData.sharingEconomyIncomeFile}
                onChange={(file) => {
                  const event = {
                    target: {
                      files: [file]
                    }
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleFileChange(event, 'sharingEconomyIncomeFile');
                }}
                onDelete={handleFileDelete}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                label="Sharing Economy Income Statements"
                description="Upload your Uber, Airbnb, or other gig economy income statements."
                error={errors.sharingEconomyIncomeFile}
                required
              />
            )}
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">PENSION / ANNUITY INCOME FROM SUPERFUND? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Income from superannuation pensions or annuities.</p>
              </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.pensionIncome || ''} 
              onValueChange={(value: string) => handleRadioChange('pensionIncome', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="pensionIncomeYes" />
              <Label htmlFor="pensionIncomeYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="pensionIncomeNo" />
              <Label htmlFor="pensionIncomeNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.pensionIncome && <p className="mt-1 text-xs text-red-500">{errors.pensionIncome}</p>}
            </div>

            <div className="form-group">
            <div className="flex items-center mb-2">
              <Label className="block text-gray-700 font-medium">RECEIVED SHARES UNDER EMPLOYEE SHARE SCHEMES (ESS)? <span className="text-red-500">*</span></Label>
              <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Shares or options received as part of employee benefits.</p>
              </div>
              </div>
            </div>
            <RadioGroup 
              value={formData.employeeShareScheme || ''} 
              onValueChange={(value: string) => handleRadioChange('employeeShareScheme', value)}
              className="flex flex-row space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="employeeShareSchemeYes" />
              <Label htmlFor="employeeShareSchemeYes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="employeeShareSchemeNo" />
              <Label htmlFor="employeeShareSchemeNo" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
            {errors.employeeShareScheme && <p className="mt-1 text-xs text-red-500">{errors.employeeShareScheme}</p>}
            </div>
            </div>

            <div className="form-group">
            <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">OTHER INCOME NOT LISTED e.g. Centrelink income etc. <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="TFN information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Any other income not covered by the categories above.</p>
              </div>
            </div>
            </div>
            <RadioGroup 
            value={formData.otherIncome || ''} 
            onValueChange={(value: string) => handleRadioChange('otherIncome', value)}
            className="flex flex-row space-x-4 mt-2"
            >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="yes" id="otherIncomeYes" />
              <Label htmlFor="otherIncomeYes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              <RadioGroupItem value="no" id="otherIncomeNo" />
              <Label htmlFor="otherIncomeNo" className="cursor-pointer">No</Label>
            </div>
            </RadioGroup>
            {errors.otherIncome && <p className="mt-1 text-xs text-red-500">{errors.otherIncome}</p>}
          </div>
      </div>
    </div>
  );
};

export default FormStep3;
