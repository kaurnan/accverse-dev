// import { Link } from "react-router-dom"
// import BusinessTaxForm from "../components/tax-form/BusinessTaxForm"
// import { Button } from "../components/ui/button"
// import { Building, ArrowLeft, CheckCircle2, AlertCircle, FileText } from "lucide-react"

// const BusinessTaxFormPage = () => {
//   return (
//     <div className="container my-12 max-w-4xl mx-auto px-4">
//       <div className="mb-6">
//         <Link to="/tax-forms">
//           <Button variant="outline" className="mb-4 flex items-center gap-2 border-purple-200 hover:bg-purple-50">
//             <ArrowLeft className="h-4 w-4" /> Back to Forms
//           </Button>
//         </Link>
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full mb-3">
//             <Building className="h-6 w-6 text-purple-700" />
//           </div>
//           <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
//             New Business Client Form
//           </h1>
//           <p className="text-gray-600 text-lg">For Companies, Trusts & Partnerships</p>
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
//           <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <FileText className="h-6 w-6" />
//               Guide to complete this form
//             </h2>
//           </div>
//           <div className="p-6">
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
//                 <span>
//                   <span className="text-purple-600 font-medium">New Business Client?</span> Kindly Nominate us as your
//                   Tax & GST agent by following the steps via this link. It is an ATO requirement effective from
//                   13/11/2023.
//                 </span>
//               </li>
//               <li className="flex items-start">
//                 <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
//                 <span>
//                   The following guide helps you complete this form correctly & efficiently. Please{" "}
//                   <strong className="text-purple-600">Do not rush/submit insufficient information</strong>. You can{" "}
//                   <strong className="text-purple-600">SAVE</strong> and{" "}
//                   <strong className="text-purple-600">RESUME</strong> the form anytime.
//                 </span>
//               </li>
//               <li className="flex items-start">
//                 <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
//                 <span>
//                   Complete this form for each entity per financial year, if you need us to act for multiple entities.
//                 </span>
//               </li>
//               <li className="flex items-start">
//                 <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
//                 <span>
//                   Answer all applicable questions by selecting "Yes" or "No" in the dropbox, provide details & upload
//                   supporting documents.
//                 </span>
//               </li>
//               <li className="flex items-start">
//                 <AlertCircle className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
//                 <span>
//                   This form is to be submitted in conjunction with our Engagement Letter.
//                   <Link to="/tax-solutions/engagement" className="ml-2 text-blue-600 font-medium hover:underline">
//                     Complete Engagement Letter
//                   </Link>
//                 </span>
//               </li>
//             </ul>

//             <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
//               <div className="bg-blue-100 p-2 rounded-full mr-4">
//                 <AlertCircle className="h-5 w-5 text-blue-600" />
//               </div>
//               <div>
//                 <h3 className="font-medium text-blue-600">Mandatory fields are marked with an asterisk (*)</h3>
//                 <p className="text-blue-600 text-sm">
//                   Your information is secure and encrypted. Banking details are protected.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8">
//           <BusinessTaxForm />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BusinessTaxFormPage

import { Link, useLocation } from "react-router-dom"
import BusinessTaxForm from "../components/tax-form/BusinessTaxForm"
import { Button } from "../components/ui/button"
import { Building, ArrowLeft, CheckCircle2, AlertCircle, FileText } from "lucide-react"

const BusinessTaxFormPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formTypeParam = searchParams.get('formType') || 'business'
  
  // Determine the actual formType to use for the backend
  const getFormType = () => {
    if (formTypeParam === 'accounting') {
      return "accounting_services"; // Ensure we use accounting_services for accounting forms
    }
    return "tax_business"; // For regular business forms
  };
  
  // Determine title and subtitle based on formType
  const getPageDetails = () => {
    if (formTypeParam === 'accounting') {
      return {
        title: "VCFO Services Form",
        subtitle: "For Business Accounting & VCFO Services",
        gradientClass: "from-purple-600 to-indigo-600",
        backLink: "/accounting-services",
        backLinkText: "Back to Accounting Services"
      };
    }
    
    return {
      title: "New Business Client Form",
      subtitle: "For Companies, Trusts & Partnerships",
      gradientClass: "from-purple-600 to-blue-600",
      backLink: "/tax-forms",
      backLinkText: "Back to Forms"
    };
  };
  
  const pageDetails = getPageDetails();
  const formType = getFormType();
  
  console.log("BusinessTaxFormPage rendering with formType:", formType);

  return (
    <div className="container my-12 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <Link to={pageDetails.backLink}>
          <Button variant="outline" className="mb-4 flex items-center gap-2 border-purple-200 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4" /> 
            {pageDetails.backLinkText}
          </Button>
        </Link>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full mb-3">
            <Building className="h-6 w-6 text-purple-700" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${pageDetails.gradientClass}`}>
            {pageDetails.title}
          </h1>
          <p className="text-gray-600 text-lg">{pageDetails.subtitle}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className={`bg-gradient-to-r ${pageDetails.gradientClass} text-white p-6`}>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Guide to complete this form
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <span>
                  <span className="text-purple-600 font-medium">New {formTypeParam === 'accounting' ? 'Accounting' : 'Business'} Client?</span> Kindly Nominate us as your
                  {formTypeParam === 'accounting' ? ' Accountant' : ' Tax & GST agent'} by following the steps via this link. 
                  {formTypeParam !== 'accounting' && " It is an ATO requirement effective from 13/11/2023."}
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <span>
                  The following guide helps you complete this form correctly & efficiently. Please{" "}
                  <strong className="text-purple-600">Do not rush/submit insufficient information</strong>. You can{" "}
                  <strong className="text-purple-600">SAVE</strong> and{" "}
                  <strong className="text-purple-600">RESUME</strong> the form anytime.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <span>
                  Complete this form for each entity per financial year, if you need us to act for multiple entities.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <span>
                  Answer all applicable questions by selecting "Yes" or "No" in the dropbox, provide details & upload
                  supporting documents.
                </span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <span>
                  This form is to be submitted in conjunction with our Engagement Letter.
                  <Link to="/tax-solutions/engagement" className="ml-2 text-blue-600 font-medium hover:underline">
                    Complete Engagement Letter
                  </Link>
                </span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-600">Mandatory fields are marked with an asterisk (*)</h3>
                <p className="text-blue-600 text-sm">
                  Your information is secure and encrypted. Banking details are protected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <BusinessTaxForm formType={formType} />
        </div>
      </div>
    </div>
  )
}

export default BusinessTaxFormPage
