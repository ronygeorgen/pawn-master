import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { defaultSMSService } from '../../services/defaultSMSService';

const initialState = {
  rates: null,
  loading: false,
  error: null,
};

export const fetchDefaultSMSRates = createAsyncThunk(
  'defaultSMS/fetchRates',
  async () => {
    return await defaultSMSService.getDefaultRates();
  }
);

export const updateDefaultSMSRates = createAsyncThunk(
  'defaultSMS/updateRates',
  async (rates) => {
    return await defaultSMSService.updateDefaultRates(rates);
  }
);

const defaultSMSSlice = createSlice({
  name: 'defaultSMS',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultSMSRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDefaultSMSRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(fetchDefaultSMSRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch default SMS rates';
      })
      .addCase(updateDefaultSMSRates.fulfilled, (state, action) => {
        state.rates = action.payload;
      });
  },
});

export const { clearError } = defaultSMSSlice.actions;
export default defaultSMSSlice.reducer;