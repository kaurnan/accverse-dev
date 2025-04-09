
import React from 'react';
import { Link } from 'react-router-dom';
import CompanyRegistrationForm from '../components/tax-form/CompanyRegistrationForm';
import { Button } from '../components/ui/button';
import { Building2, ArrowLeft, FileCheck } from 'lucide-react';

const CompanyRegistrationPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link to="/tax-forms">
          <Button variant="outline" className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </Button>
        </Link>
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Company Registration Checklist</h1>
          <p className="text-gray-600">Complete this form to register a new company with ASIC</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Guide to completing this form
            </h2>
          </div>
          <div className="p-6 bg-white">
            <p className="mb-4 text-gray-700">This form collects the information needed to register a new company with ASIC and apply for an ABN.</p>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Provide complete and accurate information for all company details.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Ensure you include all required officeholder and shareholder information.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Upload identification documents for all directors and shareholders.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Review all information carefully before submission to avoid processing delays.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <CompanyRegistrationForm />
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
