import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

const initialState = {
  data: [],
  filters: {},
  loading: false,
  error: null,
  success: false,
  companyAccounts: [],
};

export const fetchData = createAsyncThunk(
  'callsms/fetchData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().callsms;
      const { filters } = state;

      const today = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(today.getFullYear() - 3);
      
      const {
        date_range = {
          start: threeYearsAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        },
        location_ids = [],
        graph_type = 'monthly',
        data_type = 'call',
        view_type = 'company',
      } = filters;

      const payload = {
        date_range,
        graph_type,
        data_type,
        view_type,
        ...(filters?.company_ids?.length ? { company_ids: filters.company_ids } : {}),
        ...(filters?.location_ids?.length ? { location_ids: filters.location_ids } : {}),
        };

      const response = await apiService.post('accounts/analytics/bar-graph-analytics/', payload);

      console.log(response, 'response');
      
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchCompanyAccounts = createAsyncThunk(
  'common/fetchCompanyAccounts',
  async (type, { rejectWithValue }) => {
    try {
        console.log(type, 'typeee from ');
        
      const response = await apiService.get(`accounts/get-company-account/?type=${type}`);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Error fetching company accounts");
    }
  }
);

const callsmsSlice = createSlice({
  name: 'callsms',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clear: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
    resetCompanyAccounts: (state) => {
        state.companyAccounts = [];
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchData.fulfilled, (state, action)=>{
        state.data = action?.payload
    })
    .addCase(fetchCompanyAccounts.fulfilled, (state, action) => {
        state.companyAccounts = action.payload || [];
    })
  }
})

export const { setFilters, clear, resetCompanyAccounts } = callsmsSlice.actions;
export default callsmsSlice.reducer;