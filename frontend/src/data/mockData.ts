import { Location, Company, Category, SMSGroup, DefaultSMSRates, UserData } from '../types/common';

export const mockLocations: Location[] = [
  { id: '1', name: 'New York Office', address: '123 Broadway, NY 10001' },
  { id: '2', name: 'Los Angeles Branch', address: '456 Sunset Blvd, LA 90028' },
  { id: '3', name: 'Chicago Hub', address: '789 State St, Chicago 60601' },
  { id: '4', name: 'Miami Center', address: '321 Ocean Dr, Miami 33139' },
  { id: '5', name: 'Seattle Branch', address: '654 Pine St, Seattle 98101' },
];

export const mockCompanies: Company[] = [
  { id: '1', name: 'TechCorp Solutions', category: 'Technology', inboundSMSRate: 0.02, outboundSMSRate: 0.05, locationId: '1' },
  { id: '2', name: 'HealthPlus Medical', category: 'Healthcare', inboundSMSRate: 0.03, outboundSMSRate: 0.06, locationId: '1' },
  { id: '3', name: 'FinanceFirst Bank', category: 'Finance', inboundSMSRate: 0.01, outboundSMSRate: 0.04, locationId: '1' },
  { id: '4', name: 'RetailMax Store', category: 'Retail', inboundSMSRate: 0.025, outboundSMSRate: 0.055, locationId: '2' },
  { id: '5', name: 'EduSmart Academy', category: 'Education', inboundSMSRate: 0.02, outboundSMSRate: 0.045, locationId: '2' },
  { id: '6', name: 'AutoDrive Motors', category: 'Automotive', inboundSMSRate: 0.035, outboundSMSRate: 0.065, locationId: '3' },
  { id: '7', name: 'FoodDelight Restaurant', category: 'Food & Beverage', inboundSMSRate: 0.028, outboundSMSRate: 0.058, locationId: '3' },
  { id: '8', name: 'TravelEase Agency', category: 'Travel', inboundSMSRate: 0.022, outboundSMSRate: 0.052, locationId: '4' },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Technology', description: 'Technology and software companies', color: '#3B82F6' },
  { id: '2', name: 'Healthcare', description: 'Medical and healthcare services', color: '#10B981' },
  { id: '3', name: 'Finance', description: 'Financial services and banking', color: '#8B5CF6' },
  { id: '4', name: 'Retail', description: 'Retail and e-commerce businesses', color: '#F59E0B' },
  { id: '5', name: 'Education', description: 'Educational institutions and services', color: '#EF4444' },
  { id: '6', name: 'Automotive', description: 'Automotive industry and services', color: '#6B7280' },
  { id: '7', name: 'Food & Beverage', description: 'Restaurants and food services', color: '#EC4899' },
  { id: '8', name: 'Travel', description: 'Travel and hospitality services', color: '#14B8A6' },
];

export const mockSMSGroups: SMSGroup[] = [
  {
    id: '1',
    name: 'Rojin Tech Finance',
    address: '123 Main St, Downtown',
    category: 'Finance',
    inboundRate: 0.02,
    outboundRate: 0.05,
    isActive: true,
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    address: '456 Business Blvd, Tech Park',
    category: 'Technology',
    inboundRate: 0.01,
    outboundRate: 0.04,
    isActive: true,
  },
  {
    id: '3',
    name: 'Medical Center',
    address: '789 Health Ave, Medical District',
    category: 'Healthcare',
    inboundRate: 0.03,
    outboundRate: 0.06,
    isActive: false,
  },
];

export const mockDefaultSMSRates: DefaultSMSRates = {
  incomingRate: 0.02,
  outgoingRate: 0.05,
  currency: 'USD',
};

export const mockUserData: UserData[] = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    location: 'New York Office',
    inboundSegment: '10000',
    outboundSegment: '1000',
    messageCountInbound: 2500,
    messageCountOutbound: 3200,
    inboundUsage: 50.00,
    outboundUsage: 160.00,
    category: 'Technology',
  },
  {
    id: '2',
    company: 'HealthPlus Medical',
    location: 'New York Office',
    inboundSegment: '20000',
    outboundSegment: '30000',
    messageCountInbound: 1800,
    messageCountOutbound: 2100,
    inboundUsage: 54.00,
    outboundUsage: 126.00,
    category: 'Healthcare',
  },
  {
    id: '3',
    company: 'FinanceFirst Bank',
    location: 'New York Office',
    inboundSegment: '200',
    outboundSegment: '22000',
    messageCountInbound: 5200,
    messageCountOutbound: 4800,
    inboundUsage: 52.00,
    outboundUsage: 192.00,
    category: 'Finance',
  },
  {
    id: '4',
    company: 'RetailMax Store',
    location: 'Los Angeles Branch',
    inboundSegment: '400',
    outboundSegment: '299',
    messageCountInbound: 3100,
    messageCountOutbound: 2900,
    inboundUsage: 77.50,
    outboundUsage: 159.50,
    category: 'Retail',
  },
  {
    id: '5',
    company: 'EduSmart Academy',
    location: 'Los Angeles Branch',
    inboundSegment: '300',
    outboundSegment: '211',
    messageCountInbound: 1200,
    messageCountOutbound: 1500,
    inboundUsage: 24.00,
    outboundUsage: 67.50,
    category: 'Education',
  },
];