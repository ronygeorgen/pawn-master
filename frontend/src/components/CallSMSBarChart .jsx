"use client"

import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar, Phone, MessageSquare, Filter, RefreshCw, AlertTriangle, TrendingUp, Users, Clock } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCompanyAccounts, fetchData, resetCompanyAccounts, setFilters } from "../store/slices/callsmschartslice"

const CallSMSBarChart = ({ viewMode }) => {
  console.log(viewMode, 'viewMode');
  
  const dispatch = useDispatch()
  const { data, filters, loading, error, companyAccounts } = useSelector((state) => state.callsms)

  const today = new Date()
  const threeYearsAgo = new Date()
  threeYearsAgo.setFullYear(today.getFullYear() - 3)

  const formatDate = (date) => date.toISOString().split("T")[0]

  const [localFilters, setLocalFilters] = useState({
    date_range: {
      start: filters?.date_range?.start || formatDate(threeYearsAgo),
      end: filters?.date_range?.end || formatDate(today),
    },
    company_ids: filters?.company_ids || [],
    location_ids: filters?.location_ids || [],
    graph_type: filters?.graph_type || "monthly",
    data_type: filters?.data_type || "call",
  })

  const [appliedFilters, setAppliedFilters] = useState(localFilters)

  useEffect(() => {
    const updatedFilters = {
        ...localFilters,
        view_type: viewMode,
        company_ids: viewMode === "company" ? localFilters.company_ids : [],
        location_ids: viewMode === "account" ? localFilters.location_ids : [],
    };
    dispatch(setFilters(updatedFilters))
    setAppliedFilters(updatedFilters)
    dispatch(resetCompanyAccounts());
    dispatch(fetchData())
    if (viewMode === "company" || viewMode === "account") {
        dispatch(fetchCompanyAccounts(viewMode))
    }
  }, [dispatch, viewMode])

  const chartData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return []

    return data.data
      .map((item) => {
        const date = new Date(item.period_date)

        if (isNaN(date.getTime())) {
          console.warn("Invalid date:", item.period_date)
          return null
        }

        let label = ""
        if (appliedFilters.graph_type === "daily") {
          label = date.toLocaleDateString("en-IN")
        } else if (appliedFilters.graph_type === "weekly") {
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

        const base = { label }
        if (appliedFilters.data_type === "call") {
          base.total_calls = item.call_data?.total_calls || 0
        } else if (appliedFilters.data_type === "sms") {
          base.total_sms = item.sms_data?.total_messages || 0
          base.inbound_messages = item.sms_data?.inbound_messages || 0
          base.outbound_messages = item.sms_data?.outbound_messages || 0
        } else if (appliedFilters.data_type === "both") {
          base.total_calls = item.call_data?.total_calls || 0
          base.inbound_calls = item.call_data?.inbound_calls || 0
          base.outbound_calls = item.call_data?.outbound_calls || 0
          base.total_duration = item.call_data?.total_duration || 0
          base.total_usage = item.call_data?.total_usage || 0

          base.total_sms = item.sms_data?.total_messages || 0
          base.inbound_messages = item.sms_data?.inbound_messages || 0
          base.outbound_messages = item.sms_data?.outbound_messages || 0
          base.total_segments = item.sms_data?.total_segments || 0
        }

        return base
      })
      .filter(Boolean)
  }, [data?.data, appliedFilters.data_type, appliedFilters.graph_type])

  const colors = {
    total_calls: "#3b82f6",
    total_sms: "#ef4444",
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[300px]">
        <div className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
          {label}
        </div>

        <div className="space-y-3">
          {(appliedFilters.data_type === 'call' || appliedFilters.data_type === 'both') && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Call Data</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Total: <span className="font-medium text-gray-900">{data.total_calls ?? 0}</span></div>
                <div className="text-gray-600">Inbound: <span className="font-medium text-gray-900">{data.inbound_calls ?? 0}</span></div>
                <div className="text-gray-600">Outbound: <span className="font-medium text-gray-900">{data.outbound_calls ?? 0}</span></div>
                <div className="text-gray-600">Duration: <span className="font-medium text-gray-900">{data.total_duration ?? 0}s</span></div>
              </div>
            </div>
          )}

          {(appliedFilters.data_type === 'sms' || appliedFilters.data_type === 'both') && (
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-900">SMS Data</span>
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
    dispatch(setFilters(filtersToApply))
    setAppliedFilters(filtersToApply)
    dispatch(fetchData())
  }

  const handleResetFilters = () => {
    const defaultFilters = {
      date_range: {
        start: formatDate(threeYearsAgo),
        end: formatDate(today),
      },
      location_ids: [],
      graph_type: "monthly",
      data_type: "call",
      view_type: viewMode,
    ...(viewMode === "company" ? { company_ids: [] } : { location_ids: [] }),
    }
    setLocalFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
    dispatch(setFilters(defaultFilters))
    dispatch(fetchData())
  }

  if (error) {
    return (
      <div className="min-h-[400px] bg-gray-50 rounded-xl p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
            <p className="text-red-700 text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => dispatch(fetchData())}
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
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  {data?.data_type === "call" ? (
                    <Phone className="w-6 h-6 text-white" />
                  ) : data?.data_type === "sms" ? (
                    <MessageSquare className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingUp className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {data?.data_type === "both" ? "Call & SMS Analytics" : `${data?.data_type?.toUpperCase()} Analytics`}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {data?.date_range?.start && data?.date_range?.end ? (
                      <>
                        Showing data from {new Date(data.date_range.start).toLocaleDateString()} to {new Date(data.date_range.end).toLocaleDateString()}
                      </>
                    ) : (
                      "Comprehensive analytics dashboard for communication data"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {data?.graph_type && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                    {data?.graph_type} View
                  </span>
                )}
                <button
                  onClick={() => dispatch(fetchData())}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  <span className="font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Filters & Settings</h2>
                <p className="text-sm text-gray-600">Customize your data view with the options below</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Date Range Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Date Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={localFilters.date_range.start}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          date_range: { ...prev.date_range, start: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={localFilters.date_range.end}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          date_range: { ...prev.date_range, end: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Data Settings Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Data Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                    <select
                      value={localFilters.graph_type}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, graph_type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="daily">Daily View</option>
                      <option value="weekly">Weekly View</option>
                      <option value="monthly">Monthly View</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                    <select
                      value={localFilters.data_type}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, data_type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="call">Call Data Only</option>
                      <option value="sms">SMS Data Only</option>
                      <option value="both">Both Call & SMS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selection Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {viewMode === "company" ? "Company Selection" : "Account Selection"}
                </h3>
                <div>
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
                      const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                      setLocalFilters((prev) =>
                        viewMode === "company"
                          ? { ...prev, company_ids: selected, location_ids: [] }
                          : { ...prev, location_ids: selected, company_ids: [] }
                      )
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32"
                  >
                    {companyAccounts.map((item) => (
                      <option
                        key={viewMode === "company" ? item.company_id : item.location_id}
                        value={viewMode === "company" ? item.company_id : item.location_id}
                        className="py-2"
                      >
                        {viewMode === "company" ? item.company_name : item.location_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Hold Ctrl/Cmd to select multiple items
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleApplyFilters}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Applying Filters...
                  </div>
                ) : (
                  "Apply Filters"
                )}
              </button>
              <button
                onClick={handleResetFilters}
                disabled={loading}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Data Points</p>
                <p className="text-3xl font-bold text-gray-900">{data?.data?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Records in selected period</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">View Mode</p>
                <p className="text-3xl font-bold text-gray-900 capitalize">{viewMode}</p>
                <p className="text-xs text-gray-500 mt-1">Current analysis level</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Data Type</p>
                <p className="text-3xl font-bold text-gray-900 capitalize">{data?.data_type || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">Selected data category</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                {appliedFilters.data_type === "call" ? (
                  <Phone className="w-7 h-7 text-white" />
                ) : appliedFilters.data_type === "sms" ? (
                  <MessageSquare className="w-7 h-7 text-white" />
                ) : (
                  <TrendingUp className="w-7 h-7 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {data?.data_type === "both" ? "Call & SMS Trends" : `${data?.data_type?.toUpperCase()} Trends`}
                  </h2>
                  <p className="text-sm text-gray-600">Interactive chart showing your data over time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>
          </div>

          <div className="p-8">
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
                      {(appliedFilters.data_type === "call" || appliedFilters.data_type === "both") && (
                        <Bar 
                          dataKey="total_calls" 
                          fill={colors.total_calls} 
                          name="Total Calls" 
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                      {(appliedFilters.data_type === "sms" || appliedFilters.data_type === "both") && (
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
    </div>
  )
}

export default CallSMSBarChart