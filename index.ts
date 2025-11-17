/**
 * Farmers Service Main Factory
 *
 * Creates a farmers service instance with all sub-services.
 * Uses factory pattern for dependency injection and testability.
 */

import { FarmerServiceConfig } from './config';
import createApiClient from './utils/apiClient';
import createLookupService from './services/lookupService';
import createIdentityService from './services/identityService';
import createFarmService from './services/farmService';
import createActivityService from './services/activityService';
import createCropActivityService from './services/cropActivityService';
import createFPOService from './services/fpoService';
import createLinkageService from './services/linkageService';
import createKisanSathiService from './services/kisanSathiService';
import createBulkService from './services/bulkService';
import createReportingService from './services/reportingService';
import createAdminService from './services/adminService';
import createDataQualityService from './services/dataQualityService';
import createCropService from './services/cropService';
import createStagesService from './services/stagesService';
import createCropStagesService from './services/cropStagesService';
import createCropCyclesService from './services/cropCyclesService';
import createOrganizationService from './services/organizationService';
import createFPOConfigService from './services/fpoConfigService';

/**
 * Create farmers service with all sub-services
 *
 * @param config - Farmers service configuration
 * @returns Farmers service instance with all sub-services
 *
 * @example
 * const farmerService = createFarmerService({
 *   baseURL: 'https://api.example.com',
 *   getAccessToken: () => localStorage.getItem('access_token') || undefined
 * });
 *
 * const irrigationSources = await farmerService.lookup.getIrrigationSources();
 * const farmers = await farmerService.identity.listFarmers();
 */
const createFarmerService = (config: FarmerServiceConfig) => {
  const apiClient = createApiClient(config);

  return {
    lookup: createLookupService(apiClient),
    identity: createIdentityService(apiClient),
    farm: createFarmService(apiClient),
    activity: createActivityService(apiClient),
    cropActivity: createCropActivityService(apiClient),
    fpo: createFPOService(apiClient),
    linkage: createLinkageService(apiClient),
    kisanSathi: createKisanSathiService(apiClient),
    bulk: createBulkService(apiClient),
    reporting: createReportingService(apiClient),
    admin: createAdminService(apiClient),
    dataQuality: createDataQualityService(apiClient),
    crop: createCropService(apiClient),
    stages: createStagesService(apiClient),
    cropStages: createCropStagesService(apiClient),
    cropCycles: createCropCyclesService(apiClient),
    organization: createOrganizationService(apiClient),
    fpoConfig: createFPOConfigService(apiClient),
  };
};

export default createFarmerService;

// Export configuration types
export * from './config';

// Export all types
export * from './types';

// Export individual service factories for advanced use cases
export { default as createApiClient } from './utils/apiClient';
export { default as createLookupService } from './services/lookupService';
export { default as createIdentityService } from './services/identityService';
export { default as createFarmService } from './services/farmService';
export { default as createActivityService } from './services/activityService';
export { default as createCropActivityService } from './services/cropActivityService';
export { default as createFPOService } from './services/fpoService';
export { default as createLinkageService } from './services/linkageService';
export { default as createKisanSathiService } from './services/kisanSathiService';
export { default as createBulkService } from './services/bulkService';
export { default as createReportingService } from './services/reportingService';
export { default as createAdminService } from './services/adminService';
export { default as createDataQualityService } from './services/dataQualityService';
export { default as createCropService } from './services/cropService';
export { default as createStagesService } from './services/stagesService';
export { default as createCropStagesService } from './services/cropStagesService';
export { default as createCropCyclesService } from './services/cropCyclesService';
export { default as createOrganizationService } from './services/organizationService';
export { default as createFPOConfigService } from './services/fpoConfigService';
