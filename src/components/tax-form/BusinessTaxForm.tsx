"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Save, Send, Loader2, FileText } from "lucide-react"
import { Button } from "../ui/button"
import FormStep1Business from "./business/FormStep1Business"
import FormStep2Business from "./business/FormStep2Business"
import FormStep3Business from "./business/FormStep3Business"
import FormStep4Business from "./business/FormStep4Business"
import {
  saveBusinessFormProgress,
  submitBusinessForm,
  validateBusinessFormStep,
} from "../../actions/business-form-actions"
import { useToast } from "../../hooks/use-toast"
import { FormErrorSummary } from "../ui/form-error-summary"
import { validateBusinessFormStep1, validateBusinessFormStep2, scrollToFirstError } from "../../utils/form-validation"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { Link } from "react-router-dom"
import type { EngagementLetterData, BusinessFormData } from "../../types/form-types"

const STEPS = ["Business Details", "Financial Info", "Documents", "Declaration"]

interface BusinessTaxFormProps {
  formType?: string
}

const CHARACTER_LIMITS: { [key: string]: number } = {
  businessName: 100,
  entityName: 100,
  abn: 11,
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

const initEngagementLetter: EngagementLetterData = {
  clientName: "",
  agreementDate: new Date().toISOString().split('T')[0],
  signature: null,
  accepted: false,
  dateSigned: null
};

const BusinessTaxForm: React.FC<BusinessTaxFormProps> = ({ formType = "business" }) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<BusinessFormData>({
    formType: formType ,
    businessName: "",
    entityName: "",
    abn: "",
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
    entityType: "company",
    financialYear: "",
    updateAtoDetails: "yes",
    electronicServiceAddress: "",
    bankBsb: "",
    bankAccountNo: "",
    confirmAccountNo: "",
    bankAccountName: "",
    bankName: "",
    prevAccountantName: "",
    prevAccountantContact: "",
    prevAccountantPhone: "",
    prevAccountantMobile: "",
    prevAccountantEmail: "",
    lastFinancialStatements: null,
    lastTaxReturn: null,
    companyExtract: null,
    fixedAssetRegister: null,
    loanAgreements: null,
    leaseAgreements: null,
    franchiseAgreements: null,
    otherDocuments: null,
    salesSummary: "no",
    purchaseSummary: "no",
    bankStatements: "no",
    payrollReports: "no",
    superannuationSummary: "no",
    motorVehicleExpenses: "no",
    advertisingExpenses: "no",
    rentExpenses: "no",
    insuranceExpenses: "no",
    otherExpenses: "no",
    signature: null,
    declarationAccepted: "no",
    engagementLetter: initEngagementLetter,
    taxLodgement: "",
    acn: "",
    tfn: "",
    gstRegistered: "",
    asicAgent: "",
    prevAccountantAddress: "",
    prevAccountantCity: "",
    prevAccountantState: "",
    accountingSoftware: "",
    motorVehicles: "",
    fbtRegistered: "no",
    employeeCount: "",
    relatedEntityName: "",
    relatedEntitySoftware: "",
    relatedEntityTFN: "",
    relatedEntityABN: "",
    div7aLoans: "",
    trustType: "",
    entityDocument: null,
    ownerIdDocument: null,
    signature2: null,
    directorId: null,
    directorIdType: "",
    directorIdNumber: "",
    directorIdIssueState: "",
  })

  // Track if we just returned from engagement letter and completed it
  const [justCompletedEngagement, setJustCompletedEngagement] = useState(false);

  useEffect(() => {
    // Load form data from localStorage if available
    try {
      const savedData = localStorage.getItem('businessFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded form data from localStorage with formType:", parsedData.formType);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .select-content, [data-radix-popper-content-wrapper] {
        position: absolute !important;
        z-index: 50 !important;
        max-height: 300px !important;
        overflow-y: auto !important;
        background-color: white !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 0.375rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        animation: none !important;
        transform: none !important;
        transition: opacity 0.1s ease !important;
      }
      
      [data-radix-select-viewport] {
        background-color: white !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (formType) {
      console.log("Setting form type from props:", formType);
      setFormData((prev) => ({
        ...prev,
        formType: formType,
        form_type: formType,
      }))
    }
  }, [formType])

  useEffect(() => {
    // Parse the URL search params
    const fromEngagement = searchParams.get("fromEngagement")
    const engagementCompleted = searchParams.get("engagementCompleted")
    const returnedStep = searchParams.get("returnedStep") || searchParams.get("currentStep")
    const preserveFormType = searchParams.get("preserveFormType") // Get preserved formType from query

    // Check for returned form data from engagement letter page
    if (location.state && (location.state as any).updatedFormData) {
      // setFormData((location.state as any).updatedFormData);
      const updatedData = (location.state as any).updatedFormData;
      // updatedData.formType = formType;
      const finalFormType = (location.state as any).formType || 
                            updatedData.formType || 
                            preserveFormType ||
                            formType;
                            
      updatedData.formType = finalFormType;
      setFormData(updatedData);
      console.log("Form data updated from engagement letter state with form type:", updatedData.formType);

      // If we returned from the engagement letter page and it was completed
      if (fromEngagement === "true" && engagementCompleted === "true") {
        toast({
          title: "Engagement Letter Completed",
          description: "Thank you for completing the engagement letter.",
        })
        // Set flag to scroll to top on step 4
        setJustCompletedEngagement(true);
      }
    } else if (fromEngagement === "true") {
      // If no updated form data was passed back in the state but we returned from engagement letter
      if (engagementCompleted === "true") {
        // setFormData((prev) => ({
        //   ...prev,
        //   formType: formType,
        //   engagementLetter: {
        //     ...prev.engagementLetter,
        //     accepted: true,
        //     dateSigned: new Date().toISOString(),
        //   }
        // }))
        setFormData((prev) => {
          // Use the preserved formType from the URL if available
          const finalFormType = preserveFormType || formType;
          
          return {
            ...prev,
            formType: finalFormType, // Make sure to keep the correct formType
            engagementLetter: {
              ...prev.engagementLetter,
              accepted: true,
              dateSigned: new Date().toISOString(),
            }
          };
        });

        toast({
          title: "Engagement Letter Completed",
          description: "Thank you for completing the engagement letter.",
        })
        // Set flag to scroll to top on step 4
        setJustCompletedEngagement(true);
      }
    }

    // Set the current step to the returned step if provided
    if (returnedStep && !isNaN(Number.parseInt(returnedStep))) {
      setCurrentStep(Number.parseInt(returnedStep))
    }

    if (fromEngagement === "true") {
      // Clean up the URL by removing the query parameters only when returning from engagement letter
      navigate("/tax-solutions/business", { 
        replace: true,
        state: { formType: preserveFormType || formType } // Preserve formType in state during replacement
      })// navigate("/tax-solutions/business", { replace: true })
    }
  }, [location.state, searchParams, navigate, toast, formType])

  // Scroll to top when just completed engagement and on step 4
  useEffect(() => {
    if (justCompletedEngagement && currentStep === 4) {
      window.scrollTo(0, 0);
      setJustCompletedEngagement(false);
    }
  }, [justCompletedEngagement, currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let validatedValue: string = value
    if (
      CHARACTER_LIMITS[name] &&
      value.length > CHARACTER_LIMITS[name]
    ) {
      validatedValue = value.substring(0, CHARACTER_LIMITS[name])
    }

    if (name === "postcode") {
      validatedValue = value.replace(/\D/g, "").substring(0, 4)
    } else if (["contactPhone", "contactMobile", "prevAccountantPhone", "prevAccountantMobile"].includes(name)) {
      validatedValue = value.replace(/\D/g, "").substring(0, 10)
      if (validatedValue.length > 0 && !validatedValue.startsWith("0")) {
        validatedValue = "0" + validatedValue
      }
    } else if (name === "abn") {
      validatedValue = value.replace(/\D/g, "").substring(0, 11)
    }

    setFormData((prev) => ({ ...prev, [name]: validatedValue } as BusinessFormData))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as BusinessFormData))

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
    setFormData((prev) => ({ ...prev, [fieldName]: file } as BusinessFormData))

    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleFileUpload = (fieldName: keyof BusinessFormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [fieldName]: file } as BusinessFormData))

    if (errors[fieldName as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName as string]
        return newErrors
      })
    }
  }

  const handleFileDelete = (fieldName: keyof BusinessFormData) => {
    setFormData((prev) => ({ ...prev, [fieldName]: null } as BusinessFormData))
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    let stepErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        stepErrors = validateBusinessFormStep1(formData)
        break
      case 2:
        stepErrors = validateBusinessFormStep2(formData)
        break
      default:
        stepErrors = await validateBusinessFormStep(currentStep, formData)
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
      const dataToSave: BusinessFormData = {
        ...formData,
        formType: formType,
        form_type: formType,
      }
      console.log("Saving business form with formType:", dataToSave.formType);
      const result = await saveBusinessFormProgress(dataToSave)
      if (result.success) {
        toast({
          title: "Progress saved",
          description: "Your form progress has been saved locally. You can continue later.",
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

  const navigateToEngagementLetter = () => {
    navigate("/tax-solutions/engagement", {
      state: {
        businessFormData: formData,
        currentStep: currentStep,
        formType: formType,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit button clicked, starting form submission...")

    // Check if entity name is provided
    if (!formData.entityName) {
      console.log("Entity name missing, showing error")
      toast({
        title: "Missing entity name",
        description: "Please provide an entity name in step 1 before submitting.",
        variant: "destructive",
      })
      setErrors((prev) => ({...prev, entityName: "Entity name is required"}))
      setCurrentStep(1)
      setShowErrors(true)
      setTimeout(() => {
        scrollToFirstError({entityName: "Entity name is required"})
      }, 100)
      return
    }

    if (!formData.engagementLetter?.accepted) {
      console.log("Engagement letter not accepted, redirecting...")
      toast({
        title: "Engagement Letter Required",
        description: "Please complete and accept the engagement letter before submitting.",
        variant: "destructive",
      })

      navigateToEngagementLetter()
      return
    }

    const step4Errors = await validateBusinessFormStep(4, formData)
    if (Object.keys(step4Errors).length > 0) {
      console.log("Step 4 validation errors:", step4Errors)
      setErrors(step4Errors)
      setShowErrors(true)
      toast({
        title: "Please correct the errors",
        description: "There are errors in the current step that need to be fixed before submission.",
        variant: "destructive",
      })
      setTimeout(() => {
        scrollToFirstError(step4Errors)
      }, 100)
      return
    }

    setIsSubmitting(true)
    console.log("Submit button clicked, starting form submission...");
    
    try {
      console.log("Starting form submission process...")
      const formDataToSubmit = new window.FormData()

      // First, add the critical fields
      formDataToSubmit.append("formType", formData.formType || formType);
      // formDataToSubmit.append("entityName", formData.entityName || "")
      // formDataToSubmit.append("businessName", formData.businessName || "")
      // formDataToSubmit.append("contactName", formData.contactName || "")
      // formDataToSubmit.append("contactEmail", formData.contactEmail || "")
      // formDataToSubmit.append("contactMobile", formData.contactMobile || "")
      console.log("Final form data for submission:");
      // Add form type debugging
      console.log(`formType: ${formData.formType || formType}`);

      // For debugging, log key fields
      const keysToLog = ["entityName", "businessName", "contactName", "contactEmail", "contactMobile"];
      keysToLog.forEach(key => {
        console.log(`${key}: ${formData[key as keyof BusinessFormData]}`);
      });
      // Then add all other fields
      // for (const [key, value] of Object.entries(formData)) {
      for (const [key, value] of Object.entries(formData)) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      // Add formData entries to formDataToSubmit
      for (const [key, value] of Object.entries(formData)) {
        if (key === "formType") {
          // Skip the formType from formData, we already set it from props
          continue;
        }
        
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            formDataToSubmit.append(key, JSON.stringify(value));
          } else {
            formDataToSubmit.append(key, String(value));
          }
        } else {
          formDataToSubmit.append(key, "");
        }
      }

      console.log("Calling submitBusinessForm...");
      const result = await submitBusinessForm(formDataToSubmit);
      console.log("Submit result:", result);

      if (result.success) {
        toast({
          title: "Form submitted successfully",
          description: `Thank you for submitting your ${formType === "accounting_services" ? "Accounting" : "Business"} form. Redirecting to payment page...`,
        });

        console.log("Form submitted successfully, redirecting to payment...");
        
        // Scroll to top before navigating to payment page
        window.scrollTo(0, 0);

        // Use setTimeout to ensure scroll happens before navigation
        setTimeout(() => {
          navigate("/tax-solutions/business/payment", {
            state: {
              formData: formData,
            },
          });
        }, 0);
      } else {
        toast({
          title: "Submission failed",
          description: result.error || "An error occurred while submitting your form.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  //       if (value !== null && value !== undefined) {
  //         if (key === "engagementLetter") {
  //           formDataToSubmit.append(key, JSON.stringify(value))
  //         } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
  //           formDataToSubmit.append(key, JSON.stringify(value))
  //         } else if (value instanceof File) {
  //           formDataToSubmit.append(key, value)
  //           formDataToSubmit.append(`${key}_formType`, "business")
  //         } else if (typeof value === "string" || typeof value === "number") {
  //           formDataToSubmit.append(key, value.toString())
  //         }
  //       }
  //     }

  //     console.log("Final form data for submission:")
  //     for (const [key, value] of formDataToSubmit.entries()) {
  //       console.log(`${key}: ${value instanceof File ? value.name : value}`)
  //     }

  //     console.log("Calling submitBusinessForm...")
  //     const result = await submitBusinessForm(formDataToSubmit)
  //     console.log("Submit result:", result)

  //     if (result.success) {
  //       console.log("Form submitted successfully, redirecting to payment...")
  //       toast({
  //         title: "Form submitted successfully",
  //         description: `Thank you for submitting your ${formType === "accounting_services" ? "Accounting" : "Business"} form. Redirecting to payment page...`,
  //       })

  //       // Scroll to top before navigating to payment page
  //       window.scrollTo(0, 0);

  //       // Use setTimeout to ensure scroll happens before navigation
  //       setTimeout(() => {
  //         navigate("/tax-solutions/business/payment", {
  //           state: {
  //             formData: formData,
  //           },
  //         })
  //       }, 0)
  //     } else {
  //       console.log("Form submission failed:", result.error)
  //       toast({
  //         title: "Submission failed",
  //         description: result.error || "An error occurred while submitting your form.",
  //         variant: "destructive",
  //       })
  //     }
  //   } catch (error: any) {
  //     console.error("Error in handleSubmit:", error)
  //     toast({
  //       title: "Submission error",
  //       description: error?.message || "An unexpected error occurred. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  const handleFormDataChange = (data: BusinessFormData) => {
    setFormData(data)
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
      case 1: {
        const { engagementLetter, ...formDataForStep1 } = formData;
        return (
          <FormStep1Business
            formData={formDataForStep1}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      }
      case 2: {
        const { engagementLetter, ...formDataForStep2 } = formData;
        return (
          <FormStep2Business
            formData={formDataForStep2}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            errors={errors}
          />
        );
      }
      case 3: {
        const { engagementLetter, ...formDataForStep3 } = formData;
        return (
          <FormStep3Business
            formData={formDataForStep3}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
          />
        )
      }
      case 4: {
        const { engagementLetter, ...formDataForStep4 } = formData;
        return (
          <>
            {!formData.engagementLetter?.accepted && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 mb-4">
                  <strong>Important:</strong> You must complete the engagement letter before submitting your form.
                </p>
                <Button
                  onClick={navigateToEngagementLetter}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Complete Engagement Letter
                </Button>
              </div>
            )}
            <FormStep4Business
              formData={{
                entityDocument: formData.entityDocument ?? null,
                ownerIdDocument: formData.ownerIdDocument ?? null,
                signature: typeof formData.signature === "string" ? formData.signature : "",
                signature2: typeof formData.signature2 === "string" ? formData.signature2 : "",
                directorId: typeof formData.directorId === "string" ? formData.directorId : "",
                declarationAccepted: formData.declarationAccepted ?? "",
              }}
              handleChange={handleChange}
              handleRadioChange={handleRadioChange}
              handleFileChange={handleFileChange}
              errors={errors}
            />
          </>
        )
      }
      default:
        return <p>Step not found</p>
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
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-green-600 to-blue-600" 
            disabled={isSubmitting}
            onClick={(e) => {
              console.log("Submit button clicked")
              handleSubmit(e)
            }}
          >
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

export default BusinessTaxForm