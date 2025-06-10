import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companiesService } from '../../services/companiesService';

const initialState = {
  companies: [],
  loading: false,
  error: null,
};

export const fetchCompaniesByLocation = createAsyncThunk(
  'companies/fetchByLocation',
  async (locationId) => {
    return await companiesService.getCompaniesByLocation(locationId);
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompaniesByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch companies';
      });
  },
});

export const { clearError } = companiesSlice.actions;
export default companiesSlice.reducer;