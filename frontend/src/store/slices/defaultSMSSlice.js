import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { defaultSMSService } from '../../services/defaultSMSService';

const initialState = {
  rates: null,
  loading: false,
  error: null,
};

// Thunk to fetch default SMS rates
export const fetchDefaultSMSRates = createAsyncThunk(
  'defaultSMS/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      return await defaultSMSService.getDefaultRates();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch default SMS rates');
    }
  }
);

// Thunk to update default SMS rates
export const updateDefaultSMSRates = createAsyncThunk(
  'defaultSMS/updateRates',
  async (rates, { rejectWithValue }) => {
    try {
      return await defaultSMSService.updateDefaultRates(rates);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update default SMS rates');
    }
  }
);

export const BulkupdateDefaultSMSRates = createAsyncThunk(
  'defaultSMS/bulkupdateRates',
  async (rates, { rejectWithValue }) => {
    try {
      return await defaultSMSService.BulkupdateDefaultRates(rates);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update default SMS rates');
    }
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
        state.error = action.payload;
      })
      .addCase(updateDefaultSMSRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDefaultSMSRates.fulfilled, (state, action) => {
        console.log(action.payload, 'payload');
        
        state.loading = false;
        state.rates = action.payload?.config;
      })
      .addCase(updateDefaultSMSRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(BulkupdateDefaultSMSRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(BulkupdateDefaultSMSRates.fulfilled, (state, action) => {
        console.log(action.payload, 'payload');
        
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(BulkupdateDefaultSMSRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = defaultSMSSlice.actions;
export default defaultSMSSlice.reducer;
