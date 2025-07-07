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
  success: false
};

export const fetchUserData = createAsyncThunk(
  'userData/fetchData',
  async ({ filters, viewMode }) => {
    console.log(filters, viewMode, 'from slice acrtion');
    
    return await userDataService.getUserData(filters, viewMode);
  }
);

export const refreshWallet = createAsyncThunk(
  'userData/refreshWallet',
  async (location_id, {rejectWithValue}) => {
    console.log(location_id, 'from slice acrtion');
    try{
      return await userDataService.refreshWalletService(location_id);
    }
    catch(error){
      return rejectWithValue(error)
    }
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
      state.success = false;
      state.loading = false;
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
      })

      .addCase(refreshWallet.fulfilled, (state, action) => {
        const locationId = action.meta.arg;
        state.loading = false;
        console.log(action?.payload, 'payload', locationId);
        
        state.data = state.data.map((item) => {
          if (item?.location_id === locationId) {
            return {
              ...item,
              current_balance: action?.payload?.details?.current_balance,
            };
          }
          return item;
        });
        state.success = true;
      })
  },
});

export const { setFilters, setViewMode, clearError } = userDataSlice.actions;
export default userDataSlice.reducer;