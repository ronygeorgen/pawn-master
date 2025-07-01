import { apiService } from './api';

class DefaultSMSService {
  async getDefaultRates() {
    try {
      const response = await apiService.get('/accounts/sms-config/default-config');
      return {
        default_inbound_rate: parseFloat(response.default_inbound_rate),
        default_outbound_rate: parseFloat(response.default_outbound_rate),
        currency: response.default_currency,
        default_call_outbound_rate:response?.default_call_outbound_rate,
        default_call_inbound_rate: response?.default_call_inbound_rate,
      };
    } catch (error) {
      console.error('Error fetching default SMS rates:', error);
      throw error;
    }
  }

  async updateDefaultRates(rates) {
    try {
      const response = await apiService.put('/accounts/sms-config/update-default-config/', {...rates, apply_to_existing:true});
      return response
    } catch (error) {
      console.error('Error updating default SMS rates:', error);
      throw error;
    }
  }

  async BulkupdateDefaultRates(rates) {
    try {
      const response = await apiService.post('/accounts/sms-config/bulk-apply-defaults/', {...rates, force_update:true});
      return response
    } catch (error) {
      console.error('Error updating default SMS rates:', error);
      throw error;
    }
  }
}

export const defaultSMSService = new DefaultSMSService();