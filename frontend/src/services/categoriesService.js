import { apiService } from './api';
import { mockCategories } from '../data/mockData';

class CategoriesService {
  async getCategories() {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.get('/categories');
      
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.post('/categories', categoryData);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
      };
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id, data) {
    try {
      // Replace with actual API call when backend is ready
      // return await apiService.put(`/categories/${id}`, data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const existingCategory = mockCategories.find(cat => cat.id === id);
      if (!existingCategory) {
        throw new Error('Category not found');
      }
      return { ...existingCategory, ...data };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      // Replace with actual API call when backend is ready
      // await apiService.delete(`/categories/${id}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();