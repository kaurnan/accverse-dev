
import React from 'react';
import { Link } from 'react-router-dom';
import SMSFTaxForm from '../components/tax-form/SMSFTaxForm';
import { Button } from '../components/ui/button';
import { ArrowLeft, Building2, FileText, CheckCircle2, AlertCircle, LucideShield } from 'lucide-react';

const SMSFTaxFormPage = () => {
  return (
    <div className="container my-12 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link to="/tax-forms">
          <Button variant="outline" className="mb-4 flex items-center gap-2 border-purple-200 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4" /> Back to Forms
          </Button>
        </Link>
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-100 to-purple-200 rounded-full mb-3">
            <Building2 className="h-6 w-6 text-blue-700" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">New SMSF Client Form</h1>
          <p className="text-gray-600 text-lg">Self-Managed Superannuation Fund</p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Guide to complete this form
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start hover-scale transition-transform duration-200">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span>Complete this form for each entity if you need us to act for multiple SMSFs.</span>
              </li>
              <li className="flex items-start hover-scale transition-transform duration-200">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span>Answer all applicable questions by selecting "Yes" or "No" in the dropbox, provide details & upload supporting documents. Drag & drop if you're using a desktop computer, otherwise, locate relevant files & upload via mobile or desktop.</span>
              </li>
              <li className="flex items-start hover-scale transition-transform duration-200">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span>Identify and provide the information we need to prepare your SMSF Financial Statements.</span>
              </li>
              <li className="flex items-start hover-scale transition-transform duration-200">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span>Please send us the relevant documents for all the investments in your SMSF.</span>
              </li>
              <li className="flex items-start hover-scale transition-transform duration-200">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span><span className="text-blue-600 font-medium">Important:</span> You can <strong className="text-blue-600">SAVE</strong> your progress and <strong className="text-blue-600">RESUME</strong> the form anytime.</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start hover-scale transition-transform duration-200">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <LucideShield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-600">Mandatory fields are marked with an asterisk (*)</h3>
                <p className="text-blue-600 text-sm">Your information is secure and encrypted. Banking details are protected.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 animate-fade-in">
          <SMSFTaxForm />
        </div>
      </div>
    </div>
  );
};

export default SMSFTaxFormPage;
