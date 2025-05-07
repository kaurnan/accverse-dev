
import React from 'react';
import { Link } from 'react-router-dom';
import SMSFEstablishmentForm from '../components/tax-form/SMSFEstablishmentForm';
import { Button } from '../components/ui/button';
import { ArrowLeft, Shield, FileCheck, AlertTriangle } from 'lucide-react';

const SMSFEstablishmentPage = () => {
  return (
    <div className="container my-12 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link to="/tax-forms">
          <Button variant="outline" className="mb-4 flex items-center gap-2 border-purple-200 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </Button>
        </Link>
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">SMSF Establishment Form</h1>
          <p className="text-gray-600">Set up a new Self-Managed Superannuation Fund</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden border-2 border-blue-100 transition-all duration-300 hover:border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Guide to completing this form
            </h2>
          </div>
          <div className="p-6 bg-white">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-gray-700">
                This form includes CAPTCHA verification to protect your data and prevent automated submissions. Please complete the verification when prompted.
              </p>
            </div>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Complete all required fields to establish your new Self-Managed Superannuation Fund.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Upload any necessary identification documents for all members and trustees.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Review the trustee declaration and confirm you understand your responsibilities.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">🔍</span>
                <span className="text-gray-700">Once submitted, our team will process your application and contact you for any additional information.</span>
              </li>
            </ul>
          </div>
        </div>
        <SMSFEstablishmentForm formType={'smsf-establishment'} />
        {/* <SMSFEstablishmentForm formType={''} /> */}
      </div>
    </div>
  );
};

export default SMSFEstablishmentPage;
