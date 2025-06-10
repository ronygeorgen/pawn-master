import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { smsGroupsService } from '../../services/smsGroupsService';

const initialState = {
  smsGroups: [],
  loading: false,
  error: null,
};

export const fetchSMSGroups = createAsyncThunk(
  'smsGroups/fetchSMSGroups',
  async () => {
    return await smsGroupsService.getSMSGroups();
  }
);

export const updateSMSGroupStatus = createAsyncThunk(
  'smsGroups/updateStatus',
  async ({ id, isActive }) => {
    return await smsGroupsService.updateSMSGroupStatus(id, isActive);
  }
);

const smsGroupsSlice = createSlice({
  name: 'smsGroups',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSMSGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSMSGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.smsGroups = action.payload;
      })
      .addCase(fetchSMSGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SMS groups';
      })
      .addCase(updateSMSGroupStatus.fulfilled, (state, action) => {
        const index = state.smsGroups.findIndex(group => group.id === action.payload.id);
        if (index !== -1) {
          state.smsGroups[index] = action.payload;
        }
      });
  },
});

export const { clearError } = smsGroupsSlice.actions;
export default smsGroupsSlice.reducer;