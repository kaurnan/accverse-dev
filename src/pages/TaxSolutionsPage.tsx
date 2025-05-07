import React from 'react';
import { Link } from 'react-router-dom';
import TaxSolutionsForm from '../components/TaxSolutionsForm';
import { Button } from '../components/ui/button';

const TaxSolutionsPage = () => {
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
    // No need to do anything here as the form component handles the redirect
  };

  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4">
        <Link to="/tax-forms">
          <Button variant="outline" className="mb-2">
        ← View All Tax Forms
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Tax Checklist</h1>
          <p className="text-gray-600">New Client Information Form - For Individuals & Sole Traders</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Guide to complete this form</h2>
          </div>
            <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <ol className="list-decimal pl-5 space-y-4">
                <li className="flex items-start">
                <span className="text-dark-blue mr-4 mt-1">🔍</span>
                <span>Gather all income & proof of paid work-related expenses for the FY.</span>
                </li>
                <li className="flex items-start">
                <span className="text-dark-blue mr-4 mt-1">🔍</span>
                <span>Complete this checklist for each FY, starting with the oldest FY if you have overdue tax lodgements. Do not provide data for multiple people & FYs in 1 submission.</span>
                </li>
                <li className="flex items-start">
                <span className="text-dark-blue mr-4 mt-1">🔍</span>
                <span>
                Kindly be honest & provide proof of the following, if applicable:
                <ul className="list-disc pl-8 mt-2 space-y-2">
                <li className="flex items-start">
                <span className="text-light-blue mr-4 mt-1">📌</span>
                <span>Sale of cryptos, shares, ETFs, bonds, & investment properties, etc.</span>
                </li>
                <li className="flex items-start">
                <span className="text-light-blue mr-4 mt-1">📌</span>
                <span>Contracting services: Sole trader or personal services income etc.</span>
                </li>
                <li className="flex items-start">
                <span className="text-light-blue mr-4 mt-1">📌</span>
                <span>Investment income: Dividends, rental, interest, crypto rewards, etc.</span>
                </li>
                <li className="flex items-start">
                <span className="text-light-blue mr-4 mt-1">📌</span>
                <span>Sharing economy income: Airbnb, Uber, Ola, Deliveroo, etc.</span>
                </li>
                </ul>
                </span>
                </li>
                <li className="flex items-start bg-yellow-100 p-2 rounded-md">
                <span className="text-dark-blue mr-4 mt-1">⭐</span>
                <span>Click <strong>'Save & Continue Later'</strong> to save your progress.</span>
                </li>
                <li className="flex items-start">
                <span className="text-dark-blue mr-4 mt-1">🔍</span>
              <span>Upon submission, your data will be securely stored in our database and our tax consultants will contact you within 24-48 business hours.</span>
              </li>
            </ol>
            </div>
        </div>
        
        <TaxSolutionsForm onSubmit={handleFormSubmit} formType="individual" />
      </div>
    </div>
  );
};

export default TaxSolutionsPage;
