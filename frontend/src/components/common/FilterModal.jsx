import React, { useState, useEffect, useRef } from 'react';
import { X, Filter } from 'lucide-react';
import Button from './Button';
import { apiService } from '../../services/api';

const getDefaultDateRange = () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 1);

    const format = (date) => date.toISOString().split("T")[0];

    return {
      start: format(pastDate),
      end: format(today),
    };
  };

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(() => {
    const start = filters?.dateRange?.start || getDefaultDateRange().start;
    const end = filters?.dateRange?.end || getDefaultDateRange().end;

    return {
      company: filters?.company || { id: null, company_name: '' },
      category: filters?.category || { id: null, category_name: '' },
      dateRange: { start, end },
    };
  });

  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const suggestionsRef = useRef();


  useEffect(() => {
    const start = filters?.dateRange?.start || getDefaultDateRange().start;
    const end = filters?.dateRange?.end || getDefaultDateRange().end;

    setLocalFilters({
      company: filters?.company || { id: null, company_name: '' },
      category: filters?.category || { id: null, category_name: '' },
      dateRange: { start, end },
    });
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (field, value) => {
  if (field === 'category') {
    // Reset category id until selected
    setLocalFilters(prev => ({
      ...prev,
      category: {...prev.category, id:null, category_name:value},  // reset category ID
    }));

    if (value.length > 1) {
      fetchCategorySuggestions(value);
      setShowSuggestions(true);
    } else {
      setCategorySuggestions([]);
      setShowSuggestions(false);
    }
  }else if (field === 'company') {
    setLocalFilters(prev => ({
      ...prev,
      company: { id: null, company_name: value },
    }));

    if (value.length > 0) {
      fetchCompanySuggestions(value);
      setShowCompanySuggestions(true);
    } else {
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
    }
  } else {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }
};

const fetchCompanySuggestions = async (term) => {
  try {
    const res = await apiService.get(`/accounts/ghl-auth/?search=${term}`);
    setCompanySuggestions(res.results || []);
  } catch (err) {
    console.error('Failed to fetch company suggestions', err);
  }
};

const handleCompanySuggestionClick = (company) => {
  console.log(company?.company_id, 'ffee');
  
  setLocalFilters(prev => ({
    ...prev,
    company: {
      id: company.company_id,
      company_name: company.company_name
    },
  }));
  setShowCompanySuggestions(false);
};


  const fetchCategorySuggestions = async (term) => {
    try {
      const res = await apiService.get(`/category/categories?search=${term}&is_active=true`);
      setCategorySuggestions(res.results || []);
    } catch (err) {
      console.error('Failed to fetch suggestions', err);
    }
  };

  const handleSuggestionClick = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      category: {id:category?.id, category_name:category?.category_name},  // only ID in filter
    }));
    setShowSuggestions(false);
  };


  const handleDateRangeChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
    company: { id: null, company_name: '' },
    category: { id: null, category_name: '' },
    dateRange: { start: '', end: '' },
  };
    setLocalFilters(resetData);
    setCategorySuggestions([]);
    setShowSuggestions(false);
    onResetFilters();
  };

  if (!isOpen) return null;

  console.log(localFilters, 'filtersss');
  console.log(companySuggestions, 'suggestions company');
  
  

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-3 sm:mt-0 sm:text-left w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filter Data
            </h3>

            <div className="space-y-4">
              <div className="relative" ref={suggestionsRef}>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  value={localFilters?.company?.company_name || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Search companies..."
                  onFocus={() => {
                    if (
                      localFilters?.company?.company_name?.length > 1 &&
                      companySuggestions.length > 0
                    ) {
                      setShowCompanySuggestions(true);
                    }
                  }}
                />
                {showCompanySuggestions && (
                  <ul className="absolute z-50 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-md">
                    {companySuggestions.length === 0 ? (
                      <li className="px-4 py-2 text-gray-500">No companies found</li>
                    ) : (
                      companySuggestions?.map((c, index) => (
                        <li
                          key={index}
                          onClick={() => handleCompanySuggestionClick(c)}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {c.company_name}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              <div className="relative" ref={suggestionsRef}>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={localFilters?.category?.category_name}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Search categories..."
                  onFocus={() => {
                    if (localFilters?.category?.category_name?.length > 1 && categorySuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                {showSuggestions && (
                  <ul className="absolute z-50 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-md">
                    {categorySuggestions.length === 0 ? (
                      <li className="px-4 py-2 text-gray-500">No categories found</li>
                    ) : (
                      categorySuggestions.map((cat, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(cat)}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {cat.category_name}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Start Date</label>
                  <input
                    type="date"
                    value={localFilters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">End Date</label>
                  <input
                    type="date"
                    value={localFilters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleApply}>Apply Filters</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
