import React from 'react';
import { FormData } from '../../types/form-types';
import { FileText } from 'lucide-react';
import EngagementLetterForm from './EngagementLetterForm';

interface EngagementLetterStepProps {
  formData: FormData;
  handleFormDataChange: (data: FormData) => void;
  onComplete: () => void;
}

export const EngagementLetterStep = ({ formData, handleFormDataChange, onComplete }: EngagementLetterStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Engagement Letter
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Please complete the engagement letter before proceeding with your submission.
          </p>
          <EngagementLetterForm 
            formData={formData} 
            setFormData={handleFormDataChange}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default EngagementLetterStep;