
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Info, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  id: string;
  name: string;
  accept?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  multiple?: boolean;
  maxSize?: number;
  error?: string;
  tooltip?: string;
  description?: string;
  className?: string;
  required?: boolean;
}

export function FileUpload({ 
  id, 
  name, 
  accept = 'image/*,application/pdf', 
  value, 
  onChange, 
  label, 
  multiple = false, 
  maxSize = 5242880, // 5MB default
  error,
  tooltip,
  description,
  className,
  required
}: FileUploadProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onChange(file);
      
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept ? accept.split(',').reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {} as Record<string, string[]>) : undefined,
    multiple,
    maxSize,
    onDragEnter: () => setIsDraggingOver(true),
    onDragLeave: () => setIsDraggingOver(false)
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setFilePreview(null);
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 font-medium text-sm flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      <div 
        className={cn(
          "relative group",
          className
        )}
      >
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ease-in-out cursor-pointer hover:border-primary",
            {
              "bg-blue-50 border-blue-300": isDragActive || isDraggingOver,
              "bg-red-50 border-red-500": isDragReject,
              "bg-gray-50 border-gray-300": !isDragActive && !isDragReject && !isDraggingOver,
              "border-red-500": !!error
            }
          )}
        >
          <input {...getInputProps({ id, name })} required={required} />
          
          <div className="flex flex-col items-center justify-center py-4">
            {value ? (
              <div className="flex items-center gap-2 w-full">
                {filePreview ? (
                  <div className="relative w-12 h-12 mr-2">
                    <img src={filePreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                  </div>
                ) : (
                  <FileText className="h-8 w-8 text-blue-500" />
                )}
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">{value.name}</p>
                  <p className="text-xs text-gray-500">{(value.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-blue-600 mb-2" />
                <p className="text-sm text-center mb-2">
                  {isDragActive ? (
                    isDragReject ? "File type not accepted" : "Drop the file here"
                  ) : (
                    <>
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      <br />
                      <span className="text-xs text-gray-500 block mt-1">
                        {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
                      </span>
                    </>
                  )}
                </p>
                {description && (
                  <p className="text-xs text-gray-500 mt-1 text-center">{description}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        {tooltip && (
          <div className="group relative">
            <button
              type="button"
              className="absolute right-3 top-3 text-blue-500"
              aria-label="Show information"
              tabIndex={-1}
            >
              <Info size={16} />
            </button>
            <div className="absolute z-50 right-0 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
