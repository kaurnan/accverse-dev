
"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import EngagementLetterForm from "../components/tax-form/EngagementLetterForm"
import { Button } from "../components/ui/button"
import { ArrowLeft } from "lucide-react"
// import { saveEngagementLetter } from "../services/tax-form-service"
import { useToast } from "../hooks/use-toast"
// FIX: Import only EngagementLetterData from types, define FormData locally to match EngagementLetterForm
import type { EngagementLetterData } from "../types/form-types"
import { ensureCorrectFormType } from "../types/form-types"
// Define FormData type here to match EngagementLetterForm's expectations
type FormData = {
  businessName?: string
  entityName?: string
  streetAddress?: string
  streetAddress2?: string
  city?: string
  state?: string
  postcode?: string
  entityType?: string
  formType?: string
  engagementLetter?: EngagementLetterData | null
  [key: string]: any
  // Add any other fields as needed
}

const EngagementLetterPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [formType, setFormType] = useState<string>("tax_business")
  const [returnPath, setReturnPath] = useState<string>("/tax-solutions/business")
  const [currentStep, setCurrentStep] = useState<number | null>(null)

  useEffect(() => {
    // Get current step from URL or state if available
    const stepParam = searchParams.get("currentStep")
    if (stepParam && !isNaN(Number.parseInt(stepParam))) {
      setCurrentStep(Number.parseInt(stepParam))
    } else if (location.state?.currentStep) {
      setCurrentStep(location.state.currentStep)
    }

    // Determine the form type based on the state passed from the calling page
    if (location.state?.businessFormData) {
      // setFormData(location.state.businessFormData)
      const businessData =location.state.businessFormData;
      // setFormType(location.state.businessFormData.formType || "tax_business")
      const incomingFormType = businessData.formType || "tax_business";
      setFormType(incomingFormType);
      setFormData(businessData);
      console.log("EngagementLetterPage: Setting form type from business data:", incomingFormType);
      
      setReturnPath("/tax-solutions/business")
      if (location.state.currentStep) {
        setCurrentStep(location.state.currentStep)
      }
    } else if (location.state?.smsfFormData) {
      // setFormData(location.state.smsfFormData)
      // setFormType("smsf")
      const smsfData = location.state.smsfFormData;
      setFormData(smsfData)
      setFormType(smsfData.formType || "smsf")
      setReturnPath("/tax-solutions/smsf")
      if (location.state.currentStep) {
        setCurrentStep(location.state.currentStep)
      }
    } else if (location.state?.individualFormData) {
      // Handle the individual form (which includes sole traders)
      // setFormData(location.state.individualFormData)
      // setFormType("individual")
      const individualData = location.state.individualFormData;
      setFormData(individualData)
      setFormType(individualData.formType || "individual")
      setReturnPath("/tax-solutions/")
      if (location.state.currentStep) {
        setCurrentStep(location.state.currentStep)
      }
    }
    console.log("EngagementLetterPage: State received:", location.state)

  }, [location.state, searchParams])

  const handleFormComplete = async (updatedFormData: FormData) => {
    console.log("Engagement letter completed with data:", updatedFormData)

    try {
      // Save engagement letter data if needed
      // if (updatedFormData.engagementLetter) {
      //   try {
      //     await saveEngagementLetter(updatedFormData.engagementLetter)
      //   } catch (error) {
      //     console.error("Error saving engagement letter:", error)
      //     // Show warning but continue - the form data will still be passed back
      //     toast({
      //       title: "Warning",
      //       description: "There was a server error saving the engagement letter. Your information is still accepted and you may continue.",
      //       variant: "warning",
      //     })
      //   }
      // }

      // Navigate back to the form with the current step preserved
      const finalFormData = ensureCorrectFormType ({
        ...updatedFormData,
        formType: formType || updatedFormData.formType || "tax_business"
      });
      console.log("Preserving form type in engagement letter return:", finalFormData.formType);

      const queryParams = new URLSearchParams()
      queryParams.append("fromEngagement", "true")
      queryParams.append("engagementCompleted", "true")
      if (currentStep !== null) {
        queryParams.append("returnedStep", currentStep.toString())
      }
      queryParams.append("preserveFormType", finalFormData.formType)
      // Pass the updated form data and return to the same step
      navigate(`${returnPath}?${queryParams.toString()}`, {
        state: { 
          updatedFormData: finalFormData,
          currentStep: currentStep ,
          formType: finalFormData.formType // This ensures we return to the same step
        }
      })
    } catch (error: any) {
      console.error("Error in form completion flow:", error)
      // Still navigate back even if there's an error
      const queryParams = new URLSearchParams()
      queryParams.append("fromEngagement", "true")
      queryParams.append("engagementCompleted", "true")
      if (currentStep !== null) {
        queryParams.append("returnedStep", currentStep.toString())
      }
      queryParams.append("preserveFormType", formType || "tax_business")
      navigate(`${returnPath}?${queryParams.toString()}`, {
        state: { 
          updatedFormData: ensureCorrectFormType({
            ...formData,
            formType: formType || "tax_business"
          }),
          currentStep: currentStep,
          formType: formType || "tax_business"
        }
      })
    }
  }

  const handleBackClick = () => {
    // When clicking back, return to the same step we came from
    const queryParams = new URLSearchParams()
    if (currentStep !== null) {
      queryParams.append("currentStep", currentStep.toString())
    }
    queryParams.append("preserveFormType", formType || "tax_business")
    navigate(`${returnPath}?${queryParams.toString()}`, {
      state: { currentStep: currentStep, formType: formType || "tax_business" }
    })
  }

  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <Button variant="outline" onClick={handleBackClick} className="mb-6 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Form
      </Button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <h1 className="text-xl font-semibold">Engagement Letter</h1>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            <strong>Important:</strong> Please complete this engagement letter before submitting your tax form. This is
            a required step in the process.
          </p>
        </div>
      </div>

      {formData ? (
        <EngagementLetterForm formData={formData} setFormData={setFormData} onComplete={handleFormComplete} />
      ) : (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 mb-4">No form data available. Please return to the form and try again.</p>
          <Button onClick={handleBackClick}>Return to Form</Button>
        </div>
      )}
    </div>
  )
}

export default EngagementLetterPage
