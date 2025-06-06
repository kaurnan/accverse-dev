import React, { useState } from 'react';
import { Label } from '../../ui/label';
import { FileUpload } from '../../ui/file-upload';
import { SignatureCapture } from '../../ui/signature-capture';
import { Checkbox } from '../../ui/checkbox';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface FormStep4Props {
  formData: {
    entityDocument: File | null;
    ownerIdDocument: File | null;
    signature: string;
    signature2: string;
    directorId: string;
    declarationAccepted: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  handleRadioChange?: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const FormStep4Business: React.FC<FormStep4Props> = ({ 
  formData, 
  handleChange, 
  handleFileChange, 
  handleRadioChange,
  errors 
}) => {
  const [signature, setSignature] = useState(formData.signature || '');
  const [signature2, setSignature2] = useState(formData.signature2 || '');
  
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
  
  const handleSignature2Change = (value: string | null) => {
    setSignature2(value || '');
    const event = {
      target: {
        name: 'signature2',
        value: value || ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };
  
  const handleEntityDocumentDrop = (file: File | null) => {
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event, 'entityDocument');
    }
  };
  
  const handleOwnerIdDocumentDrop = (file: File | null) => {
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event, 'ownerIdDocument');
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
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Part 4: Documents & Declaration</h2>
        <p className="text-gray-600 mt-1">Please upload required documents and sign the declaration.</p>
      </div>
      
      <div className="space-y-6">
        {/* Upload Documents */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload Required Documents</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="entityDocument" className="block text-gray-700 font-medium mb-2">
                Current Company Information / Trust Deed / Partnership Agreement
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Upload documents that verify your business entity structure</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <FileUpload
                id="entityDocument"
                name="entityDocument"
                value={formData.entityDocument}
                onChange={handleEntityDocumentDrop}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                error={errors.entityDocument}
              />
            </div>

            <div>
              <Label htmlFor="ownerIdDocument" className="block text-gray-700 font-medium mb-2">
                Photo IDs for each of the business' director / owner/ shareholder <span className="text-red-500">*</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Upload copies of Passport or Drivers License for verification purposes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <FileUpload
                id="ownerIdDocument"
                name="ownerIdDocument"
                value={formData.ownerIdDocument}
                onChange={handleOwnerIdDocumentDrop}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                error={errors.ownerIdDocument}
                required
              />
              {errors.ownerIdDocument && (
                <p className="mt-1 text-xs text-red-500">{errors.ownerIdDocument}</p>
              )}
            </div>

            {/* Director ID */}
            <div>
              <Label htmlFor="directorId" className="block text-gray-700 font-medium mb-2">
                Director ID
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">The unique identifier given to a director by the Australian Business Registry Services</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <input
                  type="text"
                  id="directorId"
                  name="directorId"
                  value={formData.directorId}
                  onChange={handleChange}
                  className={`w-full border ${errors.directorId ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                  placeholder="Enter Director ID number"
                  maxLength={20}
                />
                {errors.directorId && (
                  <p className="mt-1 text-xs text-red-500">{errors.directorId}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Declaration */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Declaration</h3>
          
          <div className="bg-gray-100 border-l-4 border-blue-500 rounded p-4 mb-6">
            <p className="text-sm">
              You hereby appoint Accverse to act as your bookkeeper, accountant &/or tax agent. We will add you to our tax agent portal and liaise with the ATO on your behalf regarding the specific service, as required.
            </p>
            <p className="text-sm mt-2">
              You declare that all the information you have provided to us is correct and complete to the best of your knowledge.
            </p>
            <p className="text-sm mt-2">
              Internet Transfer: You understand that once you transfer your accounting fees into our bank account, the specific service requested will be prepared and or lodged with the ATO and any refund due will be deposited directly into your nominated bank account by the ATO.
            </p>
            <p className="text-sm mt-2">
              Business Clients: You are required to submit this form in conjunction with our Engagement Letter. Please read our Engagement Letter, complete, sign and submit the last page of the Engagement Letter via this link.
            </p>
          </div>
          
          <div className="form-group mb-6">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="declarationAccepted"
                checked={formData.declarationAccepted === 'yes'}
                onCheckedChange={handleCheckboxChange}
                required
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

          {/* Signature 1 */}
          <div className="mb-6">
            <Label htmlFor="signature" className="block text-gray-700 font-medium mb-2">
              Owner / Director / Manager 1 Signature <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Draw your signature using your mouse or touch screen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <SignatureCapture
              id="signature"
              name="signature"
              value={signature}
              onChange={handleSignatureChange}
              required
              error={errors.signature}
            />
            {errors.signature && (
              <p className="mt-1 text-xs text-red-500">{errors.signature}</p>
            )}
          </div>

          {/* Signature 2 */}
          <div>
            <Label htmlFor="signature2" className="block text-gray-700 font-medium mb-2">
              Owner / Director / Manager 2 Signature
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 inline-block ml-1 text-blue-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Optional: Only required if there is a second person who needs to sign</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <SignatureCapture
              id="signature2"
              name="signature2"
              value={signature2}
              onChange={handleSignature2Change}
              error={errors.signature2}
            />
            {errors.signature2 && (
              <p className="mt-1 text-xs text-red-500">{errors.signature2}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep4Business;