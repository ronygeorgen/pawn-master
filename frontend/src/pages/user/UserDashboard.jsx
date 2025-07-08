import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2, 
  MapPin, 
  MessageSquare, 
  DollarSign,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Phone,
  Eye
} from 'lucide-react';
import { clearError, fetchUserData, refreshCall, refreshWallet } from '../../store/slices/userDataSlice';
import LoadingTable from '../../components/common/LoadingTable';
import { toast } from 'react-toastify';
import CallSMSBarChart from '../../components/CallSMSBarChart ';


const UserDashboard = () => {
  const dispatch = useDispatch();
  const { data, filters, viewMode, loading, error, success, refreshCallSuccess } = useSelector(
    state => state.userData
  );
  
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedType, setExpandedType] = useState({});
  const [refreshingWallet, setRefreshingWallet] = useState(null);
  const [refreshingCall, setRefreshingCall] = useState(null);

  useEffect(()=>{
    if (success){
      toast.success('Wallet refreshed!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    }else if(refreshCallSuccess){
      toast.success('Call refreshed!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    }
    dispatch(clearError())
  }, [success, refreshCallSuccess])

  useEffect(() => {
    dispatch(fetchUserData({ filters, viewMode }));
  }, [dispatch, filters, viewMode]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const toggleRowExpansion = (rowIndex, type) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: prev[rowIndex] === type ? null : type
    }));
  };

  const handleWalletRefresh = async (locationId) => {
    setRefreshingWallet(locationId);
    try {
      await dispatch(refreshWallet(locationId)).unwrap();
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    } finally {
      setRefreshingWallet(null);
    }
  };

  const handleCallRefresh = async (query_name, id) => {
    setRefreshingCall({query_name, id});
    try {
      await dispatch(refreshCall({query_name, id})).unwrap();
    } catch (error) {
      console.error('Error refreshing call:', error);
    } finally {
      setRefreshingCall(null);
    }
  };
  

  const formatMinutesToHours=(totalMinutes)=> {
    if (!totalMinutes || isNaN(totalMinutes)) return "0 hrs 0 mins";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  }


  const renderSMSDetails = (item) => (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3">SMS Data Details</h4>
      <div className="flex justify-between text-sm">
        <div className='flex flex-col gap-2'>
          <div>
            <span className="text-gray-600">Inbound Segments:</span>
            <div className="font-medium">{item.sms_data?.total_inbound_segments || 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Outbound Segments:</span>
            <div className="font-medium">{item.sms_data?.total_outbound_segments || 0}</div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div>
            <span className="text-gray-600">Messages In:</span>
            <div className="font-medium">{item.sms_data?.total_inbound_messages || 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Messages Out:</span>
            <div className="font-medium">{item.sms_data?.total_outbound_messages || 0}</div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div>
            <span className="text-gray-600">Inbound Usage:</span>
            <div className="font-medium">{formatCurrency(item.sms_data?.sms_inbound_usage || 0)}</div>
          </div>
          <div>
            <span className="text-gray-600">Outbound Usage:</span>
            <div className="font-medium">{formatCurrency(item.sms_data?.sms_outbound_usage || 0)}</div>
          </div>
        </div>
        {viewMode === 'account' && (
          <>
            <div className='flex flex-col gap-2'>
              <div>
                <span className="text-gray-600">Inbound Rate:</span>
                <div className="font-medium">{formatCurrency(item.sms_data?.sms_inbound_rate || 0)}</div>
              </div>
              <div>
                <span className="text-gray-600">Outbound Rate:</span>
                <div className="font-medium">{formatCurrency(item.sms_data?.sms_outbound_rate || 0)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderCallDetails = (item) => (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-medium text-green-900 mb-3">Call Data Details</h4>
      <div className="flex justify-between text-sm">
        <div className='flex flex-col gap-2'>
          <div>
            <span className="text-gray-600">Inbound Calls:</span>
            <div className="font-medium">{item.call_data?.total_inbound_calls || 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Outbound Calls:</span>
            <div className="font-medium">{item.call_data?.total_outbound_calls || 0}</div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div>
            <span className="text-gray-600">Inbound Duration:</span>
            <div className="font-medium">{formatMinutesToHours(item.call_data?.total_inbound_call_minutes || 0)}</div>
          </div>
          <div>
            <span className="text-gray-600">Outbound Duration:</span>
            <div className="font-medium">{formatMinutesToHours(item.call_data?.total_outbound_call_minutes || 0)}</div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div>
            <span className="text-gray-600">Inbound Usage:</span>
            <div className="font-medium">{formatCurrency(item.call_data?.call_inbound_usage || 0)}</div>
          </div>
          <div>
            <span className="text-gray-600">Outbound Usage:</span>
            <div className="font-medium">{formatCurrency(item.call_data?.call_outbound_usage || 0)}</div>
          </div>
        </div>
        {viewMode === 'account' && (
          <>
            <div className='flex flex-col gap-2'>
              <div>
                <span className="text-gray-600">Inbound Rate:</span>
                <div className="font-medium">{formatCurrency(item.call_data?.call_inbound_rate || 0)}</div>
              </div>
              <div>
                <span className="text-gray-600">Outbound Rate:</span>
                <div className="font-medium">{formatCurrency(item.call_data?.call_outbound_rate || 0)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderFullDetails = (item) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-3">Complete Data Overview</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSMSDetails(item)}
        {renderCallDetails(item)}
      </div>
    </div>
  );

  console.log(refreshingCall, 'call');
  

  return (
    <div className="space-y-6">
      <CallSMSBarChart viewMode={viewMode}/>
      {/* Data Table Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            SMS and Call Usage Data - {viewMode === 'company' ? 'Company' : 'Account'} View
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode === 'company' 
              ? 'View aggregated SMS usage data by company'
              : 'View detailed SMS usage data by location and company'
            }
          </p>
        </div>
        
        <div className="p-6">
          {loading ? (
            <LoadingTable 
              rows={8} 
              columns={viewMode === 'company' ? 7 : 6} 
            />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Company</th>
                      {viewMode === 'company' && (
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Location count</th>
                      )}
                      {viewMode === 'account' && (
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Location</th>
                      )}
                      <th className="px-4 py-3 text-center font-semibold text-blue-700">
                        <div className="flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          SMS Usage
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-green-700">
                        <div className="flex items-center justify-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Usage
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        <div className="flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Total Usage
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-purple-700">
                        <div className="flex items-center justify-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Wallet
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-3 font-medium text-gray-900">{item?.company_name || 'Nil'}</td>
                          {viewMode === 'company' && (
                            <td className="px-6 py-3 text-gray-700">{item?.combined_totals?.locations_count}</td>
                          )}
                          {viewMode === 'account' && (
                            <td className="px-6 py-3 text-gray-700">{item?.location_name}</td>
                          )}

                          {/* SMS Usage with expand button */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-medium text-blue-600">
                                {formatCurrency(item.sms_data?.total_sms_usage || 
                                  (item.sms_data?.sms_inbound_usage + item.sms_data?.sms_outbound_usage))}
                              </span>
                              <button
                                onClick={() => toggleRowExpansion(idx, 'sms')}
                                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                              >
                                {expandedRows[idx] === 'sms' ? (
                                  <ChevronDown className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-blue-600" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Call Usage with expand button */}
                          <td className="px-4 py-3 text-center align-middle">
                            <div className="flex items-center justify-center gap-2 h-6">
                              <div className="text-green-600 font-medium leading-none min-w-[60px] text-right">
                                {formatCurrency(
                                  item.call_data?.total_call_usage ??
                                  (item.call_data?.call_inbound_usage + item.call_data?.call_outbound_usage)
                                )}
                              </div>
                              <button
                                onClick={() => toggleRowExpansion(idx, 'call')}
                                className="w-6 h-6 flex items-center justify-center p-1 rounded-full hover:bg-green-100 transition-colors"
                              >
                                {expandedRows[idx] === 'call' ? (
                                  <ChevronDown className="w-4 h-4 text-green-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-green-600" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  viewMode === 'company'
                                    ? handleCallRefresh('company_id', item?.company_id)
                                    : handleCallRefresh('location_id', item?.location_id)
                                }
                                className="w-6 h-6 flex items-center justify-center p-1 rounded-full hover:bg-purple-100 transition-colors"
                              >
                                <RefreshCw className={`w-4 h-4 text-purple-600 ${
                                  refreshingCall &&
                                  item[refreshingCall.query_name] === refreshingCall.id
                                    ? 'animate-spin'
                                    : ''
                                }`} />
                              </button>
                            </div>
                          </td>

                          {/* Total Usage with expand button */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-medium text-gray-800">
                                {formatCurrency(item.combined_totals?.total_usage)}
                              </span>
                              <button
                                onClick={() => toggleRowExpansion(idx, 'full')}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {expandedRows[idx] === 'full' ? (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Wallet with refresh button */}
                          <td className="px-4 py-3 text-center align-middle">
                            <div className="flex items-center justify-center gap-2 h-6">
                              <div className="text-purple-600 font-medium leading-none min-w-[60px] text-right">
                                {formatCurrency(
                                  viewMode === 'account'
                                    ? item.combined_totals?.wallet_balance
                                    : item.combined_totals?.total_wallet_balance || 0
                                )}
                              </div>
                              {viewMode === 'account' && (
                                <button
                                  onClick={() => handleWalletRefresh(item?.location_id)}
                                  className="w-6 h-6 flex items-center justify-center p-1 rounded-full hover:bg-purple-100 transition-colors"
                                >
                                  <RefreshCw
                                    className={`w-4 h-4 text-purple-600 ${
                                      refreshingWallet === item.location_id ? 'animate-spin' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expandable content for both views */}
                        {expandedRows[idx] && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              {expandedRows[idx] === 'sms' && renderSMSDetails(item)}
                              {expandedRows[idx] === 'call' && renderCallDetails(item)}
                              {expandedRows[idx] === 'full' && renderFullDetails(item)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;