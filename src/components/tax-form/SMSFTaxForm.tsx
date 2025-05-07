"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Save, Send, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import FormStep1SMSF from "./smsf/FormStep1SMSF"
import FormStep2SMSF from "./smsf/FormStep2SMSF"
import FormStep3SMSF from "./smsf/FormStep3SMSF"
import FormStep4SMSF from "./smsf/FormStep4SMSF"
import FormStep5SMSF from "./smsf/FormStep5SMSF"
import { saveSMSFFormProgress, validateSMSFFormStep, submitSMSFForm } from "../../actions/smsf-form-actions"
import { useToast } from "../../hooks/use-toast"
import { FormErrorSummary } from "../ui/form-error-summary"
import { validateSMSFFormStep1, validateSMSFFormStep2, scrollToFirstError } from "../../utils/form-validation"
import { ensureFormHasRequiredFields } from "../../utils/form-data-loader"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import type { SMSFFormData, EngagementLetterData } from "../../types/form-types"

interface SMSFTaxFormProps {
  formType?: string
}

const STEPS = ["SMSF Details", "Member Details", "Fund Records", "Income & Expenses", "Declaration"]

const CHARACTER_LIMITS = {
  smsfName: 100,
  streetAddress: 100,
  streetAddress2: 100,
  city: 50,
  contactName: 100,
  contactPosition: 50,
  contactEmail: 100,
  electronicServiceAddress: 100,
  bankAccountName: 100,
  bankName: 50,
  prevAccountantName: 100,
  prevAccountantContact: 100,
  prevAccountantEmail: 100,
  signature: 100,
}

const SMSFTaxForm: React.FC<SMSFTaxFormProps> = ({ formType }) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('smsfFormData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Only use the saved data if it's for an SMSF form
        if (parsedData.formType === 'smsf') {
          console.log("Loaded SMSF form data from localStorage:", parsedData)
          setFormData(prevData => ({ ...prevData, ...parsedData }))
          toast({
            title: "Form progress loaded",
            description: "Your previously saved form progress has been loaded."
          })
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error)
    }
  }, [toast])


  const [formData, setFormData] = useState<SMSFFormData>({
    formType: formType || "smsf",
    smsfName: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    postcode: "",
    contactName: "",
    contactPosition: "",
    contactPhone: "",
    contactMobile: "",
    contactEmail: "",
    trusteeType: "individual",
    financialYear: "",
    updateAtoDetails: "yes",
    electronicServiceAddress: "",
    bankBsb: "",
    bankAccountNo: "",
    confirmAccountNo: "",
    bankAccountName: "",
    bankName: "",
    memberCount: "",
    prevAccountantName: "",
    prevAccountantContact: "",
    prevAccountantPhone: "",
    prevAccountantMobile: "",
    prevAccountantEmail: "",
    firstName: "",
    lastName: "",
    lastFinancialStatements: null,
    lastTaxReturn: null,
    trustDeeds: null,
    originalFundRecords: null,
    memberApplication: null,
    trusteeConsent: null,
    fundInvestmentStrategy: null,
    rolloverStatements: null,
    expenseInvoices: null,
    capitalGains: "no",
    propertyCapitalGains: "no",
    rentalIncome: "no",
    trustDistribution: "no",
    partnershipDistribution: "no",
    dividendIncome: "no",
    investmentExpenses: "no",
    managementExpenses: "no",
    signature: null,
    declarationAccepted: "no",
    engagementLetter: {
      accepted: false,
      signature: null,
      dateSigned: null,
    },
  })

  useEffect(() => {
    if (formType) {
      setFormData((prev) => ({
        ...prev,
        formType: formType,
      }))
    }
  }, [formType])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromEngagement = params.get("fromEngagement")
    const engagementCompleted = params.get("engagementCompleted")
    const returnedStep = params.get("returnedStep")

    if (fromEngagement === "true" && engagementCompleted === "true") {
      // Update engagement letter status
      setFormData(prev => ({
        ...prev,
        engagementLetter: {
          ...prev.engagementLetter,
          accepted: true,
          dateSigned: new Date().toISOString()
        }
      }));
      
      toast({
        title: "Engagement Letter Completed",
        description: "Thank you for completing the engagement letter."
      });
      
      // Return to the previously stored step (or stay on current step)
      if (returnedStep && !isNaN(Number(returnedStep))) {
        setCurrentStep(Number(returnedStep));
      }
      
      // Clean up URL params
      navigate("/tax-solutions/smsf", { replace: true });
    }
    
    // Check for state data passed from EngagementLetterPage
    if (location.state?.updatedFormData) {
      setFormData(prev => ({
        ...prev,
        ...location.state.updatedFormData,
        engagementLetter: {
          ...prev.engagementLetter,
          ...location.state.updatedFormData.engagementLetter,
          accepted: true,
          dateSigned: new Date().toISOString()
        }
      }));
      
      // If we have a stored step to return to, go there
      if (location.state.currentStep) {
        setCurrentStep(location.state.currentStep);
      }
      
      // Clear the state to prevent reapplying
      navigate("/tax-solutions/smsf", { replace: true });
    }
  }, [location.state, navigate, searchParams, toast]);

  useEffect(() => {
    const fullName = formData.contactName.trim()
    if (fullName && (!formData.firstName || !formData.lastName)) {
      const nameParts = fullName.split(" ")
      if (nameParts.length >= 2) {
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(" ")
        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
        }))
      } else if (nameParts.length === 1) {
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0],
          lastName: nameParts[0],
        }))
      }
    }
  }, [formData.contactName])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let validatedValue = value
    if (
      CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS] &&
      value.length > CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS]
    ) {
      validatedValue = value.substring(0, CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS])
    }

    if (name === "postcode") {
      validatedValue = value.replace(/\D/g, "").substring(0, 4)
    } else if (["contactPhone", "contactMobile", "prevAccountantPhone", "prevAccountantMobile"].includes(name)) {
      validatedValue = value.replace(/\D/g, "").substring(0, 10)
      if (validatedValue.length > 0 && !validatedValue.startsWith("0")) {
        validatedValue = "0" + validatedValue
      }
    }

    setFormData((prev) => ({ ...prev, [name]: validatedValue }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, [fieldName]: file }))

    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleFileUpload = (fieldName: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [fieldName]: file }))

    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleFileDelete = (fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: null }))
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    let stepErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        stepErrors = validateSMSFFormStep1(formData)
        break
      case 2:
        stepErrors = validateSMSFFormStep2(formData)
        break
      default:
        stepErrors = await validateSMSFFormStep(currentStep, formData)
        break
    }

    setErrors(stepErrors)
    setShowErrors(Object.keys(stepErrors).length > 0)

    return Object.keys(stepErrors).length === 0
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      handleSaveProgress()
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
      setShowErrors(false)
      window.scrollTo(0, 0)
    } else {
      toast({
        title: "Please correct the errors",
        description: "There are errors in the form that need to be fixed before proceeding.",
        variant: "destructive",
      })
      setTimeout(() => {
        scrollToFirstError(errors)
      }, 100)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setShowErrors(false)
    window.scrollTo(0, 0)
  }

  const handleSaveProgress = async () => {
    setIsSaving(true)
    try {
      const dataToSave = {
        ...formData,
        formType: "smsf",
      }

      if (!dataToSave.firstName || !dataToSave.lastName) {
        const fullName = dataToSave.contactName.trim()
        if (fullName) {
          const nameParts = fullName.split(" ")
          if (nameParts.length >= 2) {
            dataToSave.firstName = nameParts[0]
            dataToSave.lastName = nameParts.slice(1).join(" ")
          } else {
            dataToSave.firstName = fullName
            dataToSave.lastName = fullName
          }
        }
      }

      console.log("Saving SMSF form progress to localStorage with formType:", dataToSave.formType)

      const result = await saveSMSFFormProgress(dataToSave)
      if (result.success) {
        toast({
          title: "Progress saved",
          description: "Your form progress has been saved. You can continue later.",
        })
      } else {
        toast({
          title: "Error saving progress",
          description: result.error || "An error occurred while saving your progress.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving form progress:", error)
      toast({
        title: "Error saving progress",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // First check if engagement letter is completed
    if (!formData.engagementLetter?.accepted) {
      toast({
        title: "Engagement Letter Required",
        description: "Please complete and accept the engagement letter before submitting.",
        variant: "destructive"
      })
      // Scroll to the engagement letter section
      const engagementSection = document.getElementById('engagement-letter-section')
      if (engagementSection) {
        engagementSection.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    const isStepValid = await validateCurrentStep()
    if (!isStepValid) {
      toast({
        title: "Please correct the errors",
        description: "There are errors in the form that need to be fixed before submission.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()

      // First, add the critical fields
      formDataToSubmit.append("formType", "smsf")
      formDataToSubmit.append("firstName", formData.firstName || "")
      formDataToSubmit.append("lastName", formData.lastName || "")
      formDataToSubmit.append("entityName", formData.smsfName || "")
      formDataToSubmit.append("smsfName", formData.smsfName || "")

      // Then add all other fields
      for (const [key, value] of Object.entries(formData)) {
        if (value !== null && value !== undefined) {
          if (key === "engagementLetter") {
            formDataToSubmit.append(key, JSON.stringify(value))
          } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
            formDataToSubmit.append(key, JSON.stringify(value))
          } else if (value instanceof File) {
            formDataToSubmit.append(key, value)
          } else if (typeof value === "string" || typeof value === "number") {
            formDataToSubmit.append(key, value.toString())
          }
        }
      }

      console.log("Final form data for submission:")
      for (const [key, value] of formDataToSubmit.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`)
      }

      localStorage.removeItem('smsfFormData');
      const result = await submitSMSFForm(formDataToSubmit)

      if (result.success) {
        toast({
          title: "Form submitted successfully",
          description: "Your SMSF form has been submitted successfully.",
        })

        navigate("/tax-solutions/smsf/payment", {
          state: { formData: formData },
        })
      } else {
        toast({
          title: "Error submitting form",
          description: result.error || "An error occurred while submitting your form.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error submitting form",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center ${index + 1 === currentStep ? "text-blue-600" : index + 1 < currentStep ? "text-green-600" : "text-gray-400"}`}
              >
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${index + 1 === currentStep ? "border-blue-600 bg-blue-50" : index + 1 < currentStep ? "border-green-600 bg-green-50" : "border-gray-300"}`}
                >
                  {index + 1 < currentStep ? "✓" : index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step}</span>
              </div>

              {index < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 ${index + 1 < currentStep ? "bg-green-500" : "bg-gray-300"}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1SMSF
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        )
      case 2:
        return (
          <FormStep2SMSF
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
            handleFileUpload={handleFileUpload}
            errors={errors}
          />
        )
      case 3:
        return (
          <FormStep3SMSF
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleRadioChange={handleRadioChange}
            handleFileUpload={handleFileUpload}
            errors={errors}
          />
        )
      case 4:
        return (
          <FormStep4SMSF
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
            handleFileUpload={handleFileUpload}
            errors={errors}
          />
        )
      case 5:
        return (
          <FormStep5SMSF
            formData={{
              ...formData,
              engagementLetter: formData.engagementLetter
                ? {
                    ...formData.engagementLetter,
                    signature:
                      typeof formData.engagementLetter.signature !== "undefined"
                        ? formData.engagementLetter.signature
                        : null,
                  }
                : undefined,
            }}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleRadioChange={handleRadioChange}
            // handleFileUpload={handleFileUpload}
            errors={errors}
          />
        )
      default:
        return null
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {renderStepIndicator()}

      <FormErrorSummary errors={errors} visible={showErrors} />

      {renderFormContent()}

      <div className="mt-12 flex justify-between items-center">
        <div>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevious} className="mr-4" disabled={isSubmitting}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
          )}

          <Button type="button" variant="outline" onClick={handleSaveProgress} disabled={isSaving || isSubmitting}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Progress
              </>
            )}
          </Button>
        </div>

        {currentStep < STEPS.length ? (
          <Button type="button" onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button type="submit" className="bg-gradient-to-r from-green-600 to-blue-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Submit Form
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  )
}

export default SMSFTaxForm