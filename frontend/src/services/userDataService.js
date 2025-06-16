import { apiService } from './api';
import { mockUserData } from '../data/mockData';

class UserDataService {
  async getUserData(filters, viewMode) {
    try {
      console.log("Fetching real data with filters:", filters, viewMode);

      // Ensure ISO string format (e.g., 2025-06-01T00:00:00Z)

      const formatToISO = (dateStr, fallbackDate) => {
        const date = dateStr ? new Date(dateStr) : fallbackDate;
        return date.toISOString();
      };
      
      const now = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(now.getFullYear() - 5);

      const payload = {
        view_type: viewMode,
        date_range: {
          start: formatToISO(filters.dateRange?.start, fiveYearsAgo),
          end: formatToISO(filters.dateRange?.end, now),
        },
      };

      const response = await apiService.post('/accounts/analytics/usage-analytics/', payload);
      const rawData = response.data || [];

      console.log("responsel:", response)

      let transformedData = [];

      if (viewMode === 'account') {
        transformedData = rawData.map((item, index) => ({
          id: (index + 1).toString(),
          company: item.company_name ?? 'Unknown Company',
          location: item.location_name,
          inboundSegment: item.total_inbound_segments.toString(),
          outboundSegment: item.total_outbound_segments.toString(),
          messageCountInbound: item.total_inbound_messages,
          messageCountOutbound: item.total_outbound_messages,
          inboundUsage: parseFloat(item.total_inbound_usage),
          outboundUsage: parseFloat(item.total_outbound_usage),
          category: 'General',
        }));
      } else if (viewMode === 'company') {
        transformedData = rawData.map((item, index) => ({
          id: (index + 1).toString(),
          company: item.company_name,
          location: `(${item.locations_count} locations)`,
          inboundSegment: item.total_inbound_segments.toString(),
          outboundSegment: item.total_outbound_segments.toString(),
          messageCountInbound: item.total_inbound_messages,
          messageCountOutbound: item.total_outbound_messages,
          inboundUsage: parseFloat(item.total_inbound_usage),
          outboundUsage: parseFloat(item.total_outbound_usage),
          category: 'General',
        }));
      }

      // Optional frontend filtering
      // if (filters.company) {
      //   transformedData = transformedData.filter(item =>
      //     item.company.toLowerCase().includes(filters.company.toLowerCase())
      //   );
      // }

      // if (filters.category) {
      //   transformedData = transformedData.filter(item =>
      //     item.category.toLowerCase().includes(filters.category.toLowerCase())
      //   );
      // }
      
      console.log("new data set filtered: ", transformedData)

      return transformedData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
}

export const userDataService = new UserDataService();