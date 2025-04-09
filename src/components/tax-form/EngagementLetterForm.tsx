
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { taxSolutionsService } from '../../services/api';
import { validateForm } from '../../utils/form-validation';
import { SignatureField } from '../ui/signature-field';

const EngagementLetterForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    entityType: 'individual',
    streetAddress: '',
    streetAddressLine2: '',
    suburb: '',
    state: '',
    postcode: '',
    signature: ''
  });
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Validate form on data change
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureChange = (value: string) => {
    setFormData(prev => ({ ...prev, signature: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    // Don't save if there are errors
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Form has errors",
        description: "Please correct the errors before saving.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        formType: 'engagement',
        formData: JSON.stringify(formData),
        status: 'progress'
      };
      
      const response = await taxSolutionsService.saveProgress(payload);
      setFormId(response.formId);
      
      toast({
        title: "Progress Saved",
        description: "You can continue later using the form ID: " + response.formId,
      });
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your progress",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    // Check for required fields
    if (!formData.streetAddress || !formData.suburb || !formData.state || !formData.postcode || !formData.signature) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Don't submit if there are errors
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Form has errors",
        description: "Please correct the errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('formType', 'engagement');
      formDataObj.append('formData', JSON.stringify(formData));
      
      await taxSolutionsService.submitTaxForm(formDataObj);
      
      toast({
        title: "Form Submitted",
        description: "Your engagement letter has been submitted successfully",
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        entityType: 'individual',
        streetAddress: '',
        streetAddressLine2: '',
        suburb: '',
        state: '',
        postcode: '',
        signature: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your form",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">ENGAGEMENT LETTER</h2>
          <p className="text-gray-700 mb-4">FOR SOLE TRADER | COMPANY | TRUST | PARTNERSHIP | SMSF</p>
          <p className="mb-4 text-gray-600">Please thoroughly read, fill out and then sign the last page of this letter. This letter is to be submitted in conjunction with our Sole Trader / Business clients Intake Tax Checklist Forms.</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="date" className="block text-gray-700 font-medium mb-1">Today's Date<span className="text-red-500">*</span></Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
              readOnly
              tooltip="Today's date is automatically filled and cannot be changed"
              error={errors.date}
            />
          </div>

          <div>
            <Label htmlFor="entityType" className="block text-gray-700 font-medium mb-1">Entity Structure<span className="text-red-500">*</span></Label>
            <Select name="entityType" id="entityType" value={formData.entityType} onChange={handleChange}>
              <option value="individual">Individual / Sole Trader</option>
              <option value="company">Company</option>
              <option value="partnership">Partnership</option>
              <option value="trust">Trust</option>
              <option value="smsf">SMSF</option>
            </Select>
            {errors.entityType && <p className="mt-1 text-xs text-red-500">{errors.entityType}</p>}
          </div>

          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">Address<span className="text-red-500">*</span></h3>
            <div className="space-y-2">
              <Input
                id="streetAddress"
                name="streetAddress"
                placeholder="Street Address"
                required
                value={formData.streetAddress}
                onChange={handleChange}
                error={errors.streetAddress}
              />
              
              <Input
                id="streetAddressLine2"
                name="streetAddressLine2"
                placeholder="Street Address Line 2"
                value={formData.streetAddressLine2}
                onChange={handleChange}
                error={errors.streetAddressLine2}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="suburb"
                  name="suburb"
                  placeholder="Suburb"
                  required
                  value={formData.suburb}
                  onChange={handleChange}
                  error={errors.suburb}
                />
                
                <Select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NSW">New South Wales</option>
                  <option value="NT">Northern Territory</option>
                  <option value="QLD">Queensland</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="VIC">Victoria</option>
                  <option value="WA">Western Australia</option>
                </Select>
              </div>
              
              <Input
                id="postcode"
                name="postcode"
                placeholder="Postcode"
                required
                value={formData.postcode}
                onChange={handleChange}
                maxLength={4}
                error={errors.postcode}
              />
            </div>
            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-purple-500">
          <h3 className="font-bold mb-2 text-gray-800">ENGAGEMENT LETTER – Income Tax Return, Financial Statements Preparation</h3>
          <p className="text-gray-600">As our newest client, we would like to officially welcome you to Accverse. The following outlines the services that we provide in our role and more importantly our understanding of your requirements from us.</p>
          <div className="mt-4">
            <p className="font-semibold text-gray-700">Declaration:</p>
            <p className="text-gray-600">You hereby appoint Accverse to act as your accountant &/or tax agent. We will add you to our <span className="group relative inline-block">
              tax agent portal
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-60 text-center">
                The tax agent portal is a secure platform used by registered tax agents to interact with the ATO on behalf of their clients
              </span>
            </span> and liaise with the ATO on your behalf as required.</p>
            <p className="text-gray-600">You declare that all the information you have provided to us is correct and complete to the best of your knowledge.</p>
          </div>
        </div>

        <div>
          <Label htmlFor="signature" className="block text-gray-700 font-medium mb-1">
            Owner / Director / Partner / Trustee / Manager 1 Signature<span className="text-red-500">*</span>
          </Label>
          <SignatureField
            id="signature"
            label=""
            value={formData.signature}
            onChange={handleSignatureChange}
            required
            error={errors.signature}
          />
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </Button>
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EngagementLetterForm;
