import { apiService } from './api';
import { mockLocations } from '../data/mockData';

class LocationsService {
  async getLocations() {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.get('/locations');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockLocations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
}

export const locationsService = new LocationsService();