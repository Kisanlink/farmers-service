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
  BulkAddFarmersParams,
  BulkAddFarmersRequest,
  BulkAddFarmersResponse,
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
    },

    /**
     * Bulk add farmers to an FPO
     *
     * Supports two modes:
     * 1. File upload (multipart/form-data) - pass a File/Blob in params.file
     * 2. JSON data - pass farmers array directly in request body
     *
     * @param params - Parameters including fpo_org_id, input_format, processing_mode, file, and options
     * @returns Promise with operation details including operation_id for tracking
     *
     * @example
     * // File upload mode
     * const result = await bulkService.bulkAddFarmers({
     *   fpo_org_id: 'ORG-123',
     *   input_format: 'csv',
     *   processing_mode: 'async',
     *   file: csvFile,
     *   options: { continue_on_error: true }
     * });
     *
     * @example
     * // JSON mode (no file)
     * const result = await bulkService.bulkAddFarmersJson({
     *   fpo_org_id: 'ORG-123',
     *   input_format: 'json',
     *   processing_mode: 'sync',
     *   farmers: [{ first_name: 'John', last_name: 'Doe', phone: '9876543210' }]
     * });
     */
    bulkAddFarmers: (params: BulkAddFarmersParams): Promise<BulkAddFarmersResponse> => {
      const formData = new FormData();
      formData.append('fpo_org_id', params.fpo_org_id);
      formData.append('input_format', params.input_format);
      formData.append('processing_mode', params.processing_mode);

      if (params.file) {
        formData.append('file', params.file);
      }

      if (params.options) {
        formData.append('options', JSON.stringify(params.options));
      }

      return apiClient.postFormData<BulkAddFarmersResponse>(`${basePath}/farmers/add`, formData);
    },

    /**
     * Bulk add farmers using JSON payload (no file upload)
     *
     * @param request - JSON request with farmers data
     * @returns Promise with operation details
     */
    bulkAddFarmersJson: (request: BulkAddFarmersRequest): Promise<BulkAddFarmersResponse> => {
      return apiClient.post<BulkAddFarmersResponse>(`${basePath}/farmers/add`, request);
    }
  };
};

export default createBulkService;
