import { apiService } from './api';
import { mockUserData } from '../data/mockData';

class UserDataService {
  async getUserData(filters, viewMode, page = 1, search) {
    try {
      console.log("Fetching real data with filters:", filters, viewMode);

      // Add viewMode validation
      if (!viewMode) {
        console.warn('ViewMode is undefined, defaulting to company');
        viewMode = 'company';
      }

      // Ensure ISO string format (e.g., 2025-06-01T00:00:00Z)
      const formatToYMD = (dateStr, fallbackDate) => {
        const date = dateStr ? new Date(dateStr) : fallbackDate;
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 0-indexed months
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      console.log('Filters from service:', filters);
      console.log('ViewMode from service:', viewMode);
      
      const payload = {
        view_type: viewMode,
        date_range: {
          start: formatToYMD(filters?.dateRange?.start, sixMonthsAgo),
          end: formatToYMD(filters?.dateRange?.end, now),
        },
        // Fix category handling - check for both id and category_name
        ...(filters?.category?.id && { category: Number(filters.category.id) }),
        // Fix company handling - ensure company_id is used correctly
        ...(filters?.company?.id && { company_id: filters.company.id }),
        ...(search && { search }),
      };

      console.log('Payload being sent:', payload);

      const response = await apiService.post(`/accounts/analytics/usage-analytics/?page=${page}`, payload);
      console.log(response, 'response')
      const rawData = response || [];

      console.log("API Response:", response);
      console.log("Raw data received:", rawData);
      
      return rawData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  async refreshWalletService(query_name, id) {
    console.log(query_name, 'location_id');
    
    const response = await apiService.get(`/accounts/sync-wallets/?${query_name}=${id}`);
    return response
  }

  async refreshCallService(query_name, id) {
    console.log(query_name, 'query', id);
    
    const response = await apiService.get(`/accounts/sync-calls/?${query_name}=${id}`);
    console.log(response, 'responseee');
    
    return response
  }
}

export const userDataService = new UserDataService();