import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

const access = localStorage.getItem('access')
const refresh = localStorage.getItem('refresh')

const isAuthenticated = access? true : false;

const initialState = {
  admin: null,
  loading: false,
  error: null,
  isAuthenticated: isAuthenticated,
  access: access,
  refresh: refresh
};

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminService.login(credentials);
      return response; // expected to be { admin: {...}, token: "..." }
    } catch (error) {
        console.log(error, 'ss');
        
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    logout: (state)=>{
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        console.log(action, 'acgg');
        
        state.loading = false;
        state.admin = action.payload?.admin;
        state.isAuthenticated = true;
        state.access = action?.payload?.access
        state.refresh = action?.payload?.refresh
        localStorage.setItem('access', action?.payload?.access)
        localStorage.setItem('refresh', action?.payload?.refresh)
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        console.log(action);
        
        if (typeof action.payload === 'object' && action.payload !== null) {
            state.error = action.payload;
        } else {
            state.error = { general: action.payload };
        }
      })
  },
});

export const { clearAdminError, logout } = adminSlice.actions;
export default adminSlice.reducer;
