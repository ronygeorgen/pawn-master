import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompaniesByLocation } from '../store/slices/companiesSlice';

export const useCompanies = (locationId) => {
  const dispatch = useDispatch();
  const { companies, loading, error } = useSelector(
    (state) => state.companies
  );

  useEffect(() => {
    if (locationId) {
      dispatch(fetchCompaniesByLocation(locationId));
    }
  }, [dispatch, locationId]);

  return {
    companies,
    loading,
    error,
  };
};