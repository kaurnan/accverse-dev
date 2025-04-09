
// import React, { useState, useEffect } from 'react';
// import { Label } from '../ui/label';
// import { Input } from '../ui/input';
// import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
// import { FileUpload } from '../ui/file-upload';
// import { Info } from 'lucide-react';
// import { SecuredBankingSection } from '../ui/secured-banking-section';
// import * as validation from '../../utils/form-validation';
// import { Select, SelectContent, SelectItem } from '../ui/select';

// interface FormStep1Props {
//   formData: any;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//   handleRadioChange: (name: string, value: string) => void;
//   handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
// }

// const FormStep1: React.FC<FormStep1Props> = ({ 
//   formData, 
//   handleChange, 
//   handleRadioChange,
//   handleFileChange 
// }) => {
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});

//   const markAsTouched = (fieldName: string) => {
//     setTouched(prev => ({
//       ...prev,
//       [fieldName]: true
//     }));
//   };

//   const validateField = (name: string, value: string) => {
//     return validation.validateField(name, value);
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     markAsTouched(name);
    
//     const error = validateField(name, value);
//     setErrors(prev => ({
//       ...prev,
//       [name]: error
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (touched[name]) {
//       const error = validateField(name, value);
//       setErrors(prev => ({
//         ...prev,
//         [name]: error
//       }));
//     }
    
//     handleChange(e);
//   };

//   // Validate all fields on component mount for initial validation
//   useEffect(() => {
//     const newErrors: Record<string, string> = {};
//     const fieldsToValidate = [
//       'firstName', 'lastName', 'email', 'mobile', 'dateOfBirth', 
//       'address', 'suburb', 'state', 'postcode', 'bankBsb', 
//       'bankAccountNo', 'bankAccountName', 'bankName', 'fiscalYear'
//     ];
    
//     fieldsToValidate.forEach(field => {
//       if (formData[field]) {
//         const error = validateField(field, formData[field]);
//         if (error) {
//           newErrors[field] = error;
//         }
//       }
//     });
    
//     setErrors(newErrors);
//   }, [formData]);

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
//         <h2 className="text-xl font-semibold">Part 1: Personal Details</h2>
//         <p className="text-sm text-purple-100 mt-1">Fields marked with a red asterisk (*) are required. Existing clients only need to update information that has changed.</p>
//       </div>
      
//       <div className="space-y-6">
//         <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
//           <Label className="text-gray-800 font-semibold mb-3 block">Taxpayer Type <span className="text-red-500">*</span></Label>
//           <RadioGroup 
//             value={formData.taxpayerType || ''} 
//             onValueChange={(value: string) => handleRadioChange('taxpayerType', value)}
//             className="flex flex-col space-y-3 mt-2"
//             error={touched.taxpayerType ? errors.taxpayerType : ""}
//             required
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="individual" id="individual" />
//               <Label htmlFor="individual" className="text-gray-700 cursor-pointer">Individual</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem 
//                 value="soleTrader" 
//                 id="soleTrader"
//                 tooltip="Select this if you have an ABN and operate as a sole trader business" 
//               />
//               <Label htmlFor="soleTrader" className="text-gray-700 cursor-pointer">Sole Trader with ABN</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <Label htmlFor="prefix" className="text-gray-700 block mb-1">Prefix</Label>
//             <Select
//               value={formData.prefix || ''}
//               onValueChange={(value) => handleRadioChange('prefix', value)}
//               required
//               error={touched.prefix ? errors.prefix : ""}
//               // tooltip="Select your prefix"
//             >
//               <SelectContent>
//                 <SelectItem value="Mr">Mr</SelectItem>
//                 <SelectItem value="Mrs">Mrs</SelectItem>
//                 <SelectItem value="Ms">Ms</SelectItem>
//                 <SelectItem value="Miss">Miss</SelectItem>
//                 <SelectItem value="Dr">Dr</SelectItem>
//                 <SelectItem value="Prof">Prof</SelectItem>
//                 <SelectItem value="Hon">Hon</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="md:col-span-2">
//             <Label htmlFor="firstName" className="text-gray-700 block mb-1">
//               First & Middle Name <span className="text-red-500">*</span>
//             </Label>
//             <Input 
//               id="firstName" 
//               name="firstName" 
//               value={formData.firstName || ''}
//               onChange={handleInputChange}
//               onBlur={handleBlur}
//               placeholder="First and middle names"
//               error={touched.firstName ? errors.firstName : ""}
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="lastName" className="text-gray-700 block mb-1">
//             Last Name <span className="text-red-500">*</span>
//           </Label>
//           <Input 
//             id="lastName" 
//             name="lastName" 
//             value={formData.lastName || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder="Last name"
//             error={touched.lastName ? errors.lastName : ""}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="dateOfBirth" className="text-gray-700 block mb-1">
//             Date of Birth <span className="text-red-500">*</span>
//           </Label>
//           <Input 
//             id="dateOfBirth" 
//             name="dateOfBirth" 
//             type="date" 
//             value={formData.dateOfBirth || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             error={touched.dateOfBirth ? errors.dateOfBirth : ""}
//             max={new Date().toISOString().split('T')[0]} // Prevent future dates
//             required
//             tooltip="Date of birth must be in the past and not more than 100 years ago"
//           />
//         </div>

//         <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
//           <Label className="text-gray-800 font-semibold mb-3 block">Marital Status <span className="text-red-500">*</span></Label>
//           <RadioGroup 
//             value={formData.maritalStatus || ''} 
//             onValueChange={(value: string) => handleRadioChange('maritalStatus', value)}
//             className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2"
//             error={touched.maritalStatus ? errors.maritalStatus : ""}
//             required
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="single" id="single" />
//               <Label htmlFor="single" className="text-gray-700 cursor-pointer">Single</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="defacto" id="defacto" />
//               <Label htmlFor="defacto" className="text-gray-700 cursor-pointer">Defacto</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="married" id="married" />
//               <Label htmlFor="married" className="text-gray-700 cursor-pointer">Married</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="divorced" id="divorced" />
//               <Label htmlFor="divorced" className="text-gray-700 cursor-pointer">Divorced</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="widower" id="widower" />
//               <Label htmlFor="widower" className="text-gray-700 cursor-pointer">Widow(er)</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         <div>
//           <Label htmlFor="mobile" className="flex items-center text-gray-700 mb-1">
//             Mobile Phone <span className="text-red-500">*</span>
//           </Label>
//           <Input 
//             id="mobile" 
//             name="mobile" 
//             value={formData.mobile || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder="Mobile number"
//             error={touched.mobile ? errors.mobile : ""}
//             required
//             tooltip="Australian format: 04XX XXX XXX or +614XX XXX XXX"
//           />
//         </div>

//         <div>
//           <Label htmlFor="email" className="flex items-center text-gray-700 mb-1">
//             Email Address <span className="text-red-500">*</span>
//           </Label>
//           <Input 
//             id="email" 
//             name="email" 
//             type="email"
//             value={formData.email || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder="Email address"
//             error={touched.email ? errors.email : ""}
//             required
//           />
//         </div>

//         <div className="border-t border-gray-200 pt-6">
//           <h3 className="text-lg font-semibold mb-4 text-purple-700">Residential Address</h3>
          
//           <div>
//             <Label htmlFor="address" className="flex items-center text-gray-700 mb-1">
//               Address Line 1 <span className="text-red-500">*</span>
//             </Label>
//             <Input 
//               id="address" 
//               name="address" 
//               value={formData.address || ''}
//               onChange={handleInputChange}
//               onBlur={handleBlur}
//               placeholder="Street address"
//               error={touched.address ? errors.address : ""}
//               required
//             />
//           </div>

//           <div className="mt-4">
//             <Label htmlFor="address2" className="text-gray-700 mb-1">
//               Address Line 2
//             </Label>
//             <Input 
//               id="address2" 
//               name="address2" 
//               value={formData.address2 || ''}
//               onChange={handleInputChange}
//               placeholder="Apartment, suite, unit, etc."
//             />
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
//             <div>
//               <Label htmlFor="suburb" className="flex items-center text-gray-700 mb-1">
//                 Suburb <span className="text-red-500">*</span>
//               </Label>
//               <Input 
//                 id="suburb" 
//                 name="suburb" 
//                 value={formData.suburb || ''}
//                 onChange={handleInputChange}
//                 onBlur={handleBlur}
//                 placeholder="Suburb"
//                 error={touched.suburb ? errors.suburb : ""}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="state" className="flex items-center text-gray-700 mb-1">
//                 State <span className="text-red-500">*</span>
//               </Label>
//               <Select
//     value={formData.state || ''}
//     onValueChange={(value) => handleRadioChange('state', value)}
//     required
//     error={touched.prefix ? errors.state : ""}
//     // tooltip="Select your state"
//               >
//                 <SelectContent>
//                   {/* <SelectItem value="">Select State</SelectItem> */}
//                   <SelectItem value="ACT">Australian Capital Territory</SelectItem>
//                   <SelectItem value="NSW">New South Wales</SelectItem>
//                   <SelectItem value="NT">Northern Territory</SelectItem>
//                   <SelectItem value="QLD">Queensland</SelectItem>
//                   <SelectItem value="SA">South Australia</SelectItem>
//                   <SelectItem value="TAS">Tasmania</SelectItem>
//                   <SelectItem value="VIC">Victoria</SelectItem>
//                   <SelectItem value="WA">Western Australia</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="postcode" className="flex items-center text-gray-700 mb-1">
//                 Postcode <span className="text-red-500">*</span>
//               </Label>
//               <Input 
//                 id="postcode" 
//                 name="postcode" 
//                 value={formData.postcode || ''}
//                 onChange={handleInputChange}
//                 onBlur={handleBlur}
//                 placeholder="Postcode"
//                 error={touched.postcode ? errors.postcode : ""}
//                 maxLength={4}
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="tfn" className="flex items-center text-gray-700 mb-1">
//             TFN
//             <div className="group relative ml-2">
//               <button
//                 type="button"
//                 className="text-blue-500"
//                 aria-label="TFN information"
//               >
//                 <Info size={16} />
//               </button>
//               <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
//                 Tax File Number (TFN) is an identification number issued by the Australian Taxation Office (ATO).
//               </div>
//             </div>
//           </Label>
//           <Input 
//             id="tfn" 
//             name="tfn" 
//             value={formData.tfn || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder="Tax File Number"
//             error={touched.tfn ? errors.tfn : ""}
//             isPassword={true}
//           />
//         </div>

//         <div>
//           <Label htmlFor="abn" className="flex items-center text-gray-700 mb-1">
//             ABN if Sole Trader
//             {formData.taxpayerType === 'soleTrader' && <span className="text-red-500 ml-1">*</span>}
//             <div className="group relative ml-2">
//               <button
//                 type="button"
//                 className="text-blue-500"
//                 aria-label="ABN information"
//               >
//                 <Info size={16} />
//               </button>
//               <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
//                 Australian Business Number (ABN) is a unique 11-digit identifier issued by the Australian Business Register.
//               </div>
//             </div>
//           </Label>
//           <Input 
//             id="abn" 
//             name="abn" 
//             value={formData.abn || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder="ABN"
//             error={touched.abn ? errors.abn : ""}
//             required={formData.taxpayerType === 'soleTrader'}
//           />
//         </div>

//         <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
//           <Label className="text-gray-800 font-semibold mb-1 block">
//             Would you like to have GST services included?
//             <div className="group relative ml-2 inline-block">
//               <button
//                 type="button"
//                 className="text-blue-500"
//                 aria-label="GST information"
//               >
//                 <Info size={16} />
//               </button>
//               <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
//                 GST (Goods and Services Tax) is a 10% tax applied to most goods and services sold in Australia.
//               </div>
//             </div>
//           </Label>
//           <p className="text-sm text-gray-500 mb-3">Select Yes if you require our GST/BAS Lodgement services.</p>
//           <RadioGroup 
//             value={formData.gstRequired || ''} 
//             onValueChange={(value: string) => handleRadioChange('gstRequired', value)}
//             className="flex flex-row space-x-4 mt-2"
//             error={touched.gstRequired ? errors.gstRequired : ""}
//             required
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="yes" id="gstYes" />
//               <Label htmlFor="gstYes" className="text-gray-700 cursor-pointer">Yes</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="no" id="gstNo" />
//               <Label htmlFor="gstNo" className="text-gray-700 cursor-pointer">No</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         <div>
//           <Label htmlFor="fiscalYear" className="flex items-center text-gray-700 mb-1">
//             Fiscal Year Ended <span className="text-red-500">*</span>
//             <div className="group relative ml-2">
//               <button
//                 type="button"
//                 className="text-blue-500"
//                 aria-label="Fiscal Year information"
//               >
//                 <Info size={16} />
//               </button>
//               <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
//                 The fiscal year in Australia typically ends on June 30th.
//               </div>
//             </div>
//           </Label>
//           <Input 
//             id="fiscalYear" 
//             name="fiscalYear" 
//             type="date"
//             value={formData.fiscalYear || ''}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder="Do not insert multiple years"
//             error={touched.fiscalYear ? errors.fiscalYear : ""}
//             max={new Date().toISOString().split('T')[0]} // Prevent future dates
//             required
//           />
//         </div>

//         {/* Banking Details Section */}
//         <SecuredBankingSection 
//           formData={formData} 
//           handleChange={handleInputChange}
//           errors={errors}
//         />

//         <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
//           <Label className="text-gray-800 font-semibold mb-1 block">
//             Would you authorise us to update your contact details with the ATO?
//             <div className="group relative ml-2 inline-block">
//               <button
//                 type="button"
//                 className="text-blue-500"
//                 aria-label="ATO information"
//               >
//                 <Info size={16} />
//               </button>
//               <div className="absolute z-50 left-6 -top-2 w-64 scale-0 rounded bg-slate-800 p-2 text-xs text-white shadow-lg transition-all group-hover:scale-100">
//                 The ATO (Australian Taxation Office) is the government agency responsible for administering the tax system in Australia.
//               </div>
//             </div>
//           </Label>
//           <RadioGroup 
//             value={formData.updateAtoDetails || ''} 
//             onValueChange={(value: string) => handleRadioChange('updateAtoDetails', value)}
//             className="flex flex-row space-x-4 mt-2"
//             error={touched.updateAtoDetails ? errors.updateAtoDetails : ""}
//             required
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="yes" id="updateAtoYes" />
//               <Label htmlFor="updateAtoYes" className="text-gray-700 cursor-pointer">Yes</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="no" id="updateAtoNo" />
//               <Label htmlFor="updateAtoNo" className="text-gray-700 cursor-pointer">No</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         <div className="mt-6">
//           <Label htmlFor="identification" className="text-gray-800 font-semibold mb-3 block">
//             Upload a Photo Identification
//             {formData.isNewClient && <span className="text-red-500 ml-1">*</span>}
//           </Label>
//           <FileUpload 
//             id="identification"
//             name="identification"
//             accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//             value={formData.identification}
//             onChange={(file) => {
//               const e = { target: { files: file ? [file] : [] } } as unknown as React.ChangeEvent<HTMLInputElement>;
//               handleFileChange(e, 'identification')
//             }}
//             description="Applicable for New Clients: Passport, Driver or Learner's License for verification purposes."
//             required={formData.isNewClient}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormStep1;

