import { apiService } from './api';
import { mockSMSGroups } from '../data/mockData';

class SMSGroupsService {
  async getSMSGroups() {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.get('/sms-groups');
      
      await new Promise(resolve => setTimeout(resolve, 700));
      return mockSMSGroups;
    } catch (error) {
      console.error('Error fetching SMS groups:', error);
      throw error;
    }
  }

  async updateSMSGroupStatus(id, isActive) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.put(`/sms-groups/${id}/status`, { isActive });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const group = mockSMSGroups.find(g => g.id === id);
      if (!group) {
        throw new Error('SMS Group not found');
      }
      return { ...group, isActive };
    } catch (error) {
      console.error('Error updating SMS group status:', error);
      throw error;
    }
  }
}

export const smsGroupsService = new SMSGroupsService();