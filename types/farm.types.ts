/**
 * Farm Service Types
 * Types for farm management and spatial operations
 */

export interface FarmData {
  farm_id: string;
  farmer_id: string;
  org_id?: string;
  farm_name?: string;
  location?: string;
  area_ha?: number;
  geometry?: string; // WKT format
  irrigation_source?: string;
  soil_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFarmRequest {
  farmer_id: string;
  org_id?: string;
  farm_name?: string;
  location?: string;
  area_ha?: number;
  geometry?: string;
  irrigation_source?: string;
  soil_type?: string;
}

export interface FarmListQueryParams {
  page?: number;
  page_size?: number;
  farmer_id?: string;
  org_id?: string;
  min_area?: number;
  max_area?: number;
}

export interface FarmResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmData;
}

export interface FarmListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmData[];
  page: number;
  page_size: number;
  total: number;
}
