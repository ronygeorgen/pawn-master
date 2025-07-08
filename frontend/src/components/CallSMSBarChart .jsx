"use client"

import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar, Phone, MessageSquare, Filter, RefreshCw, AlertTriangle, TrendingUp, Users, Clock, ChevronDown } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCompanyAccounts, fetchData, resetCompanyAccounts, setcallsmsFilters } from "../store/slices/callsmschartslice"

const CallSMSBarChart = ({ viewMode, global_filters }) => {
  console.log(viewMode, 'viewMode');
  
  const dispatch = useDispatch()
  const { data, filters, loading, error, companyAccounts } = useSelector((state) => state.callsms)
  const [showFilters, setShowFilters] = useState(false)

  const today = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(today.getFullYear() - 1)

  const formatDate = (date) => date.toISOString().split("T")[0]

  const [localFilters, setLocalFilters] = useState({
    date_range: {
      start: global_filters?.dateRange?.start || formatDate(oneYearAgo),
      end: global_filters?.dateRange?.end || formatDate(today),
    },
    company_ids: filters?.company_ids || [],
    location_ids: filters?.location_ids || [],
    graph_type: filters?.graph_type || "monthly",
    data_type: filters?.data_type || "both",
  })

  useEffect(() => {
    const updatedFilters = {
        ...localFilters,
        view_type: viewMode,
        company_ids: viewMode === "company" ? localFilters.company_ids : [],
        location_ids: viewMode === "account" ? localFilters.location_ids : [],
    };
    dispatch(setcallsmsFilters(updatedFilters))
    dispatch(resetCompanyAccounts());
    dispatch(fetchData(updatedFilters))
    if (viewMode === "company" || viewMode === "account") {
        dispatch(fetchCompanyAccounts(viewMode))
    }
  }, [dispatch, viewMode])

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const chartData = useMemo(() => {
  if (!data?.data || !Array.isArray(data.data)) return []

  const groupedData = {}

  data.data.forEach((item) => {
    const date = new Date(item.period_date)
    if (isNaN(date.getTime())) return

    let label = ""
    if (filters.graph_type === "daily") {
      label = date.toLocaleDateString("en-IN")
    } else if (filters.graph_type === "weekly") {
      const weekNumber = Math.ceil(date.getDate() / 7)
      label = `Week ${weekNumber} - ${date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`
    } else {
      label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    }

    if (!groupedData[label]) {
      groupedData[label] = {
        label,
        total_calls: 0,
        inbound_calls: 0,
        outbound_calls: 0,
        total_duration: 0,
        total_usage: 0,
        total_sms: 0,
        inbound_messages: 0,
        outbound_messages: 0,
        total_segments: 0,
      }
    }

    const group = groupedData[label]

    if (filters.data_type === "call" || filters.data_type === "both") {
      group.total_calls += item.call_data?.total_calls || 0
      group.inbound_calls += item.call_data?.inbound_calls || 0
      group.outbound_calls += item.call_data?.outbound_calls || 0
      group.total_duration += item.call_data?.total_duration || 0
      group.total_usage += item.call_data?.total_usage || 0
    }

    if (filters.data_type === "sms" || filters.data_type === "both") {
      group.total_sms += item.sms_data?.total_messages || 0
      group.inbound_messages += item.sms_data?.inbound_messages || 0
      group.outbound_messages += item.sms_data?.outbound_messages || 0
      group.total_segments += item.sms_data?.total_segments || 0
    }
  })

  return Object.values(groupedData)
}, [data?.data, filters])

  const colors = {
    total_calls: "#10b981",
    total_sms: "#3b82f6",
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
        <div className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
          {label}
        </div>

        <div className="space-y-3">
          {(filters.data_type === 'call' || filters.data_type === 'both') && (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Call Data</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Total: <span className="font-medium text-gray-900">{data.total_calls ?? 0}</span></div>
                <div className="text-gray-600">Inbound: <span className="font-medium text-gray-900">{data.inbound_calls ?? 0}</span></div>
                <div className="text-gray-600">Outbound: <span className="font-medium text-gray-900">{data.outbound_calls ?? 0}</span></div>
                <div className="text-gray-600">Duration: <span className="font-medium text-gray-900">{data.total_duration ?? 0}s</span></div>
              </div>
            </div>
          )}

          {(filters.data_type === 'sms' || filters.data_type === 'both') && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">SMS Data</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Total: <span className="font-medium text-gray-900">{data.total_sms ?? 0}</span></div>
                <div className="text-gray-600">Inbound: <span className="font-medium text-gray-900">{data.inbound_messages ?? 0}</span></div>
                <div className="text-gray-600">Outbound: <span className="font-medium text-gray-900">{data.outbound_messages ?? 0}</span></div>
                <div className="text-gray-600">Segments: <span className="font-medium text-gray-900">{data.total_segments ?? 0}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleApplyFilters = () => {
    if (new Date(localFilters.date_range.start) > new Date(localFilters.date_range.end)) {
      alert("Start date cannot be after end date")
      return
    }
    const filtersToApply = {
        date_range: localFilters.date_range,
        graph_type: localFilters.graph_type,
        data_type: localFilters.data_type,
        view_type: viewMode,
        ...(viewMode === "company"
        ? { company_ids: localFilters.company_ids }
        : { location_ids: localFilters.location_ids }),
    }
    dispatch(setcallsmsFilters(filtersToApply))
    dispatch(fetchData(filtersToApply))
  }

  // const handleResetFilters = () => {
  //   const defaultFilters = {
  //     date_range: {
  //       start: formatDate(threeYearsAgo),
  //       end: formatDate(today),
  //     },
  //     location_ids: [],
  //     graph_type: "monthly",
  //     data_type: "both",
  //     view_type: viewMode,
  //   ...(viewMode === "company" ? { company_ids: [] } : { location_ids: [] }),
  //   }
  //   setLocalFilters(defaultFilters)
  //   dispatch(setcallsmsFilters(defaultFilters))
  //   dispatch(fetchData(localFilters))
  // }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
            <p className="text-red-700 text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => dispatch(fetchData(localFilters))}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                {filters.data_type === "call" ? (
                  <Phone className="w-5 h-5 text-green-600" />
                ) : filters.data_type === "sms" ? (
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {filters.data_type === "both" ? "Call & SMS Analytics" : `${filters.data_type?.toUpperCase()} Analytics`}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {data?.date_range?.start && data?.date_range?.end ? (
                    <>
                      {new Date(data.date_range.start).toLocaleDateString('en-GB')} to {new Date(data.date_range.end).toLocaleDateString('en-GB')}
                    </>
                  ) : (
                    "Interactive chart showing your data over time"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {filters.graph_type && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                  {filters.graph_type} View
                </span>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Filters Section */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-wrap gap-6 items-start">
                {/* Time Period */}
                <div className="min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                  <select
                    value={localFilters.graph_type}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, graph_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily View</option>
                    <option value="weekly">Weekly View</option>
                    <option value="monthly">Monthly View</option>
                  </select>
                </div>

                {/* Data Type */}
                <div className="min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                  <select
                    value={localFilters.data_type}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, data_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="call">Call Data Only</option>
                    <option value="sms">SMS Data Only</option>
                    <option value="both">Both Call & SMS</option>
                  </select>
                </div>

                {/* Company/Account Selection */}
                <div className="min-w-[240px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {viewMode === "company" ? "Select Companies" : "Select Accounts"}
                  </label>
                  <select
                    multiple
                    value={
                      viewMode === "company"
                        ? localFilters.company_ids || []
                        : localFilters.location_ids || []
                    }
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                      setLocalFilters((prev) =>
                        viewMode === "company"
                          ? { ...prev, company_ids: selected, location_ids: [] }
                          : { ...prev, location_ids: selected, company_ids: [] }
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {companyAccounts.map((item) => (
                      <option
                        key={viewMode === "company" ? item.company_id : item.location_id}
                        value={viewMode === "company" ? item.company_id : item.location_id}
                      >
                        {viewMode === "company" ? item.company_name : item.location_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>
              {/* Apply Button */}
              <div className="min-w-[150px] ">
                <button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Applying...
                    </div>
                  ) : (
                    "Apply Filters"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Chart Content */}
        <div className="p-6">
          {loading ? (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading chart data...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your analytics</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No data available</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or date range</p>
              </div>
            </div>
          ) : (
            <div className="h-96 overflow-x-auto">
              <div style={{ width: `${Math.max(chartData.length * 80, 800)}px`, height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      stroke="#9ca3af"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }} 
                      stroke="#9ca3af" 
                      tickFormatter={(value) => value.toLocaleString()} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {(filters.data_type === "call" || filters.data_type === "both") && (
                      <Bar 
                        dataKey="total_calls" 
                        fill={colors.total_calls} 
                        name="Total Calls" 
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                    {(filters.data_type === "sms" || filters.data_type === "both") && (
                      <Bar 
                        dataKey="total_sms" 
                        fill={colors.total_sms} 
                        name="Total SMS" 
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CallSMSBarChart