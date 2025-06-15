import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, MapPin, DollarSign, Edit2, Plus } from 'lucide-react';
import { fetchSMSGroup, fetchSMSGroups, updateSMSGroup } from '../../store/slices/smsGroupsSlice';
import Button from '../../components/common/Button';
import Shimmer from '../../components/common/Shimmer';
import { useSMSGroups } from '../../hooks/useSMSGroups';
import { useSearchParams } from 'react-router-dom';
import EditSMSGroupModal from '../../components/admin/EditSMSGroupModal';

const SMSGroupsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSMSGroup, setSelectedSMSGroup] = useState(null)
  
  const dispatch = useDispatch();
  const { smsGroups, selectedsmsGroup, loading, selectsmsGroup, success } = useSMSGroups();  

  // const {smsGroups, selectedsmsGroup, loading, selectsmsGroup} = useSelector(state=>state.smsGroups)

  const [searchParams] = useSearchParams();
  const location_id = searchParams.get('location_id');

  console.log(location_id, 'location_id from params', smsGroups);

  useEffect(()=>{
    if (location_id){
      dispatch(fetchSMSGroup(location_id));
    }
  },[])

  console.log(success, 'ls');
  

  useEffect(()=>{
    if(success){
      handleEditClick(selectedsmsGroup);
    }
  })

  // useEffect(() => {
  //   dispatch(fetchSMSGroups());
  // }, [dispatch]);

  const handleStatusToggle = async (location_id, is_approved) => {
    console.log(location_id, is_approved);
    
      try {
        dispatch(updateSMSGroup({location_id, data:{'is_approved': !is_approved}} ));
      } catch (error) {
        console.error('Failed to update SMS group status:', error);
      }
  };

  const handleOnboard = ()=>{
    window.location.href = "http://56.228.36.160/api/core/auth/connect/";
  }

  const handleEditClick = (smsGroup) => {
    setSelectedSMSGroup(smsGroup)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedSMSGroup(null)
  }

  const handleSaveChanges = async (updateData) => {
    try {
      dispatch(updateSMSGroup(updateData))
      setIsModalOpen(false)
      setSelectedSMSGroup(null)
      // Optionally refresh the data
      if (location_id) {
        dispatch(fetchSMSGroup(location_id))
      }
    } catch (error) {
      console.error("Failed to update SMS group:", error)
    }
  }

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
    <div className="">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-row justify-between">
          <div className=''>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              SMS Groups
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your onboarded locations and their SMS settings
            </p>
          </div>
          <Button className='gap-0.5' onClick={handleOnboard}>
            <Plus />
            Add Onboard Location
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {smsGroups?.map((smsGroup) => (
              <div key={smsGroup?.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    {smsGroup?.location_name}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    smsGroup?.is_approved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {smsGroup?.is_approved ? 'active' : 'inactive'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {smsGroup?.address}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {smsGroup?.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Inbound Rate</p>
                    <p className="text-sm font-semibold text-green-600 flex items-center">
                      <DollarSign className="w-3 h-3" />
                      {smsGroup?.inbound_rate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Outbound Rate</p>
                    <p className="text-sm font-semibold text-blue-600 flex items-center">
                      <DollarSign className="w-3 h-3" />
                      {smsGroup?.outbound_rate}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleStatusToggle(smsGroup?.location_id, smsGroup?.is_approved)}
                    variant={smsGroup?.is_approved ? 'danger' : 'success'}
                    size="sm"
                    className="flex-1"
                  >
                    {smsGroup?.is_approved ? 'Deactivate' : 'Activate'}
                  </Button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => handleEditClick(smsGroup)}> 
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EditSMSGroupModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        smsGroup={selectedSMSGroup}
        onSave={handleSaveChanges}
        loading={loading}
      />
    </div>
  );
};

export default SMSGroupsPage;