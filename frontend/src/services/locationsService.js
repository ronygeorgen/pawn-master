import { apiService } from './api';
import { mockLocations } from '../data/mockData';

class LocationsService {
  async getLocations(page = 1) {
    try {
      const res = await apiService.get(`accounts/ghl-auth/?page=${page}`)
      console.log(res, 'resss');
      return res;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
}

export const locationsService = new LocationsService();