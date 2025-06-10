import React, { useState, useEffect } from 'react';
import { X, Building2, Tag, DollarSign, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const CompanyOnboardingModal = ({ 
  isOpen, 
  onClose, 
  company, 
  categories, 
  onCompanyOnboarded,
  isAlreadyOnboarded 
}) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    inboundRate: '',
    outboundRate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company && isOpen) {
      // Find the category ID based on the company's category name
      const categoryMatch = categories.find(cat => cat.name === company.category);
      
      setFormData({
        categoryId: categoryMatch?.id || '',
        inboundRate: company.inboundSMSRate.toString(),
        outboundRate: company.outboundSMSRate.toString(),
      });
    }
  }, [company, categories, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call for onboarding/updating company
      const payload = {
        companyId: company.id,
        categoryId: formData.categoryId,
        inboundRate: parseFloat(formData.inboundRate),
        outboundRate: parseFloat(formData.outboundRate),
      };

      console.log('Onboarding company with data:', payload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the success callback with company data
      onCompanyOnboarded(company.id, {
        ...company,
        category: categories.find(cat => cat.id === formData.categoryId)?.name || company.category,
        inboundSMSRate: parseFloat(formData.inboundRate),
        outboundSMSRate: parseFloat(formData.outboundRate),
      });
      
    } catch (error) {
      console.error('Failed to onboard company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  if (!company) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isAlreadyOnboarded ? 'Configure' : 'Onboard'} Company`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-gray-900 flex items-center mb-3">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Company Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Company Name:</span>
              <div className="mt-1 font-semibold text-gray-900">{company.name}</div>
            </div>
            <div>
              <span className="text-gray-600">Current Category:</span>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {company.category}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Current Inbound Rate:</span>
              <div className="mt-1 font-medium text-green-600">${company.inboundSMSRate.toFixed(3)}</div>
            </div>
            <div>
              <span className="text-gray-600">Current Outbound Rate:</span>
              <div className="mt-1 font-medium text-blue-600">${company.outboundSMSRate.toFixed(3)}</div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Select New Category
          </label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            required
          >
            <option value="">Choose a category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center mb-2">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="font-medium text-gray-900">{selectedCategory.name}</span>
              </div>
              <p className="text-sm text-gray-600">{selectedCategory.description}</p>
            </div>
          )}
        </div>

        {/* SMS Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="inboundRate" className="block text-sm font-medium text-gray-700 mb-2">
              New Inbound SMS Rate
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.001"
                min="0"
                id="inboundRate"
                value={formData.inboundRate}
                onChange={(e) => handleInputChange('inboundRate', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="0.020"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Cost per incoming message</p>
          </div>

          <div>
            <label htmlFor="outboundRate" className="block text-sm font-medium text-gray-700 mb-2">
              New Outbound SMS Rate
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.001"
                min="0"
                id="outboundRate"
                value={formData.outboundRate}
                onChange={(e) => handleInputChange('outboundRate', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="0.050"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Cost per outgoing message</p>
          </div>
        </div>

        {/* Rate Preview */}
        {formData.inboundRate && formData.outboundRate && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Rate Preview
            </h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded p-3 border">
                <span className="text-gray-600">New Inbound Rate:</span>
                <div className="text-lg font-semibold text-green-600">
                  ${parseFloat(formData.inboundRate || 0).toFixed(3)}
                </div>
              </div>
              <div className="bg-white rounded p-3 border">
                <span className="text-gray-600">New Outbound Rate:</span>
                <div className="text-lg font-semibold text-blue-600">
                  ${parseFloat(formData.outboundRate || 0).toFixed(3)}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-700 font-medium">
                Example Cost for 100 messages:
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Inbound: ${(parseFloat(formData.inboundRate || 0) * 100).toFixed(2)} | 
                Outbound: ${(parseFloat(formData.outboundRate || 0) * 100).toFixed(2)} | 
                Total: ${((parseFloat(formData.inboundRate || 0) + parseFloat(formData.outboundRate || 0)) * 100).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            variant={isAlreadyOnboarded ? "primary" : "success"}
            className="min-w-[140px]"
          >
            {isSubmitting 
              ? (isAlreadyOnboarded ? 'Updating...' : 'Onboarding...') 
              : (isAlreadyOnboarded ? 'Update Configuration' : 'Onboard Company')
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyOnboardingModal;