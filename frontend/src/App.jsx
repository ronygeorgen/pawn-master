import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import OnboardingPage from './pages/admin/OnboardingPage';
import DefaultSMSPage from './pages/admin/DefaultSMSPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import SMSGroupsPage from './pages/admin/SMSGroupsPage';
import UserDashboard from './pages/user/UserDashboard';
import LoginPage from './pages/admin/LoginPage';
import AdminProtected from './pages/admin/AdminProtected';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/onboarding\" replace />} />
              <Route path="/admin/login/" element={<LoginPage />} />
              <Route path="onboarding" element={<AdminProtected><OnboardingPage /></AdminProtected>} />
              <Route path="settings/default-sms" element={<AdminProtected><DefaultSMSPage /></AdminProtected>} />
              <Route path="settings/categories" element={<AdminProtected><CategoriesPage /></AdminProtected>} />
              <Route path="settings/sms-groups" element={<AdminProtected><SMSGroupsPage /></AdminProtected>} />
            </Route>
            
            {/* User Routes */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
            </Route>
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin\" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;