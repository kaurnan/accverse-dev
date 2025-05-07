// Form validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Australian phone number validation (mobile)
  const phoneRegex = /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/
  return phoneRegex.test(phone)
}

export const validateBSB = (bsb: string): boolean => {
  // First remove any non-numeric characters for validation
  const cleanedBsb = String(bsb).replace(/[^\d]/g, "")
  // BSB validation - must be exactly 6 digits
  return cleanedBsb.length === 6
}

export const validateAccountNumber = (accountNo: string): boolean => {
  // Basic account number validation - between 6 and 10 digits
  const accountRegex = /^\d{6,10}$/
  return accountRegex.test(accountNo)
}

export const validatePostcode = (postcode: string): boolean => {
  // Australian postcode validation
  const postcodeRegex = /^\d{4}$/
  return postcodeRegex.test(postcode)
}

export const validateTFN = (tfn: string): boolean => {
  // TFN validation - 8 or 9 digits
  const tfnRegex = /^\d{8,9}$/
  return tfnRegex.test(tfn)
}

export const validateABN = (abn: string): boolean => {
  // ABN validation - 11 digits
  const abnRegex = /^\d{11}$/
  return abnRegex.test(abn)
}

export const validateACN = (acn: string): boolean => {
  // ACN validation - 9 digits
  const acnRegex = /^\d{9}$/
  return acnRegex.test(acn)
}

export const validateRequiredField = (value: string | undefined | null): boolean => {
  if (value === undefined || value === null) return false
  return value.trim() !== ""
}

export const isFutureDate = (date: string): boolean => {
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate > today
}

export const isDateOverOneHundredYearsAgo = (date: string): boolean => {
  const selectedDate = new Date(date)
  const hundredYearsAgo = new Date()
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100)
  return selectedDate < hundredYearsAgo
}

export const validateDate = (date: string): boolean => {
  if (!date) return false
  const dateObj = new Date(date)
  return !isNaN(dateObj.getTime())
}

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const validateName = (name: string): boolean => {
  // Names should be at least 2 characters and contain only letters, spaces, hyphens and apostrophes
  const nameRegex = /^[A-Za-z\s'-]{2,}$/
  return nameRegex.test(name)
}

export const validateDOB = (dob: string): boolean => {
  // Check if date is valid
  if (!validateDate(dob)) return false

  // Check if date is in the future
  if (isFutureDate(dob)) return false

  // Check if date is more than 100 years ago
  if (isDateOverOneHundredYearsAgo(dob)) return false

  return true
}

export const validateMatchingValues = (value1: string, value2: string): boolean => {
  return value1 === value2
}

// Generate form validation errors
// ... keep existing code (function validateForm, etc.)

// Specific form validation functions for SMSF
export const validateSMSFFormStep1 = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // SMSF Name validation
  if (!validateRequiredField(formData.smsfName)) {
    errors.smsfName = "SMSF name is required"
  } else if (formData.smsfName.length > 100) {
    errors.smsfName = "SMSF name cannot exceed 100 characters"
  }

  // Address validation
  if (!validateRequiredField(formData.streetAddress)) {
    errors.streetAddress = "Street address is required"
  } else if (formData.streetAddress.length > 100) {
    errors.streetAddress = "Street address cannot exceed 100 characters"
  }

  if (formData.streetAddress2 && formData.streetAddress2.length > 100) {
    errors.streetAddress2 = "Additional address line cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.city)) {
    errors.city = "City is required"
  } else if (formData.city.length > 50) {
    errors.city = "City cannot exceed 50 characters"
  }

  if (!validateRequiredField(formData.state)) {
    errors.state = "State is required"
  }

  if (!validateRequiredField(formData.postcode)) {
    errors.postcode = "Postcode is required"
  } else if (!validatePostcode(formData.postcode)) {
    errors.postcode = "Please enter a valid Australian postcode (4 digits)"
  }

  // Contact validation
  if (!validateRequiredField(formData.contactName)) {
    errors.contactName = "Contact name is required"
  } else if (formData.contactName.length > 100) {
    errors.contactName = "Contact name cannot exceed 100 characters"
  }

  if (formData.contactPosition && formData.contactPosition.length > 100) {
    errors.contactPosition = "Contact position cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.contactPhone) && !validateRequiredField(formData.contactMobile)) {
    errors.contactPhone = "At least one contact number is required"
  } else {
    if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
      errors.contactPhone = "Please enter a valid Australian phone number"
    }

    if (formData.contactMobile && !validatePhone(formData.contactMobile)) {
      errors.contactMobile = "Please enter a valid Australian mobile number"
    }
  }

  if (!validateRequiredField(formData.contactEmail)) {
    errors.contactEmail = "Contact email is required"
  } else if (!validateEmail(formData.contactEmail)) {
    errors.contactEmail = "Please enter a valid email address"
  } else if (formData.contactEmail.length > 100) {
    errors.contactEmail = "Email cannot exceed 100 characters"
  }

  // Trustee Type validation
  if (!validateRequiredField(formData.trusteeType)) {
    errors.trusteeType = "Trustee type is required"
  }

  // Financial Year validation
  if (!validateRequiredField(formData.financialYear)) {
    errors.financialYear = "Financial year is required"
  }

  // ATO Details validation
  if (!validateRequiredField(formData.updateAtoDetails)) {
    errors.updateAtoDetails = "Please select whether ATO details should be updated"
  }

  // Bank Details validation
  if (!validateRequiredField(formData.bankBsb)) {
    errors.bankBsb = "BSB number is required";
  } else if (!validateBSB(formData.bankBsb)) {
    errors.bankBsb = "Please enter a valid BSB number (format: XXX-XXX)";
  }

  if (!validateRequiredField(formData.bankName)) {
    errors.bankName = "Bank name is required";
  } else if (formData.bankName.length > 100) {
    errors.bankName = "Bank name cannot exceed 100 characters";
  }

  if (!validateRequiredField(formData.bankAccountName)) {
    errors.bankAccountName = "Account name is required";
  } else if (formData.bankAccountName.length > 100) {
    errors.bankAccountName = "Account name cannot exceed 100 characters";
  }

  if (!validateRequiredField(formData.bankAccountNo)) {
    errors.bankAccountNo = "Account number is required";
  } else if (!validateAccountNumber(formData.bankAccountNo)) {
    errors.bankAccountNo = "Please enter a valid account number (6-10 digits)";
  }

  if (!validateRequiredField(formData.confirmAccountNo)) {
    errors.confirmAccountNo = "Confirm account number is required";
  } else if (formData.bankAccountNo !== formData.confirmAccountNo) {
    errors.confirmAccountNo = "Account numbers do not match";
  }

  if (formData.electronicServiceAddress && formData.electronicServiceAddress.length > 100) {
    errors.electronicServiceAddress = "Electronic service address cannot exceed 100 characters"
  }

  return errors
}

export const validateSMSFFormStep2 = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Member Count validation
  if (!validateRequiredField(formData.memberCount)) {
    errors.memberCount = "Please select the number of members"
  }

  // Previous Accountant validation - These aren't required fields
  if (formData.prevAccountantName && formData.prevAccountantName.length > 100) {
    errors.prevAccountantName = "Accountant name cannot exceed 100 characters"
  }

  if (formData.prevAccountantContact && formData.prevAccountantContact.length > 100) {
    errors.prevAccountantContact = "Contact name cannot exceed 100 characters"
  }

  if (formData.prevAccountantPhone && !validatePhone(formData.prevAccountantPhone)) {
    errors.prevAccountantPhone = "Please enter a valid Australian phone number"
  }

  if (formData.prevAccountantMobile && !validatePhone(formData.prevAccountantMobile)) {
    errors.prevAccountantMobile = "Please enter a valid Australian mobile number"
  }

  if (formData.prevAccountantEmail && !validateEmail(formData.prevAccountantEmail)) {
    errors.prevAccountantEmail = "Please enter a valid email address"
  }

  return errors
}

// Add first name field to the form data on submission to fix backend error
export const addRequiredFieldsForBackend = (formData: Record<string, any>): Record<string, any> => {
  // Make a copy to avoid modifying the original
  const updatedFormData = { ...formData }

  // Add firstName field using contactName if not present
  if (!updatedFormData.firstName && updatedFormData.contactName) {
    const nameParts = updatedFormData.contactName.split(" ")
    updatedFormData.firstName = nameParts[0] || ""

    if (nameParts.length > 1) {
      updatedFormData.lastName = nameParts[nameParts.length - 1] || ""
    }
  }

  return updatedFormData
}

// Company Registration Form specific validation
export const validateCompanyRegistrationForm = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Company Details validation
  if (!validateRequiredField(formData.preferredCompanyName)) {
    errors.preferredCompanyName = "Company name is required"
  }

  if (!validateRequiredField(formData.registeredOfficeAddress)) {
    errors.registeredOfficeAddress = "Registered office address is required"
  }

  if (!validateRequiredField(formData.principalPlaceOfBusiness)) {
    errors.principalPlaceOfBusiness = "Principal place of business is required"
  }

  if (!validateRequiredField(formData.businessActivity)) {
    errors.businessActivity = "Business activity is required"
  }

  // ABN validation (must be exactly 11 digits if provided)
  if (formData.businessNameABN && formData.businessNameABN.length !== 11) {
    errors.businessNameABN = "ABN must be exactly 11 digits"
  }

  // ACN validation (must be exactly 9 digits if provided)
  if (formData.shareholderACN && formData.shareholderACN.length !== 9) {
    errors.shareholderACN = "ACN must be exactly 9 digits"
  }

  // Officeholder Details validation
  if (!validateRequiredField(formData.fullName)) {
    errors.fullName = "Full name is required"
  }

  if (!validateRequiredField(formData.residentialAddress)) {
    errors.residentialAddress = "Residential address is required"
  }

  if (!validateRequiredField(formData.dateOfBirth)) {
    errors.dateOfBirth = "Date of birth is required"
  } else if (!validateDOB(formData.dateOfBirth)) {
    errors.dateOfBirth = "Please enter a valid date of birth"
  }

  if (!validateRequiredField(formData.placeOfBirth)) {
    errors.placeOfBirth = "Place of birth is required"
  }

  // Shareholder Details validation
  if (!validateRequiredField(formData.shareholderName)) {
    errors.shareholderName = "Shareholder name is required"
  }

  if (!validateRequiredField(formData.shareholderAddress)) {
    errors.shareholderAddress = "Shareholder address is required"
  }

  // ABN Registration validation
  if (!validateRequiredField(formData.mainIndustry)) {
    errors.mainIndustry = "Main industry is required"
  }

  if (!validateRequiredField(formData.mainActivity)) {
    errors.mainActivity = "Main activity is required"
  }

  return errors
}

// Generate form validation errors
export const validateForm = (formData: Record<string, any>): Record<string, string> => {
  // If it's a company registration form, use the specific validation
  if (formData.formType === "company-registration") {
    return validateCompanyRegistrationForm(formData)
  }

  const errors: Record<string, string> = {}

  // Name validation
  if (formData.firstName && !validateName(formData.firstName)) {
    errors.firstName = "Please enter a valid first name"
  }

  if (formData.lastName && !validateName(formData.lastName)) {
    errors.lastName = "Please enter a valid last name"
  }

  // Email validation
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Phone validation
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid Australian phone number"
  }

  if (formData.mobile && !validatePhone(formData.mobile)) {
    errors.mobile = "Please enter a valid Australian mobile number"
  }

  // Date validation
  if (formData.dob && !validateDOB(formData.dob)) {
    errors.dob = "Please enter a valid date of birth"
  }

  if (formData.dateOfBirth && !validateDOB(formData.dateOfBirth)) {
    errors.dateOfBirth = "Please enter a valid date of birth"
  }

  // Postcode validation
  if (formData.postcode && !validatePostcode(formData.postcode)) {
    errors.postcode = "Please enter a valid Australian postcode (4 digits)"
  }

  // TFN validation
  if (formData.tfn && !validateTFN(formData.tfn)) {
    errors.tfn = "Please enter a valid TFN (8-9 digits)"
  }

  // ABN validation
  if (formData.abn && !validateABN(formData.abn)) {
    errors.abn = "Please enter a valid ABN (11 digits)"
  }

  // ACN validation
  if (formData.acn && !validateACN(formData.acn)) {
    errors.acn = "Please enter a valid ACN (9 digits)"
  }

  // Banking details validation
  if (!validateRequiredField(formData.bankBsb)) {
    errors.bankBsb = "BSB number is required";
  } else if (!validateBSB(formData.bankBsb)) {
    errors.bankBsb = "Please enter a valid BSB number (format: XXX-XXX)";
  }

  if (formData.bankAccountNo && !validateAccountNumber(formData.bankAccountNo)) {
    errors.bankAccountNo = "Please enter a valid account number (6-10 digits)"
  }

  if (!validateRequiredField(formData.confirmAccountNo)) {
    errors.confirmAccountNo = "Confirm account number is required";
  } else if (formData.bankAccountNo !== formData.confirmAccountNo) {
    errors.confirmAccountNo = "Account numbers do not match";
  }

  if (formData.formType === "business") {
    // Business-specific validation
    if (!formData.entityName) {
      errors.entityName = "Business name is required"
    }

    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
      errors.contactEmail = "Please enter a valid email address"
    }

    if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
      errors.contactPhone = "Please enter a valid phone number"
    }

    if (formData.contactMobile && !validatePhone(formData.contactMobile)) {
      errors.contactMobile = "Please enter a valid mobile number"
    }
  } else if (formData.formType === "smsf") {
    // SMSF-specific validation
    if (!formData.smsfName) {
      errors.smsfName = "SMSF name is required"
    }

    if (!formData.trusteeType) {
      errors.trusteeType = "Trustee type is required"
    }
  } else if ("entityType" in formData) {
    // Engagement Letter Form
    if (!formData.date) {
      errors.date = "Date is required"
    }

    if (!formData.entityType) {
      errors.entityType = "Entity type is required"
    }

    if (!formData.streetAddress) {
      errors.streetAddress = "Street address is required"
    }

    if (!formData.suburb) {
      errors.suburb = "Suburb is required"
    }

    if (!formData.state) {
      errors.state = "State is required"
    }

    if (!formData.postcode) {
      errors.postcode = "Postcode is required"
    } else if (!validatePostcode(formData.postcode)) {
      errors.postcode = "Postcode must be 4 digits"
    }

    if (!formData.signature) {
      errors.signature = "Signature is required"
    }
  } else if ("preferredCompanyName" in formData) {
    // Company Registration Form
    if (!formData.preferredCompanyName) {
      errors.preferredCompanyName = "Company name is required"
    }

    if (!formData.registeredOfficeAddress) {
      errors.registeredOfficeAddress = "Registered office address is required"
    }

    if (!formData.principalPlaceOfBusiness) {
      errors.principalPlaceOfBusiness = "Principal place of business is required"
    }

    if (!formData.businessActivity) {
      errors.businessActivity = "Business activity is required"
    }

    if (!formData.fullName) {
      errors.fullName = "Full name is required"
    }

    if (!formData.residentialAddress) {
      errors.residentialAddress = "Residential address is required"
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required"
    }

    if (!formData.placeOfBirth) {
      errors.placeOfBirth = "Place of birth is required"
    }

    if (!formData.shareholderName) {
      errors.shareholderName = "Shareholder name is required"
    }

    if (!formData.shareholderAddress) {
      errors.shareholderAddress = "Shareholder address is required"
    }

    if (!formData.mainIndustry) {
      errors.mainIndustry = "Main industry is required"
    }

    if (!formData.mainActivity) {
      errors.mainActivity = "Main activity is required"
    }
  } else if ("contactName" in formData) {
    // SMSF Establishment Form
    if (!formData.contactName) {
      errors.contactName = "Contact name is required"
    }

    if (!formData.email && !formData.contactEmail) {
      const emailField = "email" in formData ? "email" : "contactEmail"
      errors[emailField] = "Email is required"
    } else if (
      (formData.email && !validateEmail(formData.email)) ||
      (formData.contactEmail && !validateEmail(formData.contactEmail))
    ) {
      const emailField = "email" in formData ? "email" : "contactEmail"
      const emailValue = "email" in formData ? formData.email : formData.contactEmail
      if (emailValue) {
        errors[emailField] = "Email is invalid"
      }
    }

    if (!formData.proposedFundName) {
      errors.proposedFundName = "Fund name is required"
    }

    if (!formData.registeredOfficeAddress) {
      errors.registeredOfficeAddress = "Registered office address is required"
    }

    if (!formData.registeredOfficeCity) {
      errors.registeredOfficeCity = "City is required"
    }

    if (!formData.registeredOfficeState) {
      errors.registeredOfficeState = "State is required"
    }

    if (!formData.registeredOfficePostalCode) {
      errors.registeredOfficePostalCode = "Postal code is required"
    } else if (!validatePostcode(formData.registeredOfficePostalCode)) {
      errors.registeredOfficePostalCode = "Postal code must be 4 digits"
    }
  }
  return errors
}

// Validate business form steps
export const validateBusinessFormStep1 = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Entity details validation
  if (!validateRequiredField(formData.entityName)) {
    errors.entityName = "Entity name is required"
  } else if (formData.entityName.length > 100) {
    errors.entityName = "Entity name cannot exceed 100 characters"
  }

  // ABN validation (if provided)
  if (formData.abn && !validateABN(formData.abn)) {
    errors.abn = "Please enter a valid ABN (11 digits)"
  }

  // ACN validation (if provided)
  if (formData.acn && !validateACN(formData.acn)) {
    errors.acn = "Please enter a valid ACN (9 digits)"
  }

  // TFN validation (if provided)
  if (formData.tfn && !validateTFN(formData.tfn)) {
    errors.tfn = "Please enter a valid TFN (8-9 digits)"
  }

  // Contact validation
  if (!validateRequiredField(formData.contactName)) {
    errors.contactName = "Contact name is required"
  } else if (formData.contactName.length > 100) {
    errors.contactName = "Contact name cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.contactEmail)) {
    errors.contactEmail = "Contact email is required"
  } else if (!validateEmail(formData.contactEmail)) {
    errors.contactEmail = "Please enter a valid email address"
  } else if (formData.contactEmail.length > 100) {
    errors.contactEmail = "Email cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.contactPhone) && !validateRequiredField(formData.contactMobile)) {
    errors.contactPhone = "At least one contact number is required"
  } else {
    if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
      errors.contactPhone = "Please enter a valid Australian phone number"
    }

    if (formData.contactMobile && !validatePhone(formData.contactMobile)) {
      errors.contactMobile = "Please enter a valid Australian mobile number"
    }
  }

  // Address validation
  if (!validateRequiredField(formData.streetAddress)) {
    errors.streetAddress = "Street address is required"
  } else if (formData.streetAddress.length > 100) {
    errors.streetAddress = "Street address cannot exceed 100 characters"
  }

  if (formData.streetAddress2 && formData.streetAddress2.length > 100) {
    errors.streetAddress2 = "Additional address line cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.city)) {
    errors.city = "City is required"
  } else if (formData.city.length > 50) {
    errors.city = "City cannot exceed 50 characters"
  }

  if (!validateRequiredField(formData.state)) {
    errors.state = "State is required"
  }

  if (!validateRequiredField(formData.postcode)) {
    errors.postcode = "Postcode is required"
  } else if (!validatePostcode(formData.postcode)) {
    errors.postcode = "Please enter a valid Australian postcode (4 digits)"
  }

  return errors
}

export const validateBusinessFormStep2 = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Banking details validation
  if (!validateRequiredField(formData.bankBsb)) {
    errors.bankBsb = "BSB number is required"
  } else if (!validateBSB(formData.bankBsb)) {
    errors.bankBsb = "Please enter a valid BSB number (format: XXX-XXX)"
  }

  if (!validateRequiredField(formData.bankName)) {
    errors.bankName = "Bank name is required"
  } else if (formData.bankName.length > 100) {
    errors.bankName = "Bank name cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.bankAccountName)) {
    errors.bankAccountName = "Account name is required"
  } else if (formData.bankAccountName.length > 100) {
    errors.bankAccountName = "Account name cannot exceed 100 characters"
  }

  if (!validateRequiredField(formData.bankAccountNo)) {
    errors.bankAccountNo = "Account number is required"
  } else if (!validateAccountNumber(formData.bankAccountNo)) {
    errors.bankAccountNo = "Please enter a valid account number (6-10 digits)"
  }

  if (!validateRequiredField(formData.confirmAccountNo)) {
    errors.confirmAccountNo = "Confirm account number is required"
  } else if (formData.bankAccountNo !== formData.confirmAccountNo) {
    errors.confirmAccountNo = "Account numbers do not match"
  }

  // Financial Year validation
  if (!validateRequiredField(formData.financialYear)) {
    errors.financialYear = "Financial year is required"
  }

  return errors
}

export const validateBusinessFormStep4 = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Document uploads validation
  if (!formData.ownerIdDocument) {
    errors.ownerIdDocument = "Owner ID document is required"
  }

  // Declaration validation
  if (!formData.signature) {
    errors.signature = "Signature is required"
  }

  if (formData.declarationAccepted !== "yes") {
    errors.declarationAccepted = "You must agree to the declaration"
  }

  return errors
}

// Specific form validation functions
export const validatePersonalDetails = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Required fields validation
  const requiredFields = [
    "firstName",
    "lastName",
    "dob",
    "email",
    "phone",
    "streetAddress",
    "suburb",
    "state",
    "postcode",
  ]
  requiredFields.forEach((field) => {
    if (!validateRequiredField(formData[field])) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`
    }
  })

  // Additional validations
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid Australian phone number"
  }

  if (formData.dob && !validateDOB(formData.dob)) {
    errors.dob = "Please enter a valid date of birth (not in future, not over 100 years ago)"
  }

  if (formData.postcode && !validatePostcode(formData.postcode)) {
    errors.postcode = "Please enter a valid Australian postcode (4 digits)"
  }

  return errors
}

export const validateBankDetails = (formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Required fields validation
  const requiredFields = ["bankName", "bankBsb", "bankAccountNo", "bankAccountName"]
  requiredFields.forEach((field) => {
    if (!validateRequiredField(formData[field])) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`
    }
  })

  // Additional validations
  if (formData.bankBsb && !validateBSB(formData.bankBsb)) {
    errors.bankBsb = "Please enter a valid BSB number (format: XXX-XXX)"
  }

  if (formData.bankAccountNo && !validateAccountNumber(formData.bankAccountNo)) {
    errors.bankAccountNo = "Please enter a valid account number (6-10 digits)"
  }

  return errors
}

// Validate field and return error message if invalid
export const validateField = (name: string, value: string): string => {
  let error = ""

  switch (name) {
    case "firstName":
    case "lastName":
      if (!validateRequiredField(value)) {
        error = `${name === "firstName" ? "First name" : "Last name"} is required`
      } else if (!validateName(value)) {
        error = "Please enter a valid name"
      }
      break

    case "email":
      if (!validateRequiredField(value)) {
        error = "Email is required"
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address"
      }
      break

    case "phone":
    case "mobile":
      if (!validateRequiredField(value)) {
        error = `${name === "phone" ? "Phone" : "Mobile"} number is required`
      } else if (!validatePhone(value)) {
        error = "Please enter a valid Australian phone number"
      }
      break

    case "dob":
    case "dateOfBirth":
      if (!validateRequiredField(value)) {
        error = "Date of birth is required"
      } else if (!validateDOB(value)) {
        error = "Please enter a valid date of birth"
      }
      break

    case "streetAddress":
    case "address":
      if (!validateRequiredField(value)) {
        error = "Address is required"
      }
      break

    case "suburb":
      if (!validateRequiredField(value)) {
        error = "Suburb is required"
      }
      break

    case "state":
      if (!validateRequiredField(value)) {
        error = "State is required"
      }
      break

    case "postcode":
      if (!validateRequiredField(value)) {
        error = "Postcode is required"
      } else if (!validatePostcode(value)) {
        error = "Please enter a valid Australian postcode (4 digits)"
      }
      break

    case "tfn":
      if (value && !validateTFN(value)) {
        error = "Please enter a valid TFN (8-9 digits)"
      }
      break

    case "abn":
      if (value && !validateABN(value)) {
        error = "Please enter a valid ABN (11 digits)"
      }
      break

    case "bankBsb":
      if (!validateRequiredField(value)) {
        error = 'BSB is required';
      } else if (!validateBSB(value)) {
        error = 'Please enter a valid BSB (format: XXX-XXX)';
      }
      break

    case "bankAccountNo":
      if (!validateRequiredField(value)) {
        error = "Account number is required"
      } else if (!validateAccountNumber(value)) {
        error = "Please enter a valid account number (6-10 digits)"
      }
      break

    case "bankAccountName":
      if (!validateRequiredField(value)) {
        error = "Account name is required"
      }
      break

    case "bankName":
      if (!validateRequiredField(value)) {
        error = "Bank name is required"
      }
      break
  }

  return error
}

export const validateEngagementLetter = (formData: any) => {
  const errors: Record<string, string> = {}

  if (!formData.engagementLetter?.clientName) {
    errors.clientName = "Client name is required"
  }

  if (!formData.engagementLetter?.signature) {
    errors.signature = "Signature is required"
  }

  // Add more validations as needed

  return errors
}

export function scrollToFirstError(errors: Record<string, string>): void {
  if (Object.keys(errors).length === 0) return

  const firstErrorField = Object.keys(errors)[0]

  // Try to find the element by id or name
  let element = document.querySelector(`#${firstErrorField}, [name="${firstErrorField}"]`) as HTMLElement | null

  // If not found, try to find a label for it
  if (!element) {
    const label = document.querySelector(`label[for="${firstErrorField}"]`)
    if (label) {
      element = label as HTMLElement
    }
  }

  // If still not found, try a container with data-field attribute
  if (!element) {
    element = document.querySelector(`[data-field="${firstErrorField}"]`) as HTMLElement | null
  }

  if (element) {
    // Add highlight animation
    element.classList.add("error-highlight")
    setTimeout(() => {
      element?.classList.remove("error-highlight")
    }, 2000)

    // Scroll into view with a small delay to ensure rendering is complete
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
      element?.focus()
    }, 100)

    // If this is an input within a group, focus it
    const input = element.querySelector("input, select, textarea") as HTMLElement | null
    if (input) {
      input.focus()
    } else {
      element.focus()
    }
  } else {
    // If we can't find the element, scroll to error summary
    const errorSummary = document.getElementById("error-summary")
    if (errorSummary) {
      errorSummary.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
}
