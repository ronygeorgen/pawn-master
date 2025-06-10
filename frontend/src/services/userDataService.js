import { apiService } from './api';
import { mockUserData } from '../data/mockData';

class UserDataService {
  async getUserData(filters, viewMode) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.post('/user-data', { filters, viewMode });
      
      await new Promise(resolve => setTimeout(resolve, 900));
      
      // Apply filters to mock data
      let filteredData = mockUserData;
      
      if (filters.company) {
        filteredData = filteredData.filter(item => 
          item.company.toLowerCase().includes(filters.company.toLowerCase())
        );
      }
      
      if (filters.category) {
        filteredData = filteredData.filter(item => 
          item.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
}

export const userDataService = new UserDataService();