import React, { useState } from 'react';
import { MapPin, Building2, DollarSign, Settings, Check, Plus } from 'lucide-react';
import { useLocations } from '../../hooks/useLocations';
import { useCompanies } from '../../hooks/useCompanies';
import { useCategories } from '../../hooks/useCategories';
import Button from '../../components/common/Button';
import LoadingTable from '../../components/common/LoadingTable';
import Shimmer from '../../components/common/Shimmer';
import CompanyOnboardingModal from '../../components/admin/CompanyOnboardingModal';

const OnboardingPage = () => {
  const [showLocations, setShowLocations] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [onboardedCompanies, setOnboardedCompanies] = useState(new Set());
  const [showOnboardedTable, setShowOnboardedTable] = useState(false);
  
  const { locations, selectedLocation, loading: locationsLoading, selectLocation } = useLocations();
  const { companies, loading: companiesLoading } = useCompanies(selectedLocation?.id);
  const { categories } = useCategories();

  const handleOnboard = () => {
    setShowLocations(true);
    setShowOnboardedTable(false);
  };

  const handleLocationSelect = (location) => {
    selectLocation(location);
    setOnboardedCompanies(new Set()); // Reset onboarded companies when location changes
    setShowOnboardedTable(false);
  };

  const handleChangeLocation = () => {
    setShowLocations(true);
    setShowOnboardedTable(false);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setIsOnboardingModalOpen(true);
  };

  const handleCompanyOnboarded = (companyId, companyData) => {
    setOnboardedCompanies(prev => new Set([...prev, companyId]));
    setIsOnboardingModalOpen(false);
    setSelectedCompany(null);
    
    // If all companies are onboarded, show the final table
    if (onboardedCompanies.size + 1 >= companies.length) {
      setShowOnboardedTable(true);
    }
  };

  const isCompanyOnboarded = (companyId) => {
    return onboardedCompanies.has(companyId);
  };

  const getOnboardedCompanies = () => {
    return companies.filter(company => isCompanyOnboarded(company.id));
  };

  // Show welcome screen if no location selected and not showing locations
  if (!showLocations && !selectedLocation && !showOnboardedTable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to GHL SMS Management
          </h2>
          <p className="text-gray-600 mb-8">
            Start by onboarding your locations to manage SMS rates and settings across your organization.
          </p>
          <Button 
            onClick={handleOnboard}
            size="lg"
            className="px-8 py-3"
            icon={Plus}
          >
            Onboard
          </Button>
        </div>
      </div>
    );
  }

  // Show location selection
  if (showLocations) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Select Location
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose a location to view and onboard companies
            </p>
          </div>
          
          <div className="p-6">
            {locationsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <Shimmer width="w-48" height="h-5" className="mb-2" />
                    <Shimmer width="w-72" height="h-4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      handleLocationSelect(location);
                      setShowLocations(false);
                    }}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {location.address}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show final onboarded companies table (like in the image)
  if (showOnboardedTable && selectedLocation) {
    const onboardedCompaniesList = getOnboardedCompanies();
    
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Companies at {selectedLocation?.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage SMS rates for companies at this location
                </p>
              </div>
              <Button
                onClick={handleChangeLocation}
                variant="outline"
                size="sm"
              >
                Change Location
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inbound SMS Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outbound SMS Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {onboardedCompaniesList.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {company.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                          {company.inboundSMSRate.toFixed(3)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="w-4 h-4 text-blue-600 mr-1" />
                          {company.outboundSMSRate.toFixed(3)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show company selection for onboarding
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Select Companies to Onboard at {selectedLocation?.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose companies and configure their SMS settings
              </p>
            </div>
            <div className="flex space-x-3">
              {onboardedCompanies.size > 0 && (
                <Button
                  onClick={() => setShowOnboardedTable(true)}
                  variant="success"
                  size="sm"
                >
                  View Onboarded ({onboardedCompanies.size})
                </Button>
              )}
              <Button
                onClick={handleChangeLocation}
                variant="outline"
                size="sm"
              >
                Change Location
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {companiesLoading ? (
            <LoadingTable rows={6} columns={6} />
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Inbound Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Outbound Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {companies.map((company) => {
                    const isOnboarded = isCompanyOnboarded(company.id);
                    return (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                            <div className="text-sm font-medium text-gray-900">
                              {company.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {company.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {company.inboundSMSRate.toFixed(3)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {company.outboundSMSRate.toFixed(3)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isOnboarded ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Onboarded
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() => handleCompanySelect(company)}
                            variant={isOnboarded ? "outline" : "primary"}
                            size="sm"
                            icon={isOnboarded ? Settings : Plus}
                          >
                            {isOnboarded ? 'Configure' : 'Onboard'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Company Onboarding Modal */}
      {selectedCompany && (
        <CompanyOnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => {
            setIsOnboardingModalOpen(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
          categories={categories}
          onCompanyOnboarded={handleCompanyOnboarded}
          isAlreadyOnboarded={isCompanyOnboarded(selectedCompany.id)}
        />
      )}
    </div>
  );
};

export default OnboardingPage;