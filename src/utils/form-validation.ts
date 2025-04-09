
// Form validation utilities

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhone = (phone: string): boolean => {
    // Australian phone number validation (mobile)
    const phoneRegex = /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/;
    return phoneRegex.test(phone);
  };
  
  export const validateBSB = (bsb: string): boolean => {
    // BSB validation - 6 digits, optionally separated by a hyphen
    const bsbRegex = /^\d{3}-?\d{3}$/;
    return bsbRegex.test(bsb);
  };
  
  export const validateAccountNumber = (accountNo: string): boolean => {
    // Basic account number validation - between 6 and 10 digits
    const accountRegex = /^\d{6,10}$/;
    return accountRegex.test(accountNo);
  };
  
  export const validatePostcode = (postcode: string): boolean => {
    // Australian postcode validation
    const postcodeRegex = /^\d{4}$/;
    return postcodeRegex.test(postcode);
  };
  
  export const validateTFN = (tfn: string): boolean => {
    // TFN validation - 8 or 9 digits
    const tfnRegex = /^\d{8,9}$/;
    return tfnRegex.test(tfn);
  };
  
  export const validateABN = (abn: string): boolean => {
    // ABN validation - 11 digits
    const abnRegex = /^\d{11}$/;
    return abnRegex.test(abn);
  };
  
  export const validateACN = (acn: string): boolean => {
    // ACN validation - 9 digits
    const acnRegex = /^\d{9}$/;
    return acnRegex.test(acn);
  };
  
  export const validateRequiredField = (value: string | undefined | null): boolean => {
    if (value === undefined || value === null) return false;
    return value.trim() !== '';
  };
  
  export const isFutureDate = (date: string): boolean => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };
  
  export const isDateOverOneHundredYearsAgo = (date: string): boolean => {
    const selectedDate = new Date(date);
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
    return selectedDate < hundredYearsAgo;
  };
  
  export const validateDate = (date: string): boolean => {
    if (!date) return false;
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  };
  
  export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  export const validateName = (name: string): boolean => {
    // Names should be at least 2 characters and contain only letters, spaces, hyphens and apostrophes
    const nameRegex = /^[A-Za-z\s'-]{2,}$/;
    return nameRegex.test(name);
  };
  
  export const validateDOB = (dob: string): boolean => {
    // Check if date is valid
    if (!validateDate(dob)) return false;
    
    // Check if date is in the future
    if (isFutureDate(dob)) return false;
    
    // Check if date is more than 100 years ago
    if (isDateOverOneHundredYearsAgo(dob)) return false;
    
    return true;
  };
  
  // Generate form validation errors
  export const validateForm = (formData: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (formData.firstName && !validateName(formData.firstName)) {
      errors.firstName = "Please enter a valid first name";
    }
    
    if (formData.lastName && !validateName(formData.lastName)) {
      errors.lastName = "Please enter a valid last name";
    }
    
    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid Australian phone number";
    }
    
    if (formData.mobile && !validatePhone(formData.mobile)) {
      errors.mobile = "Please enter a valid Australian mobile number";
    }
    
    // Date validation
    if (formData.dob && !validateDOB(formData.dob)) {
      errors.dob = "Please enter a valid date of birth";
    }
    
    if (formData.dateOfBirth && !validateDOB(formData.dateOfBirth)) {
      errors.dateOfBirth = "Please enter a valid date of birth";
    }
    
    // Postcode validation
    if (formData.postcode && !validatePostcode(formData.postcode)) {
      errors.postcode = "Please enter a valid Australian postcode (4 digits)";
    }
    
    // TFN validation
    if (formData.tfn && !validateTFN(formData.tfn)) {
      errors.tfn = "Please enter a valid TFN (8-9 digits)";
    }
    
    // ABN validation
    if (formData.abn && !validateABN(formData.abn)) {
      errors.abn = "Please enter a valid ABN (11 digits)";
    }
    
    // ACN validation
    if (formData.acn && !validateACN(formData.acn)) {
      errors.acn = "Please enter a valid ACN (9 digits)";
    }
    
    // Banking details validation
    if (formData.bankBsb && !validateBSB(formData.bankBsb)) {
      errors.bankBsb = "Please enter a valid BSB number (format: XXX-XXX)";
    }
    
    if (formData.bankAccountNo && !validateAccountNumber(formData.bankAccountNo)) {
      errors.bankAccountNo = "Please enter a valid account number (6-10 digits)";
    }
    
    return errors;
  };
  
  // Specific form validation functions
  export const validatePersonalDetails = (formData: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'dob', 'email', 'phone', 'streetAddress', 'suburb', 'state', 'postcode'];
    requiredFields.forEach(field => {
      if (!validateRequiredField(formData[field])) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Additional validations
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid Australian phone number";
    }
    
    if (formData.dob && !validateDOB(formData.dob)) {
      errors.dob = "Please enter a valid date of birth (not in future, not over 100 years ago)";
    }
    
    if (formData.postcode && !validatePostcode(formData.postcode)) {
      errors.postcode = "Please enter a valid Australian postcode (4 digits)";
    }
    
    return errors;
  };
  
  export const validateBankDetails = (formData: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = ['bankName', 'bankBsb', 'bankAccountNo', 'bankAccountName'];
    requiredFields.forEach(field => {
      if (!validateRequiredField(formData[field])) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Additional validations
    if (formData.bankBsb && !validateBSB(formData.bankBsb)) {
      errors.bankBsb = "Please enter a valid BSB number (format: XXX-XXX)";
    }
    
    if (formData.bankAccountNo && !validateAccountNumber(formData.bankAccountNo)) {
      errors.bankAccountNo = "Please enter a valid account number (6-10 digits)";
    }
    
    return errors;
  };
  
  // Validate field and return error message if invalid
  export const validateField = (name: string, value: string): string => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!validateRequiredField(value)) {
          error = `${name === 'firstName' ? 'First name' : 'Last name'} is required`;
        } else if (!validateName(value)) {
          error = 'Please enter a valid name';
        }
        break;
        
      case 'email':
        if (!validateRequiredField(value)) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'phone':
      case 'mobile':
        if (!validateRequiredField(value)) {
          error = `${name === 'phone' ? 'Phone' : 'Mobile'} number is required`;
        } else if (!validatePhone(value)) {
          error = 'Please enter a valid Australian phone number';
        }
        break;
        
      case 'dob':
      case 'dateOfBirth':
        if (!validateRequiredField(value)) {
          error = 'Date of birth is required';
        } else if (!validateDOB(value)) {
          error = 'Please enter a valid date of birth';
        }
        break;
        
      case 'streetAddress':
      case 'address':
        if (!validateRequiredField(value)) {
          error = 'Address is required';
        }
        break;
        
      case 'suburb':
        if (!validateRequiredField(value)) {
          error = 'Suburb is required';
        }
        break;
        
      case 'state':
        if (!validateRequiredField(value)) {
          error = 'State is required';
        }
        break;
        
      case 'postcode':
        if (!validateRequiredField(value)) {
          error = 'Postcode is required';
        } else if (!validatePostcode(value)) {
          error = 'Please enter a valid Australian postcode (4 digits)';
        }
        break;
        
      case 'tfn':
        if (value && !validateTFN(value)) {
          error = 'Please enter a valid TFN (8-9 digits)';
        }
        break;
        
      case 'abn':
        if (value && !validateABN(value)) {
          error = 'Please enter a valid ABN (11 digits)';
        }
        break;
        
      case 'bankBsb':
        if (!validateRequiredField(value)) {
          error = 'BSB is required';
        } else if (!validateBSB(value)) {
          error = 'Please enter a valid BSB (format: XXX-XXX)';
        }
        break;
        
      case 'bankAccountNo':
        if (!validateRequiredField(value)) {
          error = 'Account number is required';
        } else if (!validateAccountNumber(value)) {
          error = 'Please enter a valid account number (6-10 digits)';
        }
        break;
        
      case 'bankAccountName':
        if (!validateRequiredField(value)) {
          error = 'Account name is required';
        }
        break;
        
      case 'bankName':
        if (!validateRequiredField(value)) {
          error = 'Bank name is required';
        }
        break;
    }
    
    return error;
  };
  