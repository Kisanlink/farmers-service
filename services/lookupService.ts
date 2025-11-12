/**
 * Lookup Service
 *
 * Service for fetching lookup/reference data (irrigation sources, soil types).
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import { IrrigationSourcesResponse, SoilTypesResponse } from '../types/lookup.types';

/**
 * Create lookup service with injected API client
 *
 * @param apiClient - Injected API client instance
 * @returns Lookup service methods
 *
 * @example
 * const apiClient = createApiClient({ baseURL: 'https://api.example.com' });
 * const lookupService = createLookupService(apiClient);
 * const irrigationSources = await lookupService.getIrrigationSources();
 */
const createLookupService = (apiClient: ApiClient) => {
  return {
    /**
     * Get irrigation sources lookup data
     *
     * @returns Promise resolving to irrigation sources response
     *
     * @example
     * const response = await lookupService.getIrrigationSources();
     * console.log(response.data); // Array of irrigation sources
     */
    getIrrigationSources: (): Promise<IrrigationSourcesResponse> => {
      return apiClient.get<IrrigationSourcesResponse>('/api/v1/lookups/irrigation-sources');
    },

    /**
     * Get soil types lookup data
     *
     * @returns Promise resolving to soil types response
     *
     * @example
     * const response = await lookupService.getSoilTypes();
     * console.log(response.data); // Array of soil types
     */
    getSoilTypes: (): Promise<SoilTypesResponse> => {
      return apiClient.get<SoilTypesResponse>('/api/v1/lookups/soil-types');
    },
  };
};

export default createLookupService;
