// Type definitions for common data structures used throughout the application

// Location interface
export const LocationType = {
  id: '',
  name: '',
  address: '',
};

// Company interface
export const CompanyType = {
  id: '',
  name: '',
  category: '',
  inboundSMSRate: 0,
  outboundSMSRate: 0,
  locationId: '',
};

// Category interface
export const CategoryType = {
  id: '',
  name: '',
  description: '',
  color: '',
};

// SMS Group interface
export const SMSGroupType = {
  id: '',
  name: '',
  address: '',
  category: '',
  inboundRate: 0,
  outboundRate: 0,
  isActive: false,
};

// Default SMS Rates interface
export const DefaultSMSRatesType = {
  incomingRate: 0,
  outgoingRate: 0,
  currency: '',
};

// User Data interface
export const UserDataType = {
  id: '',
  company: '',
  location: '',
  inboundSegment: '',
  outboundSegment: '',
  messageCountInbound: 0,
  messageCountOutbound: 0,
  inboundUsage: 0,
  outboundUsage: 0,
  category: '',
};

// User Data Filters interface
export const UserDataFiltersType = {
  company: '',
  category: '',
  dateRange: {
    start: '',
    end: '',
  },
};