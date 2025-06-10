import { apiService } from './api';
import { mockDefaultSMSRates } from '../data/mockData';

class DefaultSMSService {
  async getDefaultRates() {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.get('/default-sms-rates');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDefaultSMSRates;
    } catch (error) {
      console.error('Error fetching default SMS rates:', error);
      throw error;
    }
  }

  async updateDefaultRates(rates) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.put('/default-sms-rates', rates);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      return rates;
    } catch (error) {
      console.error('Error updating default SMS rates:', error);
      throw error;
    }
  }
}

export const defaultSMSService = new DefaultSMSService();