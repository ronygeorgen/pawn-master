import { apiService } from './api';
import { mockCompanies } from '../data/mockData';

class CompaniesService {
  async getCompaniesByLocation(locationId) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.get(`/companies?locationId=${locationId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockCompanies.filter(company => company.locationId === locationId);
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async onboardCompany(companyData) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.post('/companies/onboard', companyData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Onboarding company:', companyData);
      
      return {
        success: true,
        message: 'Company onboarded successfully',
        data: companyData
      };
    } catch (error) {
      console.error('Error onboarding company:', error);
      throw error;
    }
  }

  async updateCompanyConfiguration(companyId, configData) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.put(`/companies/${companyId}/config`, configData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Updating company configuration:', { companyId, configData });
      
      return {
        success: true,
        message: 'Company configuration updated successfully',
        data: { companyId, ...configData }
      };
    } catch (error) {
      console.error('Error updating company configuration:', error);
      throw error;
    }
  }
}

export const companiesService = new CompaniesService();