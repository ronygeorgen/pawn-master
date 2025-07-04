import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, DollarSign } from 'lucide-react';
import { BulkupdateDefaultSMSRates, fetchDefaultSMSRates, updateDefaultSMSRates } from '../../store/slices/defaultSMSSlice';
import Button from '../../components/common/Button';
import Shimmer from '../../components/common/Shimmer';

const DefaultSMSPage = () => {
  const dispatch = useDispatch();
  const { rates, loading, error } = useSelector((state) => state.defaultSMS);
  
  console.log(rates, 'rates');
  
  const [formData, setFormData] = useState({
    incomingRate: 0,
    outgoingRate: 0,
    currency: 'USD',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDefaultSMSRates());
  }, [dispatch]);

  useEffect(() => {
    if (rates) {
      setFormData({
        default_inbound_rate: rates.default_inbound_rate,
        default_outbound_rate: rates.default_outbound_rate,
        default_call_outbound_rate:rates?.default_call_outbound_rate,
        default_call_inbound_rate: rates?.default_call_inbound_rate,
        currency: rates.currency,
      });
    }
  }, [rates]);

  console.log(formData, 'data');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        await dispatch(updateDefaultSMSRates(formData));
    } catch (error) {
      console.error('Failed to update rates:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateExample = () => {
    const messageCount = 100;
    return {
      incoming: (formData?.default_inbound_rate * messageCount).toFixed(2),
      outgoing: (formData?.default_outbound_rate * messageCount).toFixed(2),
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <Shimmer width="w-64\" height="h-6\" className="mb-2" />
            <Shimmer width="w-96\" height="h-4" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Shimmer width="w-32" height="h-5" className="mb-3" />
                  <Shimmer width="w-full" height="h-12" />
                  <Shimmer width="w-48" height="h-4" className="mt-2" />
                </div>
                <div>
                  <Shimmer width="w-32" height="h-5" className="mb-3" />
                  <Shimmer width="w-full" height="h-12" />
                  <Shimmer width="w-48" height="h-4" className="mt-2" />
                </div>
                <div>
                  <Shimmer width="w-20" height="h-5" className="mb-3" />
                  <Shimmer width="w-full" height="h-12" />
                </div>
                <Shimmer width="w-32" height="h-10" />
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <Shimmer width="w-32" height="h-6" className="mb-4" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Shimmer width="w-24" height="h-5" />
                    <Shimmer width="w-20" height="h-5" />
                  </div>
                  <div className="flex justify-between">
                    <Shimmer width="w-24" height="h-5" />
                    <Shimmer width="w-20" height="h-5" />
                  </div>
                  <div className="border-t pt-4">
                    <Shimmer width="w-48" height="h-6" className="mb-2" />
                    <Shimmer width="w-32" height="h-4" className="mb-1" />
                    <Shimmer width="w-32" height="h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const example = calculateExample();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Default SMS and Call Rates
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure your default pricing for SMS messages
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="incomingRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Incoming SMS Rate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    id="incomingRate"
                    value={formData?.default_inbound_rate}
                    onChange={(e) => handleInputChange('default_inbound_rate', parseFloat(e.target.value) || 0)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.02"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cost per incoming message</p>
              </div>
              
              <div>
                <label htmlFor="outgoingRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Outgoing SMS Rate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    id="outgoingRate"
                    value={formData?.default_outbound_rate}
                    onChange={(e) => handleInputChange('default_outbound_rate', parseFloat(e.target.value) || 0)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.05"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cost per outgoing message</p>
              </div>

              <div>
                <label htmlFor="default_call_inbound_rate" className="block text-sm font-medium text-gray-700 mb-2">
                  Call Inbound Rate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    id="default_call_inbound_rate"
                    value={formData?.default_call_inbound_rate}
                    onChange={(e) => handleInputChange('default_call_inbound_rate', parseFloat(e.target.value) || 0)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.05"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cost per outgoing message</p>
              </div>

              <div>
                <label htmlFor="default_call_outbound_rate" className="block text-sm font-medium text-gray-700 mb-2">
                  Call Outbound Rate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    id="default_call_outbound_rate"
                    value={formData?.default_call_outbound_rate}
                    onChange={(e) => handleInputChange('default_call_outbound_rate', parseFloat(e.target.value) || 0)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.05"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cost per outgoing message</p>
              </div>
              
              {/* <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData?.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div> */}
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="h-fit sm:w-auto"
                >
                  Save Changes
                </Button>
              </div>

            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Rate Preview</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Incoming SMS</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${formData?.default_inbound_rate} {formData?.currency}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Outgoing SMS</span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${formData?.default_outbound_rate} {formData?.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Incoming Call</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${formData?.default_call_inbound_rate} {formData?.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Outgoing Call</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${formData?.default_call_outbound_rate} {formData?.currency}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Example: 100 messages</h5>
                  <p className="text-sm text-gray-600">
                    Incoming: ${example?.incoming}
                  </p>
                  <p className="text-sm text-gray-600">
                    Outgoing: ${example?.outgoing}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefaultSMSPage;