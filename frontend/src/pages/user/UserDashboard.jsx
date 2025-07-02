import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2, 
  MapPin, 
  MessageSquare, 
  DollarSign
} from 'lucide-react';
import { fetchUserData } from '../../store/slices/userDataSlice';
import LoadingTable from '../../components/common/LoadingTable';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { data, filters, viewMode, loading, error } = useSelector(
    state => state.userData
  );

  useEffect(() => {
    dispatch(fetchUserData({ filters, viewMode }));
  }, [dispatch, filters, viewMode]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Data Table Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            SMS Usage Data - {viewMode === 'company' ? 'Company' : 'Account'} View
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
              columns={viewMode === 'company' ? 7 : 8} 
            />
          ) : (
            <div className="overflow-x-auto overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th rowSpan={2} className="px-6 py-3 text-left font-semibold text-gray-600">Company</th>
                    {viewMode === 'account' && (
                      <th rowSpan={2} className="px-6 py-3 text-left font-semibold text-gray-600">Location</th>
                    )}
                    <th colSpan={viewMode==='account'?9:6} className="text-center font-semibold text-blue-700 border-l border-gray-300 border-r py-2 border-b">SMS Data</th>
                    <th colSpan={viewMode==='account'? 10:8} className="text-center font-semibold text-green-700 border-r border-gray-300 border-b">Call Data</th>
                    <th colSpan={3} className="text-center font-semibold text-gray-700">Totals</th>
                  </tr>
                  <tr className="text-sm text-gray-500 font-medium">
                    {/* SMS Data */}
                    <th className="px-4 py-2 border-l border-gray-300">Inbound Segments</th>
                    <th className="px-4 py-2">Outbound Segments</th>
                    <th className="px-4 py-2">Messages In</th>
                    <th className="px-4 py-2">Messages Out</th>
                    <th className="px-4 py-2">Inbound Usage</th>
                    <th className={`px-4 py-2 ${viewMode==='company'&&'border-r border-gray-300'}`}>Outbound Usage</th>
                    {viewMode==='account'&&
                      <>
                        <th className="px-4 py-2">Inbound Rate</th>
                        <th className="px-4 py-2 ">Outbound Rate</th>
                        <th className="px-4 py-2 border-r border-gray-300">Total SMS Usage</th>
                      </>
                    }

                    {/* Call Data */}
                    <th className="px-4 py-2">Inbound Calls</th>
                    <th className="px-4 py-2">Outbound Calls</th>
                    <th className="px-4 py-2">Inbound Duration</th>
                    <th className="px-4 py-2">Outbound Duration</th>
                    <th className="px-4 py-2">Inbound Minutes</th>
                    <th className="px-4 py-2">Outbound Minutes</th>
                    <th className="px-4 py-2">Inbound Usage</th>
                    <th className={`px-4 py-2 ${viewMode==='company'&&'border-r border-gray-300'}`}>Outbound Usage</th>
                    {viewMode === 'account' &&
                      <>
                        <th className="px-4 py-2">Inbound Rate</th>
                        <th className="px-4 py-2 border-r border-gray-300">Outbound Rate</th>
                      </>
                    }
                    {/* <th className="px-4 py-2 border-r border-gray-300">Total Call Usage</th> */}

                    {/* Totals */}
                    <th className="px-4 py-2">Inbound Usage</th>
                    <th className="px-4 py-2">Outbound Usage</th>
                    <th className="px-4 py-2">Total Usage</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 font-medium text-gray-900">{item?.company_name || 'Nil'}</td>
                      {viewMode === 'account' && (
                        <td className="px-6 py-3 text-gray-700">{item?.location_name}</td>
                      )}

                      {/* SMS Data */}
                      <td className="px-4 py-3 border-l border-gray-300">{item.sms_data?.total_inbound_segments}</td>
                      <td className="px-4 py-3">{item.sms_data?.total_outbound_segments}</td>
                      <td className="px-4 py-3">{item.sms_data?.total_inbound_messages}</td>
                      <td className="px-4 py-3">{item.sms_data?.total_outbound_messages}</td>
                      <td className="px-4 py-3">{item.sms_data?.sms_inbound_usage}</td>
                      <td className={`px-4 py-2 ${viewMode==='company'&&'border-r border-gray-300'}`}>{item.sms_data?.sms_outbound_usage}</td>
                      {viewMode==='account'&&
                        <>
                          <td className="px-4 py-3">{item.sms_data?.sms_inbound_rate}</td>
                          <td className="px-4 py-3 ">{item.sms_data?.sms_outbound_rate}</td>
                          <td className="px-4 py-3 border-r border-gray-300">{formatCurrency(item.sms_data?.total_sms_usage)}</td>
                        </>
                      }

                      {/* Call Data */}
                      <td className="px-4 py-3">{item.call_data?.total_inbound_calls}</td>
                      <td className="px-4 py-3">{item.call_data?.total_outbound_calls}</td>
                      <td className="px-4 py-3">{item.call_data?.total_inbound_call_duration}</td>
                      <td className="px-4 py-3">{item.call_data?.total_outbound_call_duration}</td>
                      <td className="px-4 py-3">{item.call_data?.total_inbound_call_minutes}</td>
                      <td className="px-4 py-3">{item.call_data?.total_outbound_call_minutes}</td>
                      <td className="px-4 py-3">{item.call_data?.call_inbound_usage}</td>
                      <td className={`px-4 py-3 ${viewMode==='company'&&'border-r border-gray-300'}`}>{item.call_data?.call_outbound_usage}</td>
                      {viewMode === 'account' &&
                        <>
                          <td className="px-4 py-3">{item.call_data?.call_inbound_rate}</td>
                          <td className="px-4 py-3 border-r border-gray-300">{item.call_data?.call_outbound_rate}</td>
                        </>
                      }
                      {/* <td className="px-4 py-3 border-r border-gray-300">{formatCurrency(item.call_data?.call_inbound_usage + item.call_data?.call_outbound_usage)}</td> */}

                      {/* Totals */}
                      <td className="px-4 py-3 font-medium text-green-600">
                        {formatCurrency(item.combined_totals?.total_inbound_usage)}
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">
                        {formatCurrency(item.combined_totals?.total_outbound_usage)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {formatCurrency(item.combined_totals?.total_usage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;