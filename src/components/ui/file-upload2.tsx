
import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
  id: string;
  name?: string;
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  maxSizeMB?: number;
  className?: string;
  tooltip?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  name = id,
  label,
  value,
  onChange,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  error,
  helper,
  required = false,
  maxSizeMB = 10,
  className = "",
  tooltip,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const [dragCounter, setDragCounter] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }
    
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds the maximum allowed size (${maxSizeMB}MB)`);
      return;
    }
    
    // Check if file type is accepted
    if (accept) {
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const acceptedTypes = accept.split(',');
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        } else {
          return fileType.match(new RegExp(type.replace('*', '.*')));
        }
      });
      
      if (!isAccepted) {
        alert(`File type not accepted. Please upload one of these formats: ${accept}`);
        return;
      }
    }
    
    onChange(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prevCount => prevCount + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prevCount => prevCount - 1);
    
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const file = e.dataTransfer.files?.[0] || null;
    validateAndProcessFile(file);
  };

  const handleDelete = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`${className} mb-4`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400"
        } ${isDragging ? "animate-pulse" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        aria-labelledby={`${id}-label`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={name}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          required={required && !value}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {value ? (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded animate-fade-in">
            <div className="flex items-center">
              <File className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm truncate max-w-xs">{value.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({(value.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
            <div className="text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              {accept.replace(/\./g, '').split(',').map(ext => ext.toUpperCase()).join(', ')} (Max {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {helper && !error && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
      {error && (
        <div className="flex items-center mt-1">
          <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
          <p id={`${id}-error`} className="text-xs text-red-500">{error}</p>
        </div>
      )}
      
      {tooltip && (
        <div className="mt-1 text-xs text-gray-500 italic">
          {tooltip}
        </div>
      )}
    </div>
  );
};
