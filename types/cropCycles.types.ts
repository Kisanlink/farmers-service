/**
 * Crop Cycles Service Types
 *
 * Type definitions for crop cycle management.
 */

// Core data types
export interface CropCycleData {
  id: string;
  farm_id: string;
  farmer_id: string;
  crop_id: string;
  crop_name: string;
  variety_id?: string;
  variety_name?: string;
  season: string;
  start_date: string;
  end_date?: string;
  area_ha?: number;
  status: string;
  outcome?: Record<string, string>;
  metadata?: Record<string, string>;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
  created_at: string;
  updated_at: string;
  // Additional properties used in the UI
  crop?: {
    id: string;
    crop_name: string;
    variant: string;
    season: string;
  };
  expected_quantity?: number;
  quantity?: number;
  report?: string;
}

// Request types
export interface CreateCropCycleRequest {
  farm_id: string;
  crop_id: string;
  variety_id?: string;
  season: string;
  start_date: string;
  area_ha?: number;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface UpdateCropCycleRequest {
  id: string;
  crop_id?: string;
  variety_id?: string;
  season?: string;
  start_date?: string;
  area_ha?: number;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface EndCropCycleRequest {
  id: string;
  end_date: string;
  status: 'COMPLETED' | 'CANCELLED';
  outcome?: Record<string, string>;
  metadata?: Record<string, string>;
}

// Response types
export interface CropCycleResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropCycleData;
}

export interface CropCycleListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropCycleData[];
  page: number;
  page_size: number;
  total: number;
}
