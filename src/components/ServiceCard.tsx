import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  link: string;
  color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description, 
  features, 
  link, 
  color 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50',
    green: 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50',
    orange: 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  const buttonColorClasses = {
    blue: 'text-blue-600 hover:bg-blue-100',
    green: 'text-green-600 hover:bg-green-100',
    purple: 'text-purple-600 hover:bg-purple-100',
    orange: 'text-orange-600 hover:bg-orange-100',
  };

  // Update links for specific services
  let finalLink = link;
  let formType = "business";
  if (title === "Accounting Solutions") {
    finalLink = "/accounting-services";
    formType = "accounting_services";
  } else if (title === "VCFO Services") {
    finalLink = "/tax-solutions/business?formType=accounting";
    formType = "accounting";
  } 
  // else if (title === "Bookkeeping and Payroll") {
  //   finalLink = "/tax-solutions/business?formType=accounting";
  // }

  return (
    <div className={`rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]} p-6 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1`}>
      <div className={`p-3 rounded-full w-14 h-14 flex items-center justify-center ${iconColorClasses[color as keyof typeof iconColorClasses]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-gray-400 mr-2 mt-0.5">•</span>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link 
        to={finalLink} 
        state={{ sourceFormType: formType }}
        className={`inline-flex items-center font-medium ${buttonColorClasses[color as keyof typeof buttonColorClasses]} mt-auto group`}
      >
        Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default ServiceCard;