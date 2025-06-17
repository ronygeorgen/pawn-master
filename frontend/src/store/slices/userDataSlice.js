import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userDataService } from '../../services/userDataService';

const initialState = {
  data: [],
  filters: {
    company: '',
    category: '',
    dateRange: { start: '', end: '' },
  },
  viewMode: 'company',
  loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'userData/fetchData',
  async ({ filters, viewMode }) => {
    console.log(filters, viewMode, 'from slice acrtion');
    
    return await userDataService.getUserData(filters, viewMode);
  }
);

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export const { setFilters, setViewMode, clearError } = userDataSlice.actions;
export default userDataSlice.reducer;