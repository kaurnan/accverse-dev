// import apiClient from "../services/api"

// export const validateBusinessFormStep = async (step: number, formData: any): Promise<Record<string, string>> => {
//   const errors: Record<string, string> = {}

//   // Implement validation for specific steps
//   switch (step) {
//     case 1:
//       // Business details validation
//       if (!formData.entityName) {
//         errors.entityName = "Entity name is required"
//       }
//       if (!formData.contactName) {
//         errors.contactName = "Contact name is required"
//       }
//       if (!formData.contactEmail) {
//         errors.contactEmail = "Contact email is required"
//       }
//       if (!formData.contactMobile) {
//         errors.contactMobile = "Contact mobile is required"
//       }
//       if (!formData.streetAddress) {
//         errors.streetAddress = "Street address is required"
//       }
//       if (!formData.city) {
//         errors.city = "City is required"
//       }
//       if (!formData.state) {
//         errors.state = "State is required"
//       }
//       if (!formData.postcode) {
//         errors.postcode = "Postcode is required"
//       }
//       break
//     case 2:
//       // Bank details validation
//       if (!formData.bankBsb) {
//         errors.bankBsb = "BSB is required"
//       } else {
//         // Clean BSB for validation (remove dash)
//         const cleanedBsb = String(formData.bankBsb).replace(/[^\d]/g, "")
//         if (cleanedBsb.length === 0) {
//           errors.bankBsb = "BSB is required"
//         } else if (cleanedBsb.length !== 6) {
//           errors.bankBsb = "BSB must be 6 digits (format: XXX-XXX)"
//         }
//       }
//       if (!formData.bankAccountNo) {
//         errors.bankAccountNo = "Account number is required"
//       } else if (!/^\d{6,10}$/.test(formData.bankAccountNo)) {
//         errors.bankAccountNo = "Account number must be 6-10 digits"
//       }
//       if (!formData.confirmAccountNo) {
//         errors.confirmAccountNo = "Confirm account number is required"
//       } else if (formData.bankAccountNo !== formData.confirmAccountNo) {
//         errors.confirmAccountNo = "Account numbers do not match"
//       }
//       if (!formData.bankAccountName) {
//         errors.bankAccountName = "Account name is required"
//       }
//       if (!formData.bankName) {
//         errors.bankName = "Bank name is required"
//       }
//       if (!formData.financialYear) {
//         errors.financialYear = "Financial year is required"
//       }
//       if (!formData.updateAtoDetails) {
//         errors.updateAtoDetails = "Please select whether to update ATO details"
//       }
//       if(!canProceed){
//         return {success: false, errors}
//         return errors;
//       }
//       break
//     case 3:
//       // Business operations validation
//       if (!formData.accountingSoftware) {
//         errors.accountingSoftware = "Please select your accounting software"
//       }
//       if (!formData.motorVehicles) {
//         errors.motorVehicles = "Please select whether you have motor vehicles"
//       }
//       if (!formData.fbtRegistered) {
//         errors.fbtRegistered = "Please select whether you are registered for FBT"
//       }
//       if (!formData.employeeCount) {
//         errors.employeeCount = "Please enter the number of employees"
//       }
//       if (!formData.div7aLoans) {
//         errors.div7aLoans = "Please select whether you have Div 7A loans"
//       }
//       if (!formData.trustType) {
//         errors.trustType = "Please select your trust type"
//       }
//       break
//     case 4:
//       // Additional info validation
//       if (formData.declarationAccepted !== "yes") {
//         errors.declarationAccepted = "You must accept the declaration to proceed"
//       }
//       break
//     case 5:
//       // Engagement letter validation
//       if (!formData.engagementLetter || !formData.engagementLetter.accepted) {
//         errors.engagementLetter = "You must complete the engagement letter to proceed"
//       }
//       break
//     case 6:
//       // Final declaration validation
//       if (formData.declarationAccepted !== "yes") {
//         errors.declarationAccepted = "You must accept the declaration to submit the form"
//       }
//       break
//   }

//   return errors
// }

// export const saveBusinessFormProgress = async (formData: any) => {
//   try {
//     // Ensure form type is set to business
//     // const dataToSave = { ...formData, formType: "business" }
//     // console.log("Saving business form progress with data:", dataToSave)
//     const dataToSave = { ...formData }
//     console.log("Saving business form progress with data:", dataToSave)
//     console.log("Form type being saved:", dataToSave.formType)
//     const response = await apiClient.post("/tax-solutions/save-progress", dataToSave)
//     return { success: true, id: response.data.id }
//   } catch (error: any) {
//     console.error("Error saving business form progress:", error)
//     return { success: false, error: error?.message || "Failed to save progress. Please try again." }
//   }
// }

// // export const submitBusinessForm = async (formData: FormData | any) => {
// //   try {
// //     console.log("Submitting business form...")
// //     // Create a new FormData object to ensure we have control over what's being sent
// //     const formDataToSubmit = new FormData()

// //     // Get form type from the input or default to "business"
// //     const formType = formData instanceof FormData ? formData.get("formType") : formData.formType
// //     console.log("Form type being submitted:", formType)
// //     formDataToSubmit.append("formType", formType || "business")

// //     const entityName = formData instanceof FormData ? formData.get("entityName") : formData.entityName

// //     if (!entityName || String(entityName).trim() === "") {
// //       console.error("Entity name is required")
// //       return {
// //         success: false,
// //         error: "Missing required field: entityName",
// //       }
// //     }

// //     // Handle both FormData and plain object
// //     if (formData instanceof FormData) {
// //       // Copy all entries from the original FormData
// //       for (const [key, value] of (formData as any).entries()) {
// //         console.log(`Appending from FormData: ${key} = ${value instanceof File ? "File: " + value.name : value}`)
// //         formDataToSubmit.append(key, value)
// //         // If it's a file, append its form type
// //         if (value instanceof File) {
// //           const fileFormType = formData.get(`${key}_formType`) || formType || "business"
// //           formDataToSubmit.append(`${key}_formType`, fileFormType)
// //         }
// //       }
// //     } else {
// //       // If it's a plain object, convert to FormData
// //       for (const [key, value] of Object.entries(formData)) {
// //         if (value !== null && value !== undefined) {
// //           if (typeof value === "object" && value !== null && !(value instanceof File)) {
// //             // Convert object to JSON string for FormData
// //             console.log(`Appending object: ${key} = ${JSON.stringify(value)}`)
// //             formDataToSubmit.append(key, JSON.stringify(value))
// //           } else if (value instanceof File) {
// //             console.log(`Appending file: ${key} = ${value.name}`)
// //             formDataToSubmit.append(key, value)
// //             // Append form type for the file
// //             formDataToSubmit.append(`${key}_formType`, formType || "business")
// //           } else {
// //             console.log(`Appending string: ${key} = ${String(value)}`)
// //             formDataToSubmit.append(key, String(value))
// //           }
// //         } else {
// //           // Include empty values for non-required fields
// //           console.log(`Appending empty: ${key} = ""`)
// //           formDataToSubmit.append(key, "")
// //         }
// //       }
// //     }

// //     formDataToSubmit.append("source", formType || "accounting_services" ? "accounting" : "tax_solutions")
// //     // Log some key fields for debugging
// //     console.log("Form submission details:", {
// //       formType: formDataToSubmit.get("formType"),
// //       source: formDataToSubmit.get("source"),
// //       entityName: formDataToSubmit.get("entityName"),
// //       contactName: formDataToSubmit.get("contactName"),
// //       hasFiles: formDataToSubmit.has("ownerIdDocument"),
// //     })

// //     const response = await apiClient.post("/tax-solutions/submit", formDataToSubmit, {
// //       headers: {
// //         "Content-Type": "multipart/form-data",
// //       },
// //     })

// //     if (response.data.success) {
// //       return {
// //         success: true,
// //         data: response.data.data,
// //       }
// //     } else {
// //       return {
// //         success: false,
// //         error: response.data.error || "An error occurred while submitting the form",
// //       }
// //     }
// //   } catch (error: any) {
// //     console.error("Error submitting business form:", error)
// //     return {
// //       success: false,
// //       error: error.response?.data?.error || "An error occurred while submitting the form",
// //     }
// //   }
// // }


// export const submitBusinessForm = async (formData: FormData | any) => {
//   try {
//     console.log("Submitting business form...")
    
//     // Create a new FormData object to ensure we have control over what's being sent
//     const formDataToSubmit = new FormData()

//     // Get the proper form type - IMPORTANT: Ensure we get this value accurately
//     let formType = '';
    
//     if (formData instanceof FormData) {
//       // When working with FormData, get the last formType value (as there might be multiple)
//       const formTypeValues = formData.getAll('formType');
//       formType = formTypeValues.length > 0 ? formTypeValues[formTypeValues.length - 1] as string : 'business';
//     } else {
//       formType = formData.formType || 'business';
//     }
    
//     console.log("Form type being submitted:", formType);
    
//     // Explicitly set the form type as the ONLY formType value
//     formDataToSubmit.append("formType", formType);

//     const entityName = formData instanceof FormData ? formData.get("entityName") : formData.entityName;

//     if (!entityName || String(entityName).trim() === "") {
//       console.error("Entity name is required");
//       return {
//         success: false,
//         error: "Missing required field: entityName",
//       };
//     }

//     // Handle both FormData and plain object
//     if (formData instanceof FormData) {
//       // Copy all entries from the original FormData EXCEPT formType (we already set it)
//       for (const [key, value] of (formData as any).entries()) {
//         if (key !== 'formType') {
//           console.log(`Appending from FormData: ${key} = ${value instanceof File ? "File: " + value.name : value}`);
//           formDataToSubmit.append(key, value);
//         }
//       }
//     } else {
//       // If it's a plain object, convert to FormData
//       for (const [key, value] of Object.entries(formData)) {
//         if (key !== 'formType' && value !== null && value !== undefined) {
//           if (typeof value === "object" && value !== null && !(value instanceof File)) {
//             // Convert object to JSON string for FormData
//             console.log(`Appending object: ${key} = ${JSON.stringify(value)}`);
//             formDataToSubmit.append(key, JSON.stringify(value));
//           } else if (value instanceof File) {
//             console.log(`Appending file: ${key} = ${value.name}`);
//             formDataToSubmit.append(key, value);
//           } else {
//             console.log(`Appending string: ${key} = ${String(value)}`);
//             formDataToSubmit.append(key, String(value));
//           }
//         }
//       }
//     }

//     // Add a source field to identify where the form was submitted from
//     const source = formType === "accounting_services" ? "accounting" : "tax_solutions";
//     formDataToSubmit.append("source", source);
    
//     // Set the form_type field explicitly for backend database storage
//     formDataToSubmit.append("form_type", formType);

//     // Log some key fields for debugging
//     console.log("Form submission details:", {
//       formType: formDataToSubmit.get("formType"),
//       form_type: formDataToSubmit.get("form_type"),
//       source: formDataToSubmit.get("source"),
//       entityName: formDataToSubmit.get("entityName"),
//       hasFiles: formDataToSubmit.has("ownerIdDocument"),
//     });

//     const response = await apiClient.post("/tax-solutions/submit", formDataToSubmit, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("Form submission response:", response.data);
//     return { success: true, data: response.data };
//   } catch (error: any) {
//     console.error("Error submitting business form:", error);
//     return {
//       success: false,
//       error: error?.message || "Failed to submit form. Please try again.",
//     };
//   }
// }

import apiClient from "../services/api"

export const validateBusinessFormStep = async (step: number, formData: any): Promise<Record<string, string>> => {
  const errors: Record<string, string> = {}
  let canProceed = true

  // Implement validation for specific steps
  switch (step) {
    case 1:
      // Business details validation
      if (!formData.entityName) {
        errors.entityName = "Entity name is required"
      }
      if (!formData.contactName) {
        errors.contactName = "Contact name is required"
      }
      if (!formData.contactEmail) {
        errors.contactEmail = "Contact email is required"
      }
      if (!formData.contactMobile) {
        errors.contactMobile = "Contact mobile is required"
      }
      if (!formData.streetAddress) {
        errors.streetAddress = "Street address is required"
      }
      if (!formData.city) {
        errors.city = "City is required"
      }
      if (!formData.state) {
        errors.state = "State is required"
      }
      if (!formData.postcode) {
        errors.postcode = "Postcode is required"
      }
      break
    case 2:
      // Bank details validation
      if (!formData.bankBsb) {
        errors.bankBsb = "BSB is required"
        canProceed = false
      } else {
        // Clean BSB for validation (remove dash)
        const cleanedBsb = String(formData.bankBsb).replace(/[^\d]/g, "")
        if (cleanedBsb.length === 0) {
          errors.bankBsb = "BSB is required"
          canProceed = false
        } else if (cleanedBsb.length !== 6) {
          errors.bankBsb = "BSB must be 6 digits (format: XXX-XXX)"
          canProceed = false
        }
      }
      if (!formData.bankAccountNo) {
        errors.bankAccountNo = "Account number is required"
        canProceed = false
      } else if (!/^\d{6,10}$/.test(formData.bankAccountNo)) {
        errors.bankAccountNo = "Account number must be 6-10 digits"
        canProceed = false
      }
      if (!formData.confirmAccountNo) {
        errors.confirmAccountNo = "Confirm account number is required"
        canProceed = false
      } else if (formData.bankAccountNo !== formData.confirmAccountNo) {
        errors.confirmAccountNo = "Account numbers do not match"
        canProceed = false
      }
      if (!formData.bankAccountName) {
        errors.bankAccountName = "Account name is required"
        canProceed = false
      }
      if (!formData.bankName) {
        errors.bankName = "Bank name is required"
        canProceed = false
      }
      if (!formData.financialYear) {
        errors.financialYear = "Financial year is required"
      }
      if (!formData.updateAtoDetails) {
        errors.updateAtoDetails = "Please select whether to update ATO details"
      }
      // Only allow progression if all banking details are valid
      if (!canProceed) {
        return errors;
      }
      break
    case 3:
      // Business operations validation
      if (!formData.accountingSoftware) {
        errors.accountingSoftware = "Please select your accounting software"
      }
      if (!formData.motorVehicles) {
        errors.motorVehicles = "Please select whether you have motor vehicles"
      }
      if (!formData.fbtRegistered) {
        errors.fbtRegistered = "Please select whether you are registered for FBT"
      }
      if (!formData.employeeCount) {
        errors.employeeCount = "Please enter the number of employees"
      }
      if (!formData.div7aLoans) {
        errors.div7aLoans = "Please select whether you have Div 7A loans"
      }
      if (!formData.trustType) {
        errors.trustType = "Please select your trust type"
      }
      break
    case 4:
      // Additional info validation
      if (formData.declarationAccepted !== "yes") {
        errors.declarationAccepted = "You must accept the declaration to proceed"
      }
      break
    case 5:
      // Engagement letter validation
      if (!formData.engagementLetter || !formData.engagementLetter.accepted) {
        errors.engagementLetter = "You must complete the engagement letter to proceed"
      }
      break
    case 6:
      // Final declaration validation
      if (formData.declarationAccepted !== "yes") {
        errors.declarationAccepted = "You must accept the declaration to submit the form"
      }
      break
  }
  return errors
}

export const saveBusinessFormProgress = async (formData: any) => {
  try {
    // Ensure form type is preserved from the input
    const dataToSave = { ...formData }
    
    // Make sure formType is set and consistent
    if (!dataToSave.formType || dataToSave.formType === '') {
      dataToSave.formType = 'tax_business'; // Default to business if no type provided
    }
    
    // Ensure form_type is set to the same value
    dataToSave.form_type = dataToSave.formType;
    
    // console.log("Saving business form progress with data:", dataToSave)
    // console.log("Form type being saved:", dataToSave.formType)
    // console.log("Form_type being saved:", dataToSave.form_type)
    console.log("Saving business form progress to localStorage with formType:", dataToSave.formType)
    localStorage.setItem('businessFormData', JSON.stringify(dataToSave))
    // const response = await apiClient.post("/tax-solutions/save-progress", dataToSave)
    // return { success: true, id: response.data.id }
    return { success: true, id: 'local-storage'};
  } catch (error: any) {
    // console.error("Error saving business form progress:", error)
    // return { success: false, error: error?.message || "Failed to save progress. Please try again." }
    return { success: false, error: error?.message || "Failed to save progress. Please try again." }
  }
}

export const submitBusinessForm = async (formData: FormData | any) => {
  try {
    console.log("Submitting business form...")
    
    // Create a new FormData object to ensure we have control over what's being sent
    const formDataToSubmit = new FormData()

    // Get the proper form type - IMPORTANT: Ensure we get this value accurately
    let formType = '';
    
    if (formData instanceof FormData) {
      // Get formType value, ensuring there's only one 
      formType = formData.get('formType') as string || 'tax_business';
      
      // When the form has a form_type field, prioritize that
      const formTypeFromForm = formData.get('form_type') as string;
      if (formTypeFromForm) {
        formType = formTypeFromForm; 
      }
    } else {
      // For object data, prioritize form_type if present
      formType = formData.form_type || formData.formType || 'tax_business';
    }
    
    console.log("Form type being submitted:", formType);
    localStorage.removeItem('businessFormData');
    // Explicitly set both formType and form_type to ensure consistency
    formDataToSubmit.append("formType", formType);
    formDataToSubmit.append("form_type", formType);

    const entityName = formData instanceof FormData ? formData.get("entityName") : formData.entityName;

    if (!entityName || String(entityName).trim() === "") {
      console.error("Entity name is required");
      return {
        success: false,
        error: "Missing required field: entityName",
      };
    }

    // Handle both FormData and plain object
    if (formData instanceof FormData) {
      // Copy all entries from the original FormData EXCEPT formType (we already set it)
      for (const [key, value] of formData.entries()) {
        if (key !== 'formType' && key !== 'form_type') {
          console.log(`Appending from FormData: ${key} = ${value instanceof File ? "File: " + value.name : value}`);
          formDataToSubmit.append(key, value);
        }
      }
    } else {
      // If it's a plain object, convert to FormData
      for (const [key, value] of Object.entries(formData)) {
        if (key !== 'formType' && key !== 'form_type') {
          if (value !== null && value !== undefined) {
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
    }

    // Add a source field to identify where the form was submitted from
    const source = formType === "accounting_services" ? "accounting" : "tax_solutions";
    formDataToSubmit.append("source", source);

    // Log some key fields for debugging
    console.log("Form submission details:", {
      formType: formDataToSubmit.get("formType"),
      form_type: formDataToSubmit.get("form_type"),
      source: formDataToSubmit.get("source"),
      entityName: formDataToSubmit.get("entityName"),
      hasFiles: formDataToSubmit.has("ownerIdDocument"),
    });

    const response = await apiClient.post("/tax-solutions/submit", formDataToSubmit, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Form submission response:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error submitting business form:", error);
    return {
      success: false,
      error: error?.message || "Failed to submit form. Please try again.",
    };
  }
}