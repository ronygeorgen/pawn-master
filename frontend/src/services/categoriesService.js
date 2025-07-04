import { apiService } from './api';
import { mockCategories } from '../data/mockData';

class CategoriesService {
  async getCategories() {
    try {
      const res = await apiService.get('category/categories/')
      console.log(res, 'resss categories');
      return res;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(id) {
    try {
      return await apiService.get(`category/categories/${id}/`);
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      return await apiService.post('category/categories/', categoryData);
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
  }

  async updateCategory(id, data) {
    try {
      return await apiService.put(`category/categories/${id}/`, data);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id) {
      return await apiService.delete(`category/categories/${id}/`);
  }
}

export const categoriesService = new CategoriesService();