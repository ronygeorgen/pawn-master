import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../store/slices/categoriesSlice';

export const useCategories = () => {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categories);
  const loading = useSelector((state) => state.categories.loading);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const add = (data) => dispatch(createCategory(data));
  const edit = (id, data) => dispatch(updateCategory({ id, data }));
  const remove = (id) => dispatch(deleteCategory(id));

  return {
    categories,
    loading,
    error,
    createCategory: add,
    updateCategory: edit,
    deleteCategory: remove,
  };
};