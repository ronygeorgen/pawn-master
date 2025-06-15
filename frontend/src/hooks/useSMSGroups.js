import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSMSGroups, setCurrentPage, setSelectedsmsGroup } from '../store/slices/smsGroupsSlice';


export const useSMSGroups = () => {
  const dispatch = useDispatch();
  const { smsGroups, selectedsmsGroup, loading, error, next, previous, success, currentPage } = useSelector(
    (state) => state.smsGroups
  );

  useEffect(() => {
    dispatch(fetchSMSGroups(currentPage));
  }, [dispatch, currentPage]);

  const selectsmsGroup = (smsGroup) => {
    dispatch(setSelectedsmsGroup(smsGroup));
  };

  const goToNextPage = () => {
    if (next) dispatch(setCurrentPage((prev) => prev + 1));
  };

  const goToPreviousPage = () => {
    if (previous && currentPage > 1) dispatch(setCurrentPage((prev) => prev - 1));
  };

  return {
    smsGroups,
    selectedsmsGroup,
    loading,
    error,
    selectsmsGroup,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    success
  };
};
