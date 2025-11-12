/**
 * Bulk Service
 *
 * Service for bulk farmer operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  BulkOperationResponse,
  BulkOperationStatusResponse,
  BulkValidationResponse,
  FarmerBulkData
} from '../types/bulk.types';
import { BaseResponse } from '../types';

/**
 * Create bulk service with injected API client
 */
const createBulkService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/bulk';

  return {
    /**
     * Get status of a bulk operation
     */
    getBulkOperationStatus: (operationId: string): Promise<BulkOperationStatusResponse> => {
      return apiClient.get<BulkOperationStatusResponse>(`${basePath}/status/${operationId}`);
    },

    /**
     * Validate farmer data without actually processing it
     */
    validateBulkData: (payload: {
      fpo_org_id: string;
      input_format: 'csv' | 'excel' | 'json';
      data?: number[];
      farmers?: FarmerBulkData[];
      metadata?: Record<string, string>;
      org_id?: string;
      request_id?: string;
      request_type?: string;
      timestamp?: string;
      user_id?: string;
    }): Promise<BulkValidationResponse> => {
      return apiClient.post<BulkValidationResponse>(`${basePath}/validate`, payload);
    },

    /**
     * Cancel a bulk operation
     */
    cancelBulkOperation: (operationId: string): Promise<BaseResponse> => {
      return apiClient.post<BaseResponse>(`${basePath}/cancel/${operationId}`);
    },

    /**
     * Retry a failed bulk operation
     */
    retryBulkOperation: (operationId: string, payload: any): Promise<BulkOperationResponse> => {
      return apiClient.post<BulkOperationResponse>(`${basePath}/retry/${operationId}`, {
        ...payload,
        operation_id: operationId
      });
    }
  };
};

export default createBulkService;
