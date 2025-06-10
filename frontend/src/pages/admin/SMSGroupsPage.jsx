import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, MapPin, DollarSign, Edit2 } from 'lucide-react';
import { fetchSMSGroups, updateSMSGroupStatus } from '../../store/slices/smsGroupsSlice';
import Button from '../../components/common/Button';
import Shimmer from '../../components/common/Shimmer';

const SMSGroupsPage = () => {
  const dispatch = useDispatch();
  const { smsGroups, loading, error } = useSelector((state) => state.smsGroups);

  useEffect(() => {
    dispatch(fetchSMSGroups());
  }, [dispatch]);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(updateSMSGroupStatus({ id, isActive: !currentStatus }));
    } catch (error) {
      console.error('Failed to update SMS group status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <Shimmer width="w-32\" height="h-6\" className="mb-2" />
            <Shimmer width="w-96\" height="h-4" />
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Shimmer width="w-32" height="h-6" />
                    <Shimmer width="w-16" height="h-6" />
                  </div>
                  <Shimmer width="w-full" height="h-4" className="mb-2" />
                  <Shimmer width="w-24" height="h-5" className="mb-4" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Shimmer width="w-20" height="h-4" className="mb-1" />
                      <Shimmer width="w-16" height="h-5" />
                    </div>
                    <div>
                      <Shimmer width="w-20" height="h-4" className="mb-1" />
                      <Shimmer width="w-16" height="h-5" />
                    </div>
                  </div>
                  <Shimmer width="w-full" height="h-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            SMS Groups
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your onboarded locations and their SMS settings
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {smsGroups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    {group.name}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    group.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {group.isActive ? 'active' : 'inactive'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {group.address}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {group.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Inbound Rate</p>
                    <p className="text-sm font-semibold text-green-600 flex items-center">
                      <DollarSign className="w-3 h-3" />
                      {group.inboundRate.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Outbound Rate</p>
                    <p className="text-sm font-semibold text-blue-600 flex items-center">
                      <DollarSign className="w-3 h-3" />
                      {group.outboundRate.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleStatusToggle(group.id, group.isActive)}
                    variant={group.isActive ? 'danger' : 'success'}
                    size="sm"
                    className="flex-1"
                  >
                    {group.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSGroupsPage;