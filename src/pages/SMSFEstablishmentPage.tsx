import React from 'react';
import { Link } from 'react-router-dom';
import SMSFEstablishmentForm from '../components/tax-form/SMSFEstablishmentForm';
import { Button } from '../components/ui/button';

const SMSFEstablishmentPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4">
        <Link to="/tax-forms">
          <Button variant="outline" className="mb-4">
            ← Back to Forms
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">SMSF Establishment Form</h1>
          <p className="text-gray-600">Set up a new Self-Managed Superannuation Fund</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Guide to completing this form</h2>
          </div>
            <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <ul className="list-none pl-5 space-y-2">
              <li>🔍 Complete all required fields to establish your new Self-Managed Superannuation Fund.</li>
              <li>🔍 Upload any necessary identification documents for all members and trustees.</li>
              <li>🔍 Review the trustee declaration and confirm you understand your responsibilities.</li>
              <li>🔍 Once submitted, our team will process your application and contact you for any additional information.</li>
            </ul>
            </div>
        </div>
        
        <SMSFEstablishmentForm />
      </div>
    </div>
  );
};

export default SMSFEstablishmentPage;