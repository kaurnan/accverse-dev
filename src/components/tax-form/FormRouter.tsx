// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Button } from "../ui/button"
// import TaxSolutionsForm from "../TaxSolutionsForm"
// import BusinessTaxForm from "./BusinessTaxForm"
// import SMSFTaxForm from "./SMSFTaxForm"
// import EngagementLetterForm from "./EngagementLetterForm"
// import SMSFEstablishmentForm from "./SMSFEstablishmentForm"
// import CompanyRegistrationForm from "./CompanyRegistrationForm"
// import { toast } from "react-toastify"
// import { AlertCircle } from "lucide-react"
// import { useAuth } from "../AuthContext"

// /**
//  * Form router component that renders the appropriate form based on the form type parameter
//  * and handles form validation and submission
//  */
// const FormRouter: React.FC = () => {
//   const { formType } = useParams<{ formType: string }>()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(true)
//   const { isAuthenticated, checkAuth, loading: authLoading } = useAuth()
  
//   useEffect(() => {
//     // First check authentication
//     const verifyAuth = async () => {
//       if (authLoading) return;
      
//       const isAuthed = await checkAuth();
//       if (!isAuthed) {
//         toast.warning(
//           <div className="flex items-center gap-2">
//             <AlertCircle className="h-5 w-5 text-amber-500" />
//             <span>You must be logged in to access this form. Redirecting to login...</span>
//           </div>,
//           {
//             autoClose: 3000,
//             style: { background: "#fef3c7", borderLeft: "4px solid #f59e0b" },
//           }
//         );
        
//         // Redirect to login with return URL
//         navigate(`/login?returnTo=/tax-solutions/${formType}`);
//         return;
//       }
      
//     // Check if form type is valid
//     const validFormTypes = [
//       "individual",
//       "business",
//       "smsf",
//       "engagement",
//       "smsf-establishment",
//       "company-registration",
//     ]

//     if (formType && !validFormTypes.includes(formType)) {
//       toast.error(
//         <div className="flex items-center gap-2">
//           <AlertCircle className="h-5 w-5 text-red-500" />
//           <span>Invalid form type. Redirecting to form selection...</span>
//         </div>,
//         {
//           autoClose: 3000,
//           style: { background: "#fef2f2", borderLeft: "4px solid #ef4444" },
//         },
//       )

//       // Redirect to form selection after a short delay
//       setTimeout(() => {
//         navigate("/tax-forms")
//       }, 3000)
//     }

//     setLoading(false)
//   };
    
//   verifyAuth();
//   }, [formType, navigate, isAuthenticated, checkAuth, authLoading]);

//   // Render loading state
//   if (loading || authLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   // Render the appropriate form based on the formType
//   const renderForm = () => {
//     switch (formType) {
//       case "individual":
//         return <TaxSolutionsForm formType="individual" />
//       case "business":
//         return <BusinessTaxForm formType="business" />
//       case "smsf":
//         return <SMSFTaxForm formType="smsf" />
//       case "engagement":
//         return <EngagementLetterForm formType="engagement" />
//       case "smsf-establishment":
//         return <SMSFEstablishmentForm formType="smsf-establishment" />
//       case "company-registration":
//         return <CompanyRegistrationForm formType="company-registration" />
//       // Additional form types can be added here
//       default:
//         // If no valid form type is provided, render a message and return to form selection
//         return (
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Invalid Form Type</h2>
//             <p className="text-gray-600 mb-6">The requested form type is not available.</p>
//             <Button onClick={() => navigate("/tax-forms")}>Return to Form Selection</Button>
//           </div>
//         )
//     }
//   }

//   return renderForm()
// }

// export default FormRouter


"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import TaxSolutionsForm from "../TaxSolutionsForm"
import BusinessTaxForm from "./BusinessTaxForm"
import SMSFTaxForm from "./SMSFTaxForm"
import EngagementLetterForm from "./EngagementLetterForm"
import SMSFEstablishmentForm from "./SMSFEstablishmentForm"
import CompanyRegistrationForm from "./CompanyRegistrationForm"
import { toast } from "react-toastify"
import { AlertCircle } from "lucide-react"
import { useAuth } from "../AuthContext"

/**
 * Form router component that renders the appropriate form based on the form type parameter
 * and handles form validation and submission
 */
const FormRouter: React.FC = () => {
  const { formType } = useParams<{ formType: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, checkAuth, loading: authLoading } = useAuth()
  
  useEffect(() => {
    // First check authentication
    const verifyAuth = async () => {
      if (authLoading) return;
      
      const isAuthed = await checkAuth();
      
      // Now check if form type is valid
      const validFormTypes = [
        "individual",
        "business",
        "smsf",
        "engagement",
        "smsf-establishment",
        "company-registration",
      ]

      // Handle invalid form types first
      if (formType && !validFormTypes.includes(formType)) {
        toast.error(
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Invalid form type. Redirecting to form selection...</span>
          </div>,
          {
            autoClose: 3000,
            style: { background: "#fef2f2", borderLeft: "4px solid #ef4444" },
          }
        );

        // Redirect to form selection after a short delay
        setTimeout(() => {
          navigate("/tax-forms")
        }, 3000);
        
        setLoading(false);
        return;
      }
      
      // Handle authentication check
      if (!isAuthed) {
        toast.warning(
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>You must be logged in to access this form. Redirecting to login...</span>
          </div>,
          {
            autoClose: 3000,
            style: { background: "#fef3c7", borderLeft: "4px solid #f59e0b" },
          }
        );
        
        // Save current location for redirect after login
        const returnUrl = location.pathname;
        
        // Redirect to login with return URL
        navigate(`/login?returnTo=${returnUrl}`);
        return;
      }
      
      setLoading(false);
    };
    
    verifyAuth();
  }, [formType, navigate, isAuthenticated, checkAuth, authLoading, location.pathname]);

  // Render loading state
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Render the appropriate form based on the formType
  const renderForm = () => {
    switch (formType) {
      case "individual":
        return <TaxSolutionsForm formType="individual" />
      case "business":
        return <BusinessTaxForm formType="business" />
      case "smsf":
        return <SMSFTaxForm formType="smsf" />
      case "engagement":
        return <EngagementLetterForm formType="engagement" />
      case "smsf-establishment":
        return <SMSFEstablishmentForm formType="smsf-establishment" />
      case "company-registration":
        return <CompanyRegistrationForm formType="company-registration" />
      // Additional form types can be added here
      default:
        // If no valid form type is provided, render a message and return to form selection
        return (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Invalid Form Type</h2>
            <p className="text-gray-600 mb-6">The requested form type is not available.</p>
            <Button onClick={() => navigate("/tax-forms")}>Return to Form Selection</Button>
          </div>
        )
    }
  }

  return renderForm()
}

export default FormRouter
