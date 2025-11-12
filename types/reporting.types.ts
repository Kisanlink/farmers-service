/**
 * Reporting Service Types
 * Types for farmer analytics and reports
 */

export interface ExportFarmerPortfolioData {
  farmer_id: string;
  farms: any[];
  crop_cycles: any[];
  activities: any[];
  summary: Record<string, any>;
}

export interface ExportFarmerPortfolioResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: ExportFarmerPortfolioData;
}
