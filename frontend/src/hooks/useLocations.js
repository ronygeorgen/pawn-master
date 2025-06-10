import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations, setSelectedLocation } from '../store/slices/locationsSlice';

export const useLocations = () => {
  const dispatch = useDispatch();
  const { locations, selectedLocation, loading, error } = useSelector(
    (state) => state.locations
  );

  useEffect(() => {
    if (locations.length === 0) {
      dispatch(fetchLocations());
    }
  }, [dispatch, locations.length]);

  const selectLocation = (location) => {
    dispatch(setSelectedLocation(location));
  };

  return {
    locations,
    selectedLocation,
    loading,
    error,
    selectLocation,
  };
};