import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { apiService } from '../../services/api';
import { useSelector } from 'react-redux';

const getDefaultDateRange = () => {

    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - 6);

  return {
    start: pastDate,
    end: today,
  };
};

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters, onResetFilters, onCompanySelected }) => {
  const theme = useTheme();
  
  const [localFilters, setLocalFilters] = useState(() => {
    const defaultRange = getDefaultDateRange();
    const start = filters?.dateRange?.start ? new Date(filters.dateRange.start) : defaultRange.start;
    const end = filters?.dateRange?.end ? new Date(filters.dateRange.end) : defaultRange.end;

    return {
      company: filters?.company || { id: null, company_name: '' },
      category: filters?.category || { id: null, category_name: '' },
      dateRange: { start, end },
    };
  });

  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);

  const { viewMode } = useSelector(state => state.userData);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [companyInputValue, setCompanyInputValue] = useState('');

  console.log('Initial filters in modal:', localFilters);

  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    const start = filters?.dateRange?.start ? new Date(filters.dateRange.start) : defaultRange.start;
    const end = filters?.dateRange?.end ? new Date(filters.dateRange.end) : defaultRange.end;
    


    setLocalFilters({
      company: filters?.company || { id: null, company_name: '' },
      category: filters?.category || { id: null, category_name: '' },
      dateRange: { start, end },
    });
    
    setCategoryInputValue(filters?.category?.category_name || '');
    setCompanyInputValue(filters?.company?.company_name || '');
  }, [filters]);

  useEffect(() => {
    fetchCompanySuggestions("")
    fetchCategorySuggestions("")
    fetchCompanySuggestions("")
  },[])

  const fetchCompanySuggestions = async (term) => {
    setCompanyLoading(true);
    try {
      const res = await apiService.get(`/accounts/ghl-auth/?search=${term}`);
      const allLocations = res.results || [];
  
      // Deduplicate by company_id
      const uniqueCompaniesMap = new Map();
  
      for (const location of allLocations) {
        // This will override previous entries and keep the latest one for each company_id
        if (location.company_id) {
          uniqueCompaniesMap.set(location.company_id, location);
        }
      }
  
      // Convert back to array
      const uniqueCompanySuggestions = Array.from(uniqueCompaniesMap.values());
  
      setCompanySuggestions(uniqueCompanySuggestions);
    } catch (err) {
      console.error('Failed to fetch company suggestions', err);
      setCompanySuggestions([]);
    } finally {
      setCompanyLoading(false);
    }
  };

  const fetchCategorySuggestions = async (term) => {
    // if (!term || term.length < 2) return;
    
    setCategoryLoading(true);
    try {
      const res = await apiService.get(`/category/categories?search=${term}&is_active=true`);
      setCategorySuggestions(res.results || []);
    } catch (err) {
      console.error('Failed to fetch category suggestions', err);
      setCategorySuggestions([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCompanyChange = (event, newValue) => {
    setLocalFilters(prev => ({
      ...prev,
      company: newValue ? {
        id: newValue.company_id,
        company_name: newValue.company_name
      } : { id: null, company_name: '' }
    }));
    if (viewMode === 'account' && onCompanySelected && newValue) {
      onCompanySelected(newValue.company_id);
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setLocalFilters(prev => ({
      ...prev,
      category: newValue ? {
        id: newValue.id,
        category_name: newValue.category_name
      } : { id: null, category_name: '' }
    }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    console.log(formatDate(localFilters.dateRange.start), 'formatted start date');
    console.log(formatDate(localFilters.dateRange.end), 'formatted end date');
    const formattedFilters = {
      ...localFilters,
      dateRange: {
        start: formatDate(localFilters.dateRange.start),
        end: formatDate(localFilters.dateRange.end),
      },
    };
    onApplyFilters(formattedFilters);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
      company: { id: null, company_name: '' },
      category: { id: null, category_name: '' },
      dateRange: { start: null, end: null },
    };
    setLocalFilters(resetData);
    setCategoryInputValue('');
    setCompanyInputValue('');
    setCategorySuggestions([]);
    setCompanySuggestions([]);
    onResetFilters();
  };

  const hasActiveFilters = () => {
    return (
      localFilters.company.id ||
      localFilters.category.id ||
      localFilters.dateRange.start ||
      localFilters.dateRange.end
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[24],
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            m: 0,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterIcon />
            <Typography variant="h6" fontWeight={600}>
              Filter Data
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Company Filter */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <BusinessIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Company
                </Typography>
              </Stack>
              <Autocomplete
                options={companySuggestions}
                getOptionLabel={(option) => option.company_name || ''}
                value={localFilters.company.id ? localFilters.company : null}
                onChange={handleCompanyChange}
                inputValue={companyInputValue}
                onInputChange={(event, newInputValue) => {
                  setCompanyInputValue(newInputValue);
                  fetchCompanySuggestions(newInputValue);
                }}
                loading={companyLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search and select a company..."
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {companyLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ py: 1 }}>
                    <Stack>
                      <Typography variant="body2" fontWeight={500}>
                        {option.company_name}
                      </Typography>
                      {option.company_id && (
                        <Typography variant="caption" color="text.secondary">
                          ID: {option.company_id}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}
                noOptionsText="No companies found"
              />
            </Paper>

            {/* Category Filter */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.secondary.main, 0.02),
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <CategoryIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Category
                </Typography>
              </Stack>
              <Autocomplete
                options={categorySuggestions}
                getOptionLabel={(option) => option.category_name || ''}
                value={localFilters.category.id ? localFilters.category : null}
                onChange={handleCategoryChange}
                inputValue={categoryInputValue}
                onInputChange={(event, newInputValue) => {
                  setCategoryInputValue(newInputValue);
                  fetchCategorySuggestions(newInputValue);
                }}
                loading={categoryLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search and select a category..."
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {categoryLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ py: 1 }}>
                    <Stack>
                      <Typography variant="body2" fontWeight={500}>
                        {option.category_name}
                      </Typography>
                      {option.id && (
                        <Typography variant="caption" color="text.secondary">
                          ID: {option.id}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}
                noOptionsText="No categories found"
              />
            </Paper>

            {/* Date Range Filter */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.info.main, 0.02),
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <CalendarIcon color="info" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Date Range
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    value={localFilters.dateRange.start}
                    onChange={(value) => handleDateRangeChange('start', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                    maxDate={localFilters.dateRange.end || new Date()}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    value={localFilters.dateRange.end}
                    onChange={(value) => handleDateRangeChange('end', value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                    minDate={localFilters.dateRange.start}
                    maxDate={new Date()}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Active Filters Summary */}
            {hasActiveFilters() && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: `1px solid ${theme.palette.success.main}`,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                }}
              >
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Active Filters
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {localFilters.company.id && (
                    <Chip
                      label={`Company: ${localFilters.company.company_name}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {localFilters.category.id && (
                    <Chip
                      label={`Category: ${localFilters.category.category_name}`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {localFilters.dateRange.start && (
                    <Chip
                      label={`From: ${localFilters.dateRange.start.toLocaleDateString()}`}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {localFilters.dateRange.end && (
                    <Chip
                      label={`To: ${localFilters.dateRange.end.toLocaleDateString()}`}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ minWidth: 120 }}
          >
            Reset Filters
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            sx={{ minWidth: 120 }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default FilterModal;