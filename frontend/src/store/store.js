import { configureStore } from '@reduxjs/toolkit';
import locationsReducer from './slices/locationsSlice';
import companiesReducer from './slices/companiesSlice';
import categoriesReducer from './slices/categoriesSlice';
import smsGroupsReducer from './slices/smsGroupsSlice';
import defaultSMSReducer from './slices/defaultSMSSlice';
import userDataReducer from './slices/userDataSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    locations: locationsReducer,
    companies: companiesReducer,
    categories: categoriesReducer,
    smsGroups: smsGroupsReducer,
    defaultSMS: defaultSMSReducer,
    userData: userDataReducer,
    admin: adminReducer
  },
});