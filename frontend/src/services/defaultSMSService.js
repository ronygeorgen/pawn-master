import { apiService } from './api';

class DefaultSMSService {
  async getDefaultRates() {
    try {
      const response = await apiService.get('/accounts/sms-config/default-config');
      return {
        default_inbound_rate: parseFloat(response.default_inbound_rate),
        default_outbound_rate: parseFloat(response.default_outbound_rate),
        currency: response.default_currency,
      };
    } catch (error) {
      console.error('Error fetching default SMS rates:', error);
      throw error;
    }
  }

  async updateDefaultRates(rates) {
    try {
      const response = await apiService.put('/accounts/sms-config/update-default-config/', rates);
      return response
    } catch (error) {
      console.error('Error updating default SMS rates:', error);
      throw error;
    }
  }
}

export const defaultSMSService = new DefaultSMSService();