"use server"

import apiClient from "../services/api"
import { validateRequiredField, validateEmail, validatePhone, validatePostcode } from "../utils/form-validation";
import { prepareFormDataForSubmission } from "../utils/form-data-loader";
import type { FormData } from "../types/form-types";

// Define validation rules for each step
// export async function validateSMSFFormStep(step: number, formData: any) {
//   const errors: Record<string, string> = {};

//   switch (step) {
//     case 1:
//       // Validate SMSF Details
//       if (!validateRequiredField(formData.smsfName)) {
//         errors.smsfName = "SMSF name is required"
//       } else if (formData.smsfName.length > 100) {
//         errors.smsfName = "SMSF name must be 100 characters or less"
//       }
      
//       if (!validateRequiredField(formData.streetAddress)) {
//         errors.streetAddress = "Address is required"
//       } else if (formData.streetAddress.length > 100) {
//         errors.streetAddress = "Address must be 100 characters or less"
//       }
      
//       if (formData.streetAddress2 && formData.streetAddress2.length > 100) {
//         errors.streetAddress2 = "Address line 2 must be 100 characters or less"
//       }
      
//       if (!validateRequiredField(formData.city)) {
//         errors.city = "City is required"
//       } else if (formData.city.length > 50) {
//         errors.city = "City must be 50 characters or less"
//       }
      
//       if (!validateRequiredField(formData.state)) {
//         errors.state = "State is required"
//       }
      
//       if (!validateRequiredField(formData.postcode)) {
//         errors.postcode = "Postcode is required"
//       } else if (!validatePostcode(formData.postcode)) {
//         errors.postcode = "Please enter a valid Australian postcode (4 digits)"
//       }
      
//       if (!validateRequiredField(formData.contactName)) {
//         errors.contactName = "Contact name is required"
//       } else if (formData.contactName.length > 100) {
//         errors.contactName = "Contact name must be 100 characters or less"
//       }
      
//       if (formData.contactPosition && formData.contactPosition.length > 50) {
//         errors.contactPosition = "Position must be 50 characters or less"
//       }
      
//       if (!validateRequiredField(formData.contactEmail)) {
//         errors.contactEmail = "Contact email is required"
//       } else if (!validateEmail(formData.contactEmail)) {
//         errors.contactEmail = "Please enter a valid email address"
//       } else if (formData.contactEmail.length > 100) {
//         errors.contactEmail = "Email must be 100 characters or less"
//       }
      
//       if (!formData.contactPhone && !formData.contactMobile) {
//         errors.contactPhone = "At least one contact number is required"
//       } else {
//         if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
//           errors.contactPhone = "Please enter a valid phone number"
//         }
//         if (formData.contactMobile && !validatePhone(formData.contactMobile)) {
//           errors.contactMobile = "Please enter a valid mobile number"
//         }
//       }
      
//       // Bank details validation
//       if (!validateRequiredField(formData.bankBsb)) {
//         errors.bankBsb = "BSB number is required"
//       }
      
//       if (!validateRequiredField(formData.bankName)) {
//         errors.bankName = "Bank name is required"
//       } else if (formData.bankName.length > 50) {
//         errors.bankName = "Bank name must be 50 characters or less"
//       }
      
//       if (!validateRequiredField(formData.bankAccountName)) {
//         errors.bankAccountName = "Account name is required"
//       } else if (formData.bankAccountName.length > 100) {
//         errors.bankAccountName = "Account name must be 100 characters or less"
//       }
      
//       if (!validateRequiredField(formData.bankAccountNo)) {
//         errors.bankAccountNo = "Account number is required"
//       } else if (!/^\d{6,10}$/.test(formData.bankAccountNo)) {
//         errors.bankAccountNo = "Account number must be 6-10 digits"
//       }
      
//       if (!validateRequiredField(formData.confirmAccountNo)) {
//         errors.confirmAccountNo = "Confirm account number is required"
//       } else if (formData.bankAccountNo !== formData.confirmAccountNo) {
//         errors.confirmAccountNo = "Account numbers do not match"
//       }
      
//       if (formData.electronicServiceAddress && formData.electronicServiceAddress.length > 100) {
//         errors.electronicServiceAddress = "Electronic service address must be 100 characters or less"
//       }
//       break

//     case 2:
//       // Validate Member Details
//       if (!validateRequiredField(formData.memberCount)) {
//         errors.memberCount = "Please select the number of members"
//       }
      
//       if (formData.prevAccountantName && formData.prevAccountantName.length > 100) {
//         errors.prevAccountantName = "Previous accountant name must be 100 characters or less"
//       }
      
//       if (formData.prevAccountantContact && formData.prevAccountantContact.length > 100) {
//         errors.prevAccountantContact = "Previous accountant contact must be 100 characters or less"
//       }
      
//       if (formData.prevAccountantPhone && !validatePhone(formData.prevAccountantPhone)) {
//         errors.prevAccountantPhone = "Please enter a valid phone number"
//       }
      
//       if (formData.prevAccountantMobile && !validatePhone(formData.prevAccountantMobile)) {
//         errors.prevAccountantMobile = "Please enter a valid mobile number"
//       }
      
//       if (formData.prevAccountantEmail && !validateEmail(formData.prevAccountantEmail)) {
//         errors.prevAccountantEmail = "Please enter a valid email address"
//       } else if (formData.prevAccountantEmail && formData.prevAccountantEmail.length > 100) {
//         errors.prevAccountantEmail = "Email must be 100 characters or less"
//       }
//       break

//     case 5:
//       // Validate Declaration
//       if (!formData.signature) {
//         errors.signature = "Signature is required"
//       } else if (formData.signature.length > 100) {
//         errors.signature = "Signature must be 100 characters or less"
//       }
      
//       if (!formData.declarationAccepted || formData.declarationAccepted !== "yes") {
//         errors.declarationAccepted = "You must agree to the declaration"
//       }
//       break
//   }

//   return errors
// }

// // Submit form data to backend
// export async function submitSMSFForm(formData: FormData) {
//     try {
//       // Log the original FormData contents for debugging
//     //   console.log("Original FormData entries:");
//     //   for (const [key, value] of formData.entries()) {
//         // const processedFormData = new FormData();
      
//         // CRITICAL: First append firstName and lastName fields - these MUST be first
//         console.log("Original FormData entries:");
//       for (const [key, value] of formData.entries()) {
//         console.log(`${key}: ${value instanceof File ? value.name : value}`);
//       }
      
//       // CRITICAL: First append firstName and lastName fields - these MUST be first
//       const firstName = formData.get('firstName');
//       const lastName = formData.get('lastName');
      
//       // Log the firstName and lastName being submitted
//       console.log("Original firstName:", firstName);
//       console.log("Original lastName:", lastName);
      
//       if (!firstName || !lastName) {
//         throw new Error("First name and last name are required");
//       }
      
//       // Always set the form type to "smsf" explicitly
//       // const formType = "smsf";
//       const processedFormData = new FormData();
      
//       // Add firstName, lastName, and formType as the FIRST fields
//       processedFormData.append('firstName', firstName as string);
//       processedFormData.append('lastName', lastName as string);
//       processedFormData.append('formType', "smsf");
      
//       // Then add all remaining fields in original order
//       for (const [key, value] of formData.entries()) {
//         // Skip firstName, lastName, and formType as we've already added them
//         if (key !== 'firstName' && key !== 'lastName' && key !== 'formType') {
//           processedFormData.append(key, value);
//         }
//       }
      
//       // Log the final data for debugging
//       console.log("Final FormData firstName:", processedFormData.get("firstName"));
//       console.log("Final FormData lastName:", processedFormData.get("lastName"));
//       console.log("Final FormData formType:", processedFormData.get("formType"));
      
//       // Make the API request with the properly ordered FormData
//       const response = await apiClient.post("/tax-solutions/submit", processedFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       return { success: true, data: response.data }
//     } catch (error: any) {
//       console.error("Error submitting SMSF form:", error)
//       return { success: false, error: error.message || "Failed to submit form. Please try again." }
//     }
// }
  
// // Save form progress
// export async function saveSMSFFormProgress(formData: any) {
//   try {
//     // Create a clean copy of the form data
//     let updatedFormData = { ...formData };
    
//     // ALWAYS ensure formType is set to "smsf" regardless of what's passed
//     updatedFormData.formType = "smsf";
//     console.log("Saving SMSF form progress with formType:", updatedFormData.formType);
    
//     // Ensure firstName and lastName are set
//     if (!updatedFormData.firstName || !updatedFormData.lastName) {
//       const contactName = updatedFormData.contactName;
//       if (contactName) {
//         const nameParts = contactName.split(' ');
//         updatedFormData.firstName = updatedFormData.firstName || nameParts[0] || '';
//         updatedFormData.lastName = updatedFormData.lastName || 
//           (nameParts.length > 1 ? nameParts.slice(1).join(' ') : updatedFormData.firstName);
//       }
//     }
    
//     const response = await apiClient.post("/tax-solutions/save-progress", updatedFormData)
//     return { success: true, id: response.data.id }
//   } catch (error: any) {
//     console.error("Error saving form progress:", error)
//     return { success: false, error: error.message || "Failed to save progress. Please try again." }
//   }
// }

export const validateSMSFFormStep = async (step: number, formData: any) => {
  const errors: Record<string, string> = {};
  
  // Implement validation logic for different steps
  switch (step) {
    case 3:
      // Document validation logic
      if (step === 3 && formData.smsfName && !formData.trustDeeds) {
        errors.trustDeeds = "Please upload your trust deeds";
      }
      break;
    case 4:
      // Income validation
      break;
    case 5:
      // Engagement letter validation
      if (!formData.engagementLetter) {
        errors.engagementLetter = "You must complete the engagement letter to proceed";
      } else if (!formData.engagementLetter.accepted) {
        errors.engagementLetter = "You must accept the engagement letter to proceed";
      } else if (!formData.engagementLetter.signature) {
        errors.engagementLetter = "You must sign the engagement letter to proceed";
      } else if (!formData.engagementLetter.dateSigned) {
        errors.engagementLetter = "You must provide a signature date for the engagement letter";
      }
      
      // Declaration validation
      if (!formData.declarationAccepted || formData.declarationAccepted !== "yes") {
        errors.declarationAccepted = "You must accept the declaration to proceed";
      }
      if (!formData.signature) {
        errors.signature = "Signature is required";
      }
      break;
  }
  
  return errors;
};

export const saveSMSFFormProgress = async (formData: any) => {
  try {
    // Ensure form type is set to smsf
    const dataToSave = {
      ...formData,
      formType: "smsf"
    };
    
    console.log("Saving SMSF form progress with data:", dataToSave);
    
    // const response = await apiClient.post('/tax-solutions/save-progress', dataToSave);
    localStorage.setItem('smsfFormData', JSON.stringify(dataToSave));
    return {
      success: true,
      id: 'local-storage'
    };
  } catch (error: any) {
    console.error('Error saving SMSF form progress:', error);
    return {
      success: false,
      error: error?.message || 'Failed to save progress. Please try again.'
    };
  }
};

export const submitSMSFForm = async (formData: FormData) => {
  try {
    console.log("Submitting SMSF form with data:", formData);
    
    const formDataToSubmit = new FormData();
    // Ensure formType is set to smsf
    formDataToSubmit.append('formType', 'smsf');
    
    if(formData instanceof FormData) {
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        if (key !== 'formType') {
          formDataToSubmit.append(key, value);
        }
      }
    }
    // Log the contents of the FormData
    else {
      for (const [key, value] of Object.entries(formData)) {
        if (key !== 'formType' && value !== null && value !== undefined) {
          if (typeof value === "object" && value !== null && !(value instanceof File)) {
            // Convert object to JSON string for FormData
            console.log(`Appending object: ${key} = ${JSON.stringify(value)}`);
            formDataToSubmit.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            console.log(`Appending file: ${key} = ${value.name}`);
            formDataToSubmit.append(key, value);
          } else {
            console.log(`Appending string: ${key} = ${String(value)}`);
            formDataToSubmit.append(key, String(value));
          }
        }
      }
    }
    
    // Clear localStorage after submission
    localStorage.removeItem('smsfFormData');
    
    const response = await apiClient.post('/tax-solutions/submit', formDataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Error submitting SMSF form:', error);
    return {
      success: false,
      error: error?.message || 'Failed to submit form. Please try again.'
    };
  }
};