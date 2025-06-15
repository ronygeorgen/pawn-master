import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationsService } from '../../services/locationsService';

const initialState = {
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
};

export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async (page = 1) => {
    return await locationsService.getLocations(page);
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
        state.locations = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locations';
      });
  },
});

export const { setSelectedLocation, clearError } = locationsSlice.actions;
export default locationsSlice.reducer;