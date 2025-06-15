import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations, setSelectedLocation } from '../store/slices/locationsSlice';

export const useLocations = () => {
  const dispatch = useDispatch();
  const { locations, selectedLocation, loading, error, next, previous } = useSelector(
    (state) => state.locations
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLocations(currentPage));
  }, [dispatch, currentPage]);

  const selectLocation = (location) => {
    dispatch(setSelectedLocation(location));
  };

  const goToNextPage = () => {
    if (next) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (previous && currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return {
    locations,
    selectedLocation,
    loading,
    error,
    selectLocation,
    goToNextPage,
    goToPreviousPage,
    currentPage,
  };
};
