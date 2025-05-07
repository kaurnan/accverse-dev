import apiClient from "../services/api"
import type { FormData } from "../types/form-types"

export async function loadSavedFormData(formId: string) {
  try {
    const response = await apiClient.get(`/tax-solutions/load-progress/${formId}`)
    return {
      success: true,
      data: response.data.form_data,
    }
  } catch (error) {
    console.error("Error loading form data:", error)
    return {
      success: false,
      error: "Failed to load saved form data",
    }
  }
}

export function getFormIdFromUrl() {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("formId")
  }
  return null
}

// Helper function to ensure form data has required fields
export function ensureFormHasRequiredFields(formData: any): FormData {
  const processedData = { ...formData };
  
  // Initialize engagementLetter if missing
  if (!processedData.engagementLetter) {
    processedData.engagementLetter = {
      accepted: false,
      dateSigned: null
    };
  }
  
  // Preserve existing formType if it exists rather than overriding based on fields
  // This prevents incorrect type detection during form progression
  if (processedData.formType) {
    console.log(`Preserving existing form type: ${processedData.formType}`);
    // Ensure form_type matches formType for consistency
    processedData.form_type = processedData.formType;
    return processedData;
  }
  
  // Only set form type if it's not already defined
  if (processedData.smsfName) {
    processedData.formType = "smsf";
    processedData.form_type = "smsf";
    console.log("Form type explicitly set to smsf due to SMSF fields");
  } else if (processedData.businessName || processedData.entityName) {
    processedData.formType = "tax_business"; // Default to tax_business for business forms
    processedData.form_type = "tax_business";
    console.log("Form type explicitly set to tax_business due to business fields");
  } else if (processedData.preferredCompanyName) {
    processedData.formType = "company-registration";
    processedData.form_type = "company-registration";
    console.log("Form type explicitly set to company-registration");
  } else if (processedData.proposedFundName) {
    processedData.formType = "smsf-establishment";
    processedData.form_type = "smsf-establishment";
    console.log("Form type explicitly set to smsf-establishment");
  }
  
  if (processedData.formType === "smsf") {
    if (!processedData.firstName || !processedData.lastName) {
      const contactName = processedData.contactName;
      if (contactName) {
        const nameParts = contactName.split(' ');
        if (!processedData.firstName) {
          processedData.firstName = nameParts[0] || '';
        }
        if (!processedData.lastName) {
          processedData.lastName = nameParts.length > 1 ? 
            nameParts.slice(1).join(' ') : processedData.firstName;
        }
      }
    }
  }
  
  if (processedData.formType === "tax_business" || processedData.formType === "accounting_services") {
    // If entityName is empty but businessName is provided, use businessName as entityName
    if (
      (!processedData.entityName || processedData.entityName.trim() === "") &&
      processedData.businessName &&
      processedData.businessName.trim() !== ""
    ) {
      processedData.entityName = processedData.businessName
      console.log("Using businessName as entityName")
    }
  }

  if (!processedData.confirmAccountNo && processedData.bankAccountNo) {
    processedData.confirmAccountNo = processedData.bankAccountNo;
  }
  if (processedData.itrEngagementAccepted !== undefined) {
    processedData.itrEngagementCompleted = !!processedData.itrEngagementAccepted;
    delete processedData.itrEngagementAccepted;
  }
  console.log("Processed form data formType:", processedData.formType);
  
  return processedData;
}

// Helper function to prepare form data for submission
export function prepareFormDataForSubmission(formData: any) {
  const submissionData = new FormData()
  const processedData = ensureFormHasRequiredFields(formData)
  
  // Explicitly set the form type - critical for consistency
  const formType = processedData.formType || "tax_business"
  submissionData.append("formType", formType)
  submissionData.append("form_type", formType)

  if (formData instanceof FormData) {
    // If it's already FormData, copy all entries
    for (const [key, value] of (formData as any).entries()) {
      if (key !== "formType" && key !== "form_type") { // Skip these as we set them explicitly above
        if (value !== null && value !== undefined) {
          submissionData.append(key, value)
        } else {
          // Include empty values for non-required fields
          submissionData.append(key, "")
        }
      }
    }
  } else {
    // If it's a plain object, convert to FormData
    Object.entries(processedData).forEach(([key, value]) => {
      if (key !== "formType" && key !== "form_type") { // Skip these as we set them explicitly above
        if (value instanceof File) {
          console.log(`Appending file for ${key}:`, value)
          submissionData.append(key, value)
        } else if (value !== null && value !== undefined) {
          if (typeof value === "object" && !(value instanceof File)) {
            submissionData.append(key, JSON.stringify(value))
          } else {
            submissionData.append(key, value.toString())
          }
        } else {
          // Include empty values for non-required fields
          submissionData.append(key, "")
        }
      }
    })
  }

  console.log("Form data prepared for submission:")
  console.log("formType:", submissionData.get("formType"))
  console.log("form_type:", submissionData.get("form_type"))
  console.log("entityName:", submissionData.get("entityName"))
  console.log("businessName:", submissionData.get("businessName"))
  
  return submissionData
}

export function getSMSFPricingPlans() {
  return {
    essential: {
      name: "Essential Plan",
      price: 900,
      features: [
        "SMSF Financial Statements",
        "SMSF Tax Return",
        "Preparation of annual Trustee Resolutions and Minutes",
        "Audit Fees",
        "Software Subscription",
        "Annual member statements",
        "Annual investment and performance reports"
      ]
    },
    premium: {
      name: "Premium Plan",
      price: 1500,
      features: [
        "SMSF Financial Statements",
        "SMSF Tax Return",
        "Independent Audit Fees",
        "Software Subscription",
        "Ongoing administration and reconciliation of SMSF's transaction data",
        "Preparation of annual Trustee Resolutions and Minutes",
        "Annual member statements",
        "Annual investment and performance reports",
        "General technical advice and guidance",
        "Actuarial Certificate Fees +$125"
      ]
    }
  };
}

// Get SMSF additional services
export function getSMSFAdditionalServices() {
  return [
    {
      id: 'actuarial',
      name: 'Actuarial Certificate Fees',
      price: 125,
    },
    {
      id: 'multi-member',
      name: 'SMSF with more than 4 members',
      price: 200,
    },
    {
      id: 'individual-setup',
      name: 'SMSF set-up with Individual Trustees',
      price: 450,
    },
    {
      id: 'corporate-setup',
      name: 'SMSF set-up with a Corporate Trustee',
      price: 1400,
    },
    {
      id: 'payg',
      name: 'PAYG Instalment, BAS, GST lodgement',
      price: 200,
    },
    {
      id: 'takeon',
      name: 'Existing SMSF take-on',
      price: 100,
    },
    {
      id: 'audit-only',
      name: 'Audit only',
      price: 300,
    },
    {
      id: 'consulting',
      name: 'Consulting fees',
      price: 200,
    }
  ];
}
