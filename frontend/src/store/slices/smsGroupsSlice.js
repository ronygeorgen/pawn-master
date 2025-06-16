import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { smsGroupsService } from '../../services/smsGroupsService';

const initialState = {
  smsGroups: [],
  success:false,
  selectedsmsGroup: null,
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
};

export const fetchSMSGroups = createAsyncThunk(
  'smsGroups/fetchSMSGroups',
  async (page = 1) => {
      return await smsGroupsService.getSMSGroups(page);
  }
);

export const fetchSMSGroup = createAsyncThunk(
  'smsGroups/fetchSMSGroup',
  async (location_id) => {
      return await smsGroupsService.getSMSGroup(location_id);
  }
);

export const updateSMSGroup = createAsyncThunk(
  'smsGroups/updateStatus',
  async ({ location_id, data }) => {
    console.log(data, 'ddrrrr');
    
    return await smsGroupsService.updateSMSGroup(location_id, data);
  }
);

const smsGroupsSlice = createSlice({
  name: 'smsGroups',
  initialState,
  reducers: {
    clear:(state)=>{
      state.success = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage:(state, action)=>{
      state.currentPage = action?.payload;
    },
    setSelectedsmsGroup: (state, action) => {
      state.selectedsmsGroup = action.payload;
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
        state.smsGroups = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchSMSGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SMS groups';
      })
      .addCase(updateSMSGroup.fulfilled, (state, action) => {
        console.log(action, 'action');
        const location_id = action?.meta?.arg?.location_id
        state.smsGroups = state.smsGroups.map((smsgroup) =>
          smsgroup.location_id === location_id ? action.payload : smsgroup
        );
      })
      .addCase(fetchSMSGroup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchSMSGroup.fulfilled, (state, action) => {
        console.log(action, 'action');
        const location_id = action?.meta?.arg?.location_id
        state.smsGroups = state.smsGroups.map((smsgroup) =>
          smsgroup?.location_id === location_id ? action.payload : smsgroup
        );
        state.selectedsmsGroup = action?.payload;
        state.loading = false;
        state.success = true;
      })
  },
});

export const { clearError, setSelectedsmsGroup, clear, setCurrentPage } = smsGroupsSlice.actions;
export default smsGroupsSlice.reducer;