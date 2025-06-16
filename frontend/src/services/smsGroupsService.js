import { apiService } from './api';
import { mockSMSGroups } from '../data/mockData';

class SMSGroupsService {
  async getSMSGroups(page) {
    try {
      const res = await apiService.get(`accounts/ghl-auth/?page=${page}`)
      console.log(res, 'resss');
      return res;
    } catch (error) {
      console.error('Error fetching SMS groups:', error);
      throw error;
    }
  }

  async getSMSGroup(location_id) {
    try {
      const res = await apiService.get(`accounts/ghl-auth/${location_id}/`)
      console.log(res, 'resss');
      return res;
    } catch (error) {
      console.error('Error fetching SMS groups:', error);
      throw error;
    }
  }

  async updateSMSGroup(location_id, data) {
    // If category_id is an object, extract only the id
    if (data.category_id && typeof data.category_id === 'object' && 'id' in data.category_id) {
      data.category_id = data.category_id.id;
    }
  
    console.log("Sanitized data: ", data);
  
    try {
      const res = await apiService.put(`accounts/ghl-auth/${location_id}/`, data);
      return res;
    } catch (error) {
      console.error('Error updating SMS group status:', error);
      return error?.response?.data;
    }
  }
}

export const smsGroupsService = new SMSGroupsService();