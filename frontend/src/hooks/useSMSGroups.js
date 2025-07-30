"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSMSGroups, setCurrentPage, setSelectedsmsGroup } from "../store/slices/smsGroupsSlice"

export const useSMSGroups = () => {
  const dispatch = useDispatch()
  const {
    smsGroups,
    selectedsmsGroup,
    loading,
    error,
    next,
    previous,
    success,
    currentPage,
    count, // Make sure this is available in your Redux state
  } = useSelector((state) => state.smsGroups)

  console.log("nexttttt:L ", next)
  console.log("Pagination state:", { next, previous, currentPage, count })

  useEffect(() => {
    dispatch(fetchSMSGroups(currentPage))
  }, [dispatch, currentPage])

  const selectsmsGroup = (smsGroup) => {
    dispatch(setSelectedsmsGroup(smsGroup))
  }

  const goToNextPage = () => {
    if (next) {
      console.log("Going to next page:", currentPage + 1)
      dispatch(setCurrentPage(currentPage + 1))
    }
  }

  const goToPreviousPage = () => {
    if (previous && currentPage > 1) {
      console.log("Going to previous page:", currentPage - 1)
      dispatch(setCurrentPage(currentPage - 1))
    }
  }

  return {
    smsGroups,
    selectedsmsGroup,
    loading,
    error,
    selectsmsGroup,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    success,
    next,
    previous,
    count,
  }
}
