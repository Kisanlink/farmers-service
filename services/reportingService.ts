/**
 * Reporting Service
 *
 * Service for farmer analytics and reports.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import { ExportFarmerPortfolioResponse } from '../types/reporting.types';

/**
 * Create reporting service with injected API client
 */
const createReportingService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/reports';

  return {
    /**
     * Export farmer portfolio data
     */
    exportFarmerPortfolio: (
      farmerId: string,
      options?: {
        format?: 'json' | 'csv';
        start_date?: string;
        end_date?: string;
        season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
        org_id?: string;
      }
    ): Promise<ExportFarmerPortfolioResponse> => {
      const requestData = {
        farmer_id: farmerId,
        format: options?.format || 'json',
        start_date: options?.start_date,
        end_date: options?.end_date,
        season: options?.season,
        org_id: options?.org_id
      };
      return apiClient.post<ExportFarmerPortfolioResponse>(`${basePath}/farmer-portfolio`, requestData);
    },

    /**
     * Get organization dashboard counters
     */
    getOrgDashboardCounters: (
      orgId: string,
      options?: {
        start_date?: string;
        end_date?: string;
        season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
      }
    ): Promise<any> => {
      const requestData = {
        org_id: orgId,
        start_date: options?.start_date,
        end_date: options?.end_date,
        season: options?.season
      };
      return apiClient.post<any>(`${basePath}/org-dashboard-counters`, requestData);
    },

    /**
     * Export farmer portfolio by farmer ID from URL path
     */
    exportFarmerPortfolioById: (
      farmerId: string,
      options?: {
        format?: 'json' | 'csv';
        start_date?: string;
        end_date?: string;
        season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
      }
    ): Promise<ExportFarmerPortfolioResponse> => {
      return apiClient.get<ExportFarmerPortfolioResponse>(`${basePath}/farmer-portfolio/${farmerId}`, { params: options });
    }
  };
};

export default createReportingService;
