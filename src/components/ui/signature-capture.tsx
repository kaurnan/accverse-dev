import React, { useState, useRef } from 'react';
import { FileText, Trash2, Edit3, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

interface SignatureCaptureProps {
  id: string;
  name: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
  className,
  required
}) => {
  const [mode, setMode] = useState<'type' | 'upload'>('type');
  const [typedSignature, setTypedSignature] = useState(value && !value.startsWith('data:image') ? value : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSignature = () => {
    setTypedSignature('');
    onChange(null);
  };

  const handleTypedSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedSignature(e.target.value);
    onChange(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex flex-col space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            type="button" 
            variant={mode === 'type' ? "default" : "outline"}
            size="sm"
            onClick={() => setMode('type')}
          >
            <Edit3 className="h-4 w-4 mr-1" /> Type Signature
          </Button>
          <Button 
            type="button" 
            variant={mode === 'upload' ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode('upload');
              setTimeout(() => fileInputRef.current?.click(), 0);
            }}
          >
            <Upload className="h-4 w-4 mr-1" /> Upload Signature
          </Button>
          
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {mode === 'type' && (
          <div className="border border-gray-300 rounded-md p-4">
            <input
              type="text"
              id={id}
              name={name}
              value={typedSignature}
              onChange={handleTypedSignatureChange}
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 bg-transparent"
              placeholder="Type your full name as signature"
              required={required}
            />
            {typedSignature && (
              <div className="mt-4 flex justify-center">
                <p className="text-2xl font-signature">{typedSignature}</p>
              </div>
            )}
          </div>
        )}

        {mode === 'upload' && value && value.startsWith('data:image') && (
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex justify-center">
              <img 
                src={value} 
                alt="Uploaded signature" 
                className="max-h-32 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click upload to change
            </p>
          </div>
        )}

        {mode === 'upload' && (!value || !value.startsWith('data:image')) && (
          <div className="border border-gray-300 rounded-md p-4 text-center">
            <p className="text-sm text-gray-500">
              Click the "Upload Signature" button to select an image file
            </p>
          </div>
        )}

        {value && (
          <div className="flex justify-end mt-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={clearSignature}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};