import React, { useState } from 'react';
import { Label } from '../../ui/label';
import { SignatureCapture } from '../../ui/signature-capture';
import { Checkbox } from '../../ui/checkbox';

interface FormStep5SMSFProps {
  formData: {
    signature: string;
    declarationAccepted: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange?: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const FormStep5SMSF: React.FC<FormStep5SMSFProps> = ({ formData, handleChange, handleRadioChange, errors }) => {
  const [signature, setSignature] = useState(formData.signature || '');
  
  const handleSignatureChange = (value: string | null) => {
    setSignature(value || '');
    const event = {
      target: {
        name: 'signature',
        value: value || ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 5: Declaration</h2>
        <p className="text-gray-600 mt-1">Please read the declaration carefully and sign below.</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Declaration</h3>
          
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>You hereby appoint Accverse (Tax Agent Reg. No 26274335) to act as your accountant &/or tax agent.</strong> We will add you to our tax agent portal and liaise with the ATO on your behalf as required.
            </p>
            <p>
              You declare that all the information you have provided to us are correct and complete to the best of your knowledge.
            </p>
            <p>
              As Trustee of the Fund, you understand your obligations under self assessment to keep full and proper records for minimum 5 years
            </p>
            <p>
              <strong>Internet Transfer:</strong> You understand that once you transfer our SMSF accounting and tax fees into our bank account, your tax return will be lodged with the ATO and any refund due will be deposited directly into your nominated bank account by the ATO.
            </p>
          </div>
          
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Important note:</h4>
            <div className="space-y-2 text-gray-700">
              <p>
                We will send all the Financial Reports via docusign for digital signature. This eliminates the need for printing and scanning signed pages back to us. An email will be sent to you to notify once the reports are sent. Please look out for the email from Docusign.
              </p>
              <p>
                As per the section 35B of the SIS acts, the accounts and the financial statements must be signed by at least two Trustees. Please remember to provide us with at least two email addresses of the Trustees. We will send out the Docusign emails to those Trustees for digital signatures.
              </p>
            </div>
          </div>
        </div>

        <div className="form-group mb-6">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="declarationAccepted"
              checked={formData.declarationAccepted === 'yes'}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
              required
              error={errors.declarationAccepted}
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

        <div className="form-group">
          <Label htmlFor="signature" className="block text-gray-700 font-medium mb-2">
            Trustee Signature <span className="text-red-500">*</span>
          </Label>
          <SignatureCapture
            id="signature"
            name="signature"
            value={signature}
            onChange={handleSignatureChange}
            required
            error={errors.signature}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStep5SMSF;
