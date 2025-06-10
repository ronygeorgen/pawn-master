import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationsService } from '../../services/locationsService';

const initialState = {
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
};

export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async () => {
    return await locationsService.getLocations();
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locations';
      });
  },
});

export const { setSelectedLocation, clearError } = locationsSlice.actions;
export default locationsSlice.reducer;