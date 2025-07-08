import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { BarChart3, Filter } from 'lucide-react';
import { setViewMode, setFilters, fetchUserData } from '../store/slices/userDataSlice';
import FilterModal from '../components/common/FilterModal';
import { fetchData, setcallsmsFilters } from '../store/slices/callsmschartslice';

const UserLayout = () => {
  const dispatch = useDispatch();
  const { viewMode, filters } = useSelector(state => state.userData);
  const localFilters = useSelector(state=>state.callsms.filters)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleViewModeToggle = () => {
    const newMode = viewMode === 'company' ? 'account' : 'company';
    console.log('Switching view mode from', viewMode, 'to', newMode);
    
    dispatch(setViewMode(newMode));
    
    // Pass filters and new viewMode directly to avoid race conditions
    dispatch(fetchUserData({ filters, viewMode: newMode }));
  };

  const handleApplyFilters = (newFilters) => {
    console.log('Applying filters:', newFilters, 'with viewMode:', viewMode);
    dispatch(setFilters(newFilters));
    dispatch(setcallsmsFilters({date_range:newFilters.dateRange, view_type:viewMode}))
    // Pass filters and viewMode directly to avoid race conditions
    dispatch(fetchUserData({ filters: newFilters, viewMode }));
    dispatch(fetchData({...localFilters, date_range:newFilters.dateRange, view_type:viewMode}))
  };

  const handleResetFilters = () => {
    // Match the structure used in FilterModal
    const resetData = {
      company: { id: null, company_name: '' },
      category: { id: null, category_name: '' },
      dateRange: { start: '', end: '' },
    };
    
    console.log('Resetting filters to:', resetData, 'with viewMode:', viewMode);
    dispatch(setFilters(resetData));
    
    // Pass reset filters and current viewMode directly
    dispatch(fetchUserData({ filters: resetData, viewMode }));
    dispatch(fetchData(localFilters))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                GHL SMS Analytics Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* View Mode Toggle with Animation */}
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  viewMode === 'company' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  Company View
                </span>
                
                <div className="relative">
                  <button
                    onClick={handleViewModeToggle}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    style={{
                      backgroundColor: viewMode === 'company' ? '#e5e7eb' : '#3b82f6'
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                        viewMode === 'company' ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </button>
                </div>
                
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  viewMode === 'account' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  Account View
                </span>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              <Link
                to="/admin"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Switch to Admin View
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-24">
        <Outlet context={{ isFilterModalOpen, setIsFilterModalOpen }} />
      </main>

      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default UserLayout;