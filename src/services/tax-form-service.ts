import apiClient from './api';
import type { FormDataType, EngagementLetterData } from '../types/form-types';

/**
 * Complete the SMSF form submission with payment details
 * @param formData Form data including payment information
 * @returns Promise with API response
 */
export const completeFormSubmission = async (formData: any) => {
  try {
    // Add flag to indicate if engagement letter is included
    if (formData.formData instanceof FormData) {
      formData.formData.append(
        'hasEngagementLetter',
        formData.formData.get('engagementLetter') ? 'true' : 'false'
      );
    } else {
      formData.hasEngagementLetter = formData.engagementLetter ? true : false;
    }

    const response = await apiClient.post('/tax-solutions/complete-submission', formData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error completing form submission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete form submission',
    };
  }
};

/**
 * Get pricing options for a specific form type
 * @param formType The type of form (e.g., "smsf", "business")
 * @returns Promise with pricing data
 */
export const getFormPricingOptions = async (formType: string) => {
  try {
    const response = await apiClient.get(`/tax-solutions/pricing/${formType}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching pricing options:', error);
    return {
      success: false,
      error: 'Failed to fetch pricing options. Please try again.',
    };
  }
};

export const getSMSFPricingPlans = () => {
  return {
    essential: {
      name: 'Essential SMSF Service',
      price: 990,
      features: [
        'Annual SMSF tax return',
        'Annual financial statements',
        'Member statements',
        'Compliance monitoring',
        'ATO correspondence handling'
      ]
    },
    premium: {
      name: 'Premium SMSF Service',
      price: 1490,
      features: [
        'All Essential features',
        'Investment strategy review',
        'Quarterly performance reports',
        'Dedicated account manager',
        'SMSF audit coordination',
        'Estate planning guidance'
      ]
    }
  };
};

/**
 * Get additional services available for SMSF clients
 * @returns Array of additional services
 */
export const getSMSFAdditionalServices = () => {
  return [
    {
      id: 'pension-setup',
      name: 'Pension Setup and Documentation',
      price: 550
    },
    {
      id: 'lrba-setup',
      name: 'Limited Recourse Borrowing Arrangement Setup',
      price: 990
    },
    {
      id: 'corporate-trustee',
      name: 'Corporate Trustee Formation',
      price: 880
    },
    {
      id: 'property-valuation',
      name: 'Property Investment Valuation',
      price: 440
    }
  ];
};

export const submitIndividualTaxForm = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/tax-solutions/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    localStorage.removeItem('individualFormData');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error submitting individual tax form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
    };
  }
};

export const saveIndividualFormProgress = async (formData: FormDataType) => {
  try {
    // Ensure formData has the formType set
    const updatedFormData = {
      ...formData,
      formType: formData.formType || "individual",
      form_type: formData.formType || "individual"
    };
    
    // const response = await apiClient.post('/tax-solutions/save-progress', updatedFormData);
    // return {
      console.log('Saving individual form progress to localStorage')
      localStorage.setItem('individualFormData', JSON.stringify(updatedFormData));
      return {
        success: true,
        id: 'local-storage'
    }
  } catch (error) {
    console.error('Error saving form progress to localStorage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save progress. Please try again.'
    };
  }
};

export const getIndividualPricingPlans = () => {
  return {
    individual: {
      student: {
        name: 'Students under 21',
        price: 65,
        priceLabel: 'Per Return',
        features: [
          'Prepare & File Tax Return',
          'Annual Tax Assessment Review',
          'Basic Tax Planning Advice'
        ]
      },
      employee: {
        name: 'Full Time Employee',
        price: 110,
        priceLabel: 'Per Return',
        features: [
          'Prepare & File Tax Return',
          'Annual Tax Assessment Review',
          'Basic Tax Planning Advice'
        ]
      }
    },
    soleTrader: {
      basOnly: {
        name: 'Lodge BAS Only',
        price: 250,
        priceLabel: 'Per Quarter',
        features: ['Prepare & File Quarterly BAS/IAS']
      },
      taxReturn: {
        name: 'Tax Return',
        price: 550,
        priceLabel: 'Per Return',
        features: [
          'Prepare & File Annual Tax Return',
          'Investment Property Processing ($55 per property)',
          'Capital Gains Processing'
        ]
      },
      complete: {
        name: 'Complete Service',
        price: 300,
        priceLabel: 'Per Month',
        features: [
          'Bookkeeping',
          'Prepare & File Quarterly BAS/IAS',
          'Prepare & File Annual Tax Return',
          'Tax Administration (Tax Assessments and reminders)',
          'ASIC Management'
        ]
      }
    }
  };
};

/**
 * Get additional services available for Sole Trader clients
 * @returns Array of additional services
 */
export const getSoleTraderAdditionalServices = () => {
  return [
    {
      id: 'investment-property',
      name: 'Investment Property',
      description: '$55 per investment property',
      price: 55
    },
    {
      id: 'capital-gains-without-dpr',
      name: 'Capital Gains (without DPR)',
      description: '$33 per trade',
      price: 33
    },
    {
      id: 'capital-gains-with-dpr',
      name: 'Capital Gains (with DPR)',
      description: '$44 per trade',
      price: 44
    }
  ];
};

export const saveEngagementLetter = async (engagementData: EngagementLetterData) => {
  try {
    localStorage.setItem('engagementLetterData', JSON.stringify(engagementData));
    const response = await apiClient.post('/tax-solutions/save-engagement', engagementData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error saving engagement letter:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save engagement letter');
  }
};

/**
 * Check if the engagement letter has been completed for a specific form
 * @param formType The type of form
 * @param entityId The entity ID
 * @returns Promise with status of engagement letter completion
 */
export const checkEngagementLetterStatus = async (formType: string, entityId?: string) => {
  try {
    const engagementData = localStorage.getItem('engagementLetter');
    if (engagementData) {
      const parsedData = JSON.parse(engagementData);
      if (parsedData.accepted) {
        return {
          success: true,
          isCompleted: true,
          engagementData: parsedData,
        };
      }
    }
    
    const response = await apiClient.get(`/tax-solutions/engagement-status?formType=${formType}&entityId=${entityId || ''}`);
    return {
      success: true,
      isCompleted: response.data.isCompleted,
      engagementData: response.data.engagementData,
    };
  } catch (error) {
    console.error('Error checking engagement letter status:', error);
    return {
      success: false,
      isCompleted: false,
      error: error instanceof Error ? error.message : 'Failed to check engagement letter status',
    };
  }
};

export const clearAllStoredFormData = () => {
  localStorage.removeItem('businessFormData');
  localStorage.removeItem('individualFormData');
  localStorage.removeItem('engagementLetter');
  localStorage.removeItem('smsfFormData');
};