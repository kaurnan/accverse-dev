
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { FileUpload } from '../ui/file-upload';
import { SignatureField } from '../ui/signature-field';

interface FormStep5Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  formData: {
    supportingDocs?: File | null;
    signature: string;
    [key: string]: any;
  };
  errors: Record<string, string>;
}

const FormStep5: React.FC<FormStep5Props> = ({ handleChange, handleFileChange, formData, errors }) => {
  const [signature, setSignature] = useState(formData.signature || '');
  
  const handleSignatureChange = (value: string) => {
    setSignature(value);
    // Create a synthetic event to use with handleChange
    const event = {
      target: {
        name: 'signature',
        value
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
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Part 5: Declaration</h2>
      <p className="text-gray-600 mb-6">Please review the checklist to ensure all information is provided and supporting documents uploaded using the file upload area. This checklist is not exhaustive, please email us any additional relevant information.</p>
      
      <div className="bg-gray-50 p-6 rounded-md mb-6 border-l-4 border-purple-500">
        <h3 className="font-semibold mb-4 text-gray-800">DECLARATION:</h3>
        <p className="mb-4 text-gray-700">You declare all information is correct and complete to the best of your knowledge.</p>
        <p className="mb-4 text-gray-700">You appoint Accverse as your tax agent and accountant (Agent No: 26274335). We will add you to our tax agent portal and liaise with the <span className="group relative inline-block">
          ATO
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-40 text-center">
            Australian Taxation Office
          </span>
        </span> on your behalf.</p>
        
        <h3 className="font-semibold mt-6 mb-2 text-gray-800">Internet Transfer:</h3>
        <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
          <li>Individual Clients: You understand that after transferring our fees we will prepare and lodge your tax return with the ATO, and any refund will go directly to your nominated bank account.</li>
          <li>Business & Sole Trader Clients: Kindly submit this form with our Engagement Letter. Read, complete, sign, and submit the last page of the Engagement Letter via the hyperlink.</li>
        </ul>
      </div>
      
      <div className="mt-6 space-y-6">
        <div>
          <Label className="block mb-2 font-medium">Supporting Documents</Label>
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
        
        <div>
          <SignatureField
            id="signature"
            label="Signature"
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
