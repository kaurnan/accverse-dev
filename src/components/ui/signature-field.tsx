import React, { useState } from 'react';
import { Label } from './label';
import { SignatureCapture } from './signature-capture';

interface SignatureFieldProps {
  id: string;
  name?: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export const SignatureField: React.FC<SignatureFieldProps> = ({
  id,
  name = id,
  label = "Signature",
  value = '',
  onChange,
  required = false,
  error
}) => {
  const handleSignatureChange = (newValue: string | null) => {
    onChange(newValue || '');
  };
  
  return (
    <div className="w-full">
      <SignatureCapture
        id={id}
        name={name}
        value={value}
        onChange={handleSignatureChange}
        label={label}
        required={required}
        error={error}
      />
      
      <input
        type="hidden"
        id={`${id}-hidden`}
        name={name}
        value={value || ''}
        onChange={() => {}}
      />
    </div>
  );
};
