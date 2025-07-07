"use client"

import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar, Phone, MessageSquare, Filter, RefreshCw, AlertTriangle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCompanyAccounts, fetchData, resetCompanyAccounts, setFilters } from "../store/slices/callsmschartslice"

const CallSMSBarChart = ({viewMode}) => {
    console.log(viewMode, 'viewMode');
    
  const dispatch = useDispatch()
  const { data, filters, loading, error, companyAccounts  } = useSelector((state) => state.callsms)

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
        dispatch(fetchCompanyAccounts(viewMode)) // Uses ?type=company or ?type=account
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

          //SMS
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
    total_calls: "#2563eb",
    total_sms: "#dc2626",
  }

  const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full min-w-[300px]">
      <p className="font-bold text-gray-800 mb-2">{label}</p>

      <div className="flex gap-6 justify-between text-sm text-gray-700">
        {(appliedFilters.data_type === 'call' || appliedFilters.data_type === 'both') && (
          <div className="space-y-1 w-1/2">
            <p className="font-semibold text-blue-600">Call Data</p>
            <p>Total Calls: {data.total_calls ?? 0}</p>
            <p>Inbound: {data.inbound_calls ?? 0}</p>
            <p>Outbound: {data.outbound_calls ?? 0}</p>
            <p>Duration: {data.total_duration ?? 0}s</p>
            <p>Usage: {data.total_usage ?? 0}</p>
          </div>
        )}

        {(appliedFilters.data_type === 'sms' || appliedFilters.data_type === 'both') && (
          <div className="space-y-1 w-1/2">
            <p className="font-semibold text-red-600">SMS Data</p>
            <p>Total SMS: {data.total_sms ?? 0}</p>
            <p>Inbound: {data.inbound_messages ?? 0}</p>
            <p>Outbound: {data.outbound_messages ?? 0}</p>
            <p>Segments: {data.total_segments ?? 0}</p>
          </div>
        )}
      </div>
    </div>
  );
};


  const handleApplyFilters = () => {
    // Validation
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
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-red-800 font-medium">Error loading data</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {data?.data_type === "call" ? (
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                ) : data?.data_type === "sms" ? (
                  <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
                ) : (
                  <Filter className="w-5 h-5 mr-2 text-gray-600" />
                )}
                {data?.data_type === "both" ? "Call & SMS" : data?.data_type?.toUpperCase()} Analytics
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {data?.date_range?.start && data?.date_range?.end ? (
                  <>
                    Data from {data.date_range.start} to {data.date_range.end}
                  </>
                ) : (
                  "Analytics Dashboard"
                )}
                {data?.graph_type && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm capitalize">
                    {data?.graph_type} View
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => dispatch(fetchData())}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Date Range */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={localFilters.date_range.start}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    date_range: { ...prev.date_range, start: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={localFilters.date_range.end}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    date_range: { ...prev.date_range, end: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Graph Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Period</label>
              <select
                value={localFilters.graph_type}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, graph_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Data Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Data Type</label>
              <select
                value={localFilters.data_type}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, data_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="call">Call</option>
                <option value="sms">SMS</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Company/Account Selector */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    {viewMode === "company" ? "Companies" : "Accounts"}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
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

                <p className="text-xs text-gray-500">
                    Hold Ctrl/Cmd to select multiple
                </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Applying..." : "Apply Filters"}
            </button>
            <button
              onClick={handleResetFilters}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {data.data_type === "both" ? "Call & SMS" : data.data_type?.toUpperCase()} Trends
          </h3>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Loading chart data...
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p>No data available for the selected filters</p>
              </div>
            </div>
          ) : (
            <div className="h-96 overflow-x-auto">
                <div style={{ width: `${chartData.length * 30}px`, height: "400px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(value) => value.toLocaleString()} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {(appliedFilters.data_type === "call" || appliedFilters.data_type === "both") && (
                            <Bar dataKey="total_calls" fill={colors.total_calls} name="Total Calls" radius={[4, 4, 0, 0]} />
                        )}
                        {(appliedFilters.data_type === "sms" || appliedFilters.data_type === "both") && (
                            <Bar dataKey="total_sms" fill={colors.total_sms} name="Total SMS" radius={[4, 4, 0, 0]} />
                        )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{data?.data?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{data?.location_ids?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Type</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{data?.data_type}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                {appliedFilters.data_type === "call" ? (
                  <Phone className="w-6 h-6 text-purple-600" />
                ) : appliedFilters.data_type === "sms" ? (
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                ) : (
                  <Filter className="w-6 h-6 text-purple-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallSMSBarChart
