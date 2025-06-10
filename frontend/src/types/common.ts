export interface Location {
  id: string;
  name: string;
  address?: string;
}

export interface Company {
  id: string;
  name: string;
  category: string;
  inboundSMSRate: number;
  outboundSMSRate: number;
  locationId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface SMSGroup {
  id: string;
  name: string;
  address: string;
  category: string;
  inboundRate: number;
  outboundRate: number;
  isActive: boolean;
}

export interface DefaultSMSRates {
  incomingRate: number;
  outgoingRate: number;
  currency: string;
}

export interface UserData {
  id: string;
  company: string;
  location?: string;
  inboundSegment: string;
  outboundSegment: string;
  messageCountInbound: number;
  messageCountOutbound: number;
  inboundUsage: number;
  outboundUsage: number;
  category: string;
}

export interface UserDataFilters {
  company: string;
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
}