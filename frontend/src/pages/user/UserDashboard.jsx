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
import { fetchUserData } from '../../store/slices/userDataSlice';
import LoadingTable from '../../components/common/LoadingTable';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { data, filters, viewMode, loading, error } = useSelector(
    state => state.userData
  );
  
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedType, setExpandedType] = useState({});

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

  const handleWalletRefresh = () => {
    // Add wallet refresh logic here
    console.log('Refreshing wallet data...');
  };

  const renderSMSDetails = (item) => (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3">SMS Data Details</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className='flex flex-col gap-2'>
          <span className="text-gray-600">Inbound Segments:</span>
          <div className="font-medium">{item.sms_data?.total_inbound_segments || 0}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className="text-gray-600">Outbound Segments:</span>
          <div className="font-medium">{item.sms_data?.total_outbound_segments || 0}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className="text-gray-600">Messages In:</span>
          <div className="font-medium">{item.sms_data?.total_inbound_messages || 0}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className="text-gray-600">Messages Out:</span>
          <div className="font-medium">{item.sms_data?.total_outbound_messages || 0}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className="text-gray-600">Inbound Usage:</span>
          <div className="font-medium">{formatCurrency(item.sms_data?.sms_inbound_usage || 0)}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className="text-gray-600">Outbound Usage:</span>
          <div className="font-medium">{formatCurrency(item.sms_data?.sms_outbound_usage || 0)}</div>
        </div>
        {viewMode === 'account' && (
          <>
            <div className='flex flex-col gap-2'>
              <span className="text-gray-600">Inbound Rate:</span>
              <div className="font-medium">{formatCurrency(item.sms_data?.sms_inbound_rate || 0)}</div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className="text-gray-600">Outbound Rate:</span>
              <div className="font-medium">{formatCurrency(item.sms_data?.sms_outbound_rate || 0)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderCallDetails = (item) => (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-medium text-green-900 mb-3">Call Data Details</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Inbound Calls:</span>
          <div className="font-medium">{item.call_data?.total_inbound_calls || 0}</div>
        </div>
        <div>
          <span className="text-gray-600">Outbound Calls:</span>
          <div className="font-medium">{item.call_data?.total_outbound_calls || 0}</div>
        </div>
        <div>
          <span className="text-gray-600">Inbound Minutes:</span>
          <div className="font-medium">{item.call_data?.total_inbound_call_minutes || 0}</div>
        </div>
        <div>
          <span className="text-gray-600">Outbound Minutes:</span>
          <div className="font-medium">{item.call_data?.total_outbound_call_minutes || 0}</div>
        </div>
        <div>
          <span className="text-gray-600">Inbound Usage:</span>
          <div className="font-medium">{formatCurrency(item.call_data?.call_inbound_usage || 0)}</div>
        </div>
        <div>
          <span className="text-gray-600">Outbound Usage:</span>
          <div className="font-medium">{formatCurrency(item.call_data?.call_outbound_usage || 0)}</div>
        </div>
        {viewMode === 'account' && (
          <>
            <div>
              <span className="text-gray-600">Inbound Rate:</span>
              <div className="font-medium">{formatCurrency(item.call_data?.call_inbound_rate || 0)}</div>
            </div>
            <div>
              <span className="text-gray-600">Outbound Rate:</span>
              <div className="font-medium">{formatCurrency(item.call_data?.call_outbound_rate || 0)}</div>
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

  return (
    <div className="space-y-6">
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
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-medium text-green-600">
                                {formatCurrency(item.call_data?.total_call_usage || 
                                  (item.call_data?.call_inbound_usage + item.call_data?.call_outbound_usage))}
                              </span>
                              <button
                                onClick={() => toggleRowExpansion(idx, 'call')}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                              >
                                {expandedRows[idx] === 'call' ? (
                                  <ChevronDown className="w-4 h-4 text-green-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-green-600" />
                                )}
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
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-medium text-purple-600">
                                {formatCurrency(item.wallet_balance || 0)}
                              </span>
                              <button
                                onClick={handleWalletRefresh}
                                className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                              >
                                <RefreshCw className="w-4 h-4 text-purple-600" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable content for both views */}
                        {expandedRows[idx] && (
                          <tr>
                            <td colSpan={viewMode === 'account' ? 6 : 5} className="px-6 py-4 bg-gray-50">
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