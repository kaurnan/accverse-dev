export interface ITRLetterData {
  accepted: boolean;
  dateSigned: string | null;
  [key: string]: any;
}

export interface EngagementLetterData {
  accepted: boolean;
  dateSigned: string | null;
  [key: string]: any;
}

export interface FormDataType {
  [key: string]: any;
  taxpayerType?: "individual" | "soleTrader"; // taxpayerType is now optional for general use, not required for SMSF
  formType?: string;
  engagementLetter?: EngagementLetterData | null;
  businessName?: string;
  entityName?: string;
  entityType?: string;
  firstName?: string;
  lastName?: string;
  itrEngagementCompleted?: boolean;
  itrEngagementLetter?: ITRLetterData | null;
}

export interface IndividualFormData extends FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface SMSFFormData extends Omit<FormDataType, "taxpayerType"> {
  smsfName: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  postcode: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactMobile: string;
  contactEmail: string;
  trusteeType: string;
  financialYear: string;
  updateAtoDetails: string;
  electronicServiceAddress: string;
  bankBsb: string;
  bankAccountNo: string;
  confirmAccountNo: string;
  bankAccountName: string;
  bankName: string;
  memberCount: string;
  prevAccountantName: string;
  prevAccountantContact: string;
  prevAccountantPhone: string;
  prevAccountantMobile: string;
  prevAccountantEmail: string;
  firstName: string;
  lastName: string;
  lastFinancialStatements: File | null;
  lastTaxReturn: File | null;
  trustDeeds: File | null;
  originalFundRecords: File | null;
  memberApplication: File | null;
  trusteeConsent: File | null;
  fundInvestmentStrategy: File | null;
  rolloverStatements: File | null;
  expenseInvoices: File | null;
  capitalGains: string;
  propertyCapitalGains: string;
  rentalIncome: string;
  trustDistribution: string;
  partnershipDistribution: string;
  dividendIncome: string;
  investmentExpenses: string;
  managementExpenses: string;
  signature: string | File | null;
  declarationAccepted: string;
  engagementLetter: EngagementLetterData;
}

export type BusinessFormData = {
  formType: string
  businessName: string
  entityName: string
  abn: string
  streetAddress: string
  streetAddress2: string
  city: string
  state: string
  postcode: string
  contactName: string
  contactPosition: string
  contactPhone: string
  contactMobile: string
  contactEmail: string
  entityType: string
  financialYear: string
  updateAtoDetails: string
  electronicServiceAddress: string
  bankBsb: string
  bankAccountNo: string
  confirmAccountNo: string
  bankAccountName: string
  bankName: string
  prevAccountantName: string
  prevAccountantContact: string
  prevAccountantPhone: string
  prevAccountantMobile: string
  prevAccountantEmail: string
  lastFinancialStatements: File | null
  lastTaxReturn: File | null
  companyExtract: File | null
  fixedAssetRegister: File | null
  loanAgreements: File | null
  leaseAgreements: File | null
  franchiseAgreements: File | null
  otherDocuments: File | null
  salesSummary: string
  purchaseSummary: string
  bankStatements: string
  payrollReports: string
  superannuationSummary: string
  motorVehicleExpenses: string
  advertisingExpenses: string
  rentExpenses: string
  insuranceExpenses: string
  otherExpenses: string
  signature: string | null
  declarationAccepted: string
  engagementLetter: EngagementLetterData
  taxLodgement: string
  acn: string
  tfn: string
  gstRegistered: string
  asicAgent: string
  prevAccountantAddress: string
  prevAccountantCity: string
  prevAccountantState: string
  accountingSoftware: string
  motorVehicles: string
  fbtRegistered: string
  employeeCount: string
  relatedEntityName: string
  relatedEntitySoftware: string
  relatedEntityTFN: string
  relatedEntityABN: string
  div7aLoans: string
  trustType: string
  entityDocument: File | null
  ownerIdDocument: File | null
  signature2: File | null
  directorId: File | null
  directorIdType: string
  directorIdNumber: string
  directorIdIssueState: string
  
}
export type CommonFormData = {
  businessName?: string;
  entityName?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  entityType?: string;
  formType?: string;
  engagementLetter?: EngagementLetterData | null;
  [key: string]: any; // Allow for additional properties
};

// Define form type constants to avoid typos and ensure consistency
export const FORM_TYPES = {
  TAX_BUSINESS: 'tax_business',
  ACCOUNTING: 'accounting_services',
  INDIVIDUAL: 'individual',
  SMSF: 'smsf',
  COMPANY_REGISTRATION: 'company-registration',
  SMSF_ESTABLISHMENT: 'smsf-establishment'
};

// Helper to determine correct form type
export function getFormType(formData: CommonFormData): string {
  if (formData.formType) {
    return formData.formType;
  }
  
  // Determine by presence of fields
  if (formData.smsfName) {
    return FORM_TYPES.SMSF;
  }
  
  if (formData.businessName || formData.entityName) {
    return FORM_TYPES.TAX_BUSINESS;
  }
  
  if (formData.firstName && formData.lastName) {
    return FORM_TYPES.INDIVIDUAL;
  }
  
  // Default
  return FORM_TYPES.TAX_BUSINESS;
}

// Helper to get form data with correct type
export function ensureCorrectFormType<T extends CommonFormData>(formData: T, formType?: string): T {
  const data = { ...formData };
  
  // Use provided formType or determine from data
  data.formType = formType || data.formType || getFormType(data);
  
  // Also set form_type for backend consistency (used in database)
  (data as any).form_type = data.formType;
  
  return data;
}

export type FormData = BusinessFormData | IndividualFormData | SMSFFormData | Record<string, any>; 