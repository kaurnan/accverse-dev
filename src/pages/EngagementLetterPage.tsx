
import React from 'react';
import { Link } from 'react-router-dom';
import EngagementLetterForm from '../components/tax-form/EngagementLetterForm';
import { Button } from '../components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';

const EngagementLetterPage = () => {
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
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Engagement Letter</h1>
          <p className="text-gray-600">For All Business Clients</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Important Information
            </h2>
          </div>
          <div className="p-6 bg-white">
            <p className="mb-4 text-gray-700">This letter is to be submitted in conjunction with our Sole Trader / Business clients Intake Tax Checklist Forms.</p>
            <p className="text-gray-700">By signing this letter, you acknowledge and agree to the terms of engagement with Accverse for tax and accounting services.</p>
          </div>
        </div>
        
        <EngagementLetterForm />
      </div>
    </div>
  );
};

export default EngagementLetterPage;
