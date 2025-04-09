import React, { useState } from 'react';
import { Label } from '../ui/label';
import { FileUpload } from '../ui/file-upload';
import { SignatureCapture } from '../ui/signature-capture';
import { Checkbox } from '../ui/checkbox';
import { HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface FormStep5Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  handleRadioChange?: (name: string, value: string) => void;
  formData: {
    supportingDocs?: File | null;
    signature: string;
    declarationAccepted?: string;
    [key: string]: any;
  };
  errors: Record<string, string>;
}

const FormStep5: React.FC<FormStep5Props> = ({ handleChange, handleFileChange, handleRadioChange, formData, errors }) => {
  const [signature, setSignature] = useState(formData.signature || '');
  
  const handleSignatureChange = (value: string | null) => {
    setSignature(value || '');
    // Create a synthetic event to use with handleChange
    const event = {
      target: {
        name: 'signature',
        value: value || ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
  };
  
  const handleFileDrop = (file: File | null) => {
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event, 'supportingDocs');
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    if (handleRadioChange) {
      handleRadioChange('declarationAccepted', checked ? 'yes' : 'no');
    } else {
      const event = {
        target: {
          name: 'declarationAccepted',
          value: checked ? 'yes' : 'no'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(event);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 5: Declaration</h2>
        <p className="text-gray-600 mt-1">Please review the checklist to ensure all information is provided and supporting documents uploaded.</p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-md mb-6 border-l-4 border-purple-500">
        <h3 className="font-semibold text-blue-800 mb-4">DECLARATION:</h3>
        <p className="mb-4 text-gray-700">You declare all information is correct and complete to the best of your knowledge.</p>
        <p className="mb-4 text-gray-700">You appoint Accverse as your tax agent and accountant (Agent No: 26274335). We will add you to our tax agent portal and liaise with the <span className="group relative inline-block">
          ATO
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-40 text-center">
            Australian Taxation Office
          </span>
        </span> on your behalf.</p>
        
        <h3 className="font-semibold mt-6 mb-2 text-blue-800">Internet Transfer:</h3>
        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
          <li>Individual Clients: You understand that after transferring our fees we will prepare and lodge your tax return with the ATO, and any refund will go directly to your nominated bank account.</li>
          <li>Business & Sole Trader Clients: Kindly submit this form with our Engagement Letter. Read, complete, sign, and submit the last page of the Engagement Letter via the hyperlink.</li>
        </ul>
      </div>
      
      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <Label className="block text-gray-700 font-medium">Supporting Documents</Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Supporting Documents information">
              <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              <p>Upload any relevant tax documents like group certificates, receipts, and supporting evidence for your claims.</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Upload relevant tax documents (Group certificates, receipts, etc.)</p>
          <FileUpload 
            id="supportingDocs"
            name="supportingDocs"
            value={formData.supportingDocs as File | null}
            onChange={handleFileDrop}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            tooltip="You can upload multiple documents related to your tax return, including group certificates, receipts, and other supporting evidence."
            error={errors?.supportingDocs}
          />
        </div>
        
        <div className="form-group mb-6">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="declarationAccepted"
              checked={formData.declarationAccepted === 'yes'}
              onCheckedChange={handleCheckboxChange}
            />
            <Label 
              htmlFor="declarationAccepted" 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              I have read and agree to the declaration above <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors.declarationAccepted && (
            <p className="mt-1 text-xs text-red-500 pl-7">{errors.declarationAccepted}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <Label htmlFor="signature" className="block text-gray-700 font-medium">Signature <span className="text-red-500">*</span></Label>
            <div className="group relative ml-2 inline-block">
              <button type="button" className="text-blue-500" aria-label="Signature information">
          <Info size={16} />
              </button>
              <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
          <p>Sign using your mouse or touch screen to confirm your declaration.</p>
              </div>
            </div>
          </div>
          <SignatureCapture
            id="signature"
            name="signature"
            value={signature}
            onChange={handleSignatureChange}
            required
            error={errors?.signature}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStep5;