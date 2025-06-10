import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categoriesSlice';

export const useCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const addCategory = async (categoryData) => {
    await dispatch(createCategory(categoryData));
  };

  const editCategory = async (id, data) => {
    await dispatch(updateCategory({ id, data }));
  };

  const removeCategory = async (id) => {
    await dispatch(deleteCategory(id));
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    editCategory,
    removeCategory,
  };
};