import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userDataService } from '../../services/userDataService';

const initialState = {
  data: [],
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
  filters: {
    company: '',
    category: '',
    dateRange: { start: '', end: '' },
  },
  viewMode: 'company',
  loading: false,
  refreshCallSuccess:false,
  error: null,
  success: false
};

export const fetchUserData = createAsyncThunk(
  'userData/fetchData',
  async ({ filters, viewMode, page = 1, search = '' }) => {
    console.log(filters, viewMode, 'from slice acrtion');
    
    return await userDataService.getUserData(filters, viewMode, page, search);
  }
);

export const refreshWallet = createAsyncThunk(
  'userData/refreshWallet',
  async ({query_name, id}, {rejectWithValue}) => {
    console.log(query_name, 'from slice acrtion');
    try{
      return await userDataService.refreshWalletService(query_name, id);
    }
    catch(error){
      return rejectWithValue(error)
    }
  }
);

export const refreshCall = createAsyncThunk(
  'userData/refreshCall',
  async ({query_name, id}, {rejectWithValue}) => {
    try{
      return await userDataService.refreshCallService(query_name, id);
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
      state.refreshCallSuccess=false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log(action.payload, 'data')
        state.loading = false;
        state.data = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
        state.currentPage = action.meta.arg.page || 1;
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

      .addCase(refreshCall.fulfilled, (state)=>{
        state.refreshCallSuccess = true;
      })
  },
});

export const { setFilters, setViewMode, clearError } = userDataSlice.actions;
export default userDataSlice.reducer;