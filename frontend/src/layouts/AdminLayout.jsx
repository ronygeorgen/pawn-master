import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, MessageSquare, Tag, Shield, Users, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/adminSlice';

const AdminLayout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSettingsPage = location.pathname.includes('/settings/');
  const {isAuthenticated} = useSelector(state=>state.admin)

  const settingsOptions = [
    { label: 'SMS Groups', path: '/admin/settings/sms-groups', icon: Users },
    { label: 'Categories', path: '/admin/settings/categories', icon: Tag },
    { label: 'Default SMS', path: '/admin/settings/default-sms', icon: MessageSquare },
    { label: 'Onboarding', path: '/admin/onboarding', icon: Shield },
  ];

  const handleLogout =()=>{
    dispatch(logout());
  }

  console.log(isAuthenticated, 'isss')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {isSettingsPage && (
                <button
                  onClick={() => navigate('/admin/onboarding')}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                GHL SMS Management - Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/user"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Switch to User View
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>
                
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      {settingsOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <Link
                            key={option.path}
                            to={option.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {option.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {isAuthenticated && 
                <Button onClick={handleLogout} variant='secondary'> Logout</Button>
              }
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;