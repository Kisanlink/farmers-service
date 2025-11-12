/**
 * Crop Service Types
 *
 * Type definitions for crop and variety management.
 */

// Core data types
export interface CropData {
  id: string;
  name: string;
  scientific_name?: string;
  category: string;
  seasons: string[];
  unit: string;
  duration_days?: number;
  is_active: boolean;
  properties?: Record<string, string>;
  variety_count: number;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CropLookupData {
  id: string;
  name: string;
  category: string;
  seasons: string[];
  unit: string;
}

export interface CropVarietyData {
  id: string;
  crop_id: string;
  crop_name: string;
  name: string;
  description?: string;
  duration_days?: number;
  is_active: boolean;
  properties?: Record<string, string>;
  yield_per_acre?: number;
  yield_per_tree?: number;
  yield_by_age?: Array<{
    age_from: number;
    age_to: number;
    yield_per_tree: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface VarietyLookupData {
  id: string;
  name: string;
  duration_days?: number;
}

// Request types
export interface CreateCropRequest {
  name: string;
  scientific_name?: string;
  category: string;
  seasons: string[];
  unit: string;
  duration_days?: number;
  properties?: Record<string, string>;
  metadata?: Record<string, string>;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface UpdateCropRequest {
  id: string;
  name?: string;
  scientific_name?: string;
  category?: string;
  seasons?: string[];
  unit?: string;
  duration_days?: number;
  is_active?: boolean;
  properties?: Record<string, string>;
  metadata?: Record<string, string>;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface CreateVarietyRequest {
  crop_id: string;
  name: string;
  description?: string;
  duration_days?: number;
  properties?: Record<string, string>;
  yield_per_acre?: number;
  yield_per_tree?: number;
  yield_by_age?: Array<{
    age_from: number;
    age_to: number;
    yield_per_tree: number;
  }>;
  metadata?: Record<string, string>;
}

export interface UpdateVarietyRequest {
  id: string;
  name?: string;
  description?: string;
  duration_days?: number;
  is_active?: boolean;
  properties?: Record<string, string>;
  yield_per_acre?: number;
  yield_per_tree?: number;
  yield_by_age?: Array<{
    age_from: number;
    age_to: number;
    yield_per_tree: number;
  }>;
  metadata?: Record<string, string>;
}

// Response types
export interface CropResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropData;
}

export interface CropListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropData[];
  page: number;
  page_size: number;
  total: number;
}

export interface CropLookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropLookupData[];
}

export interface VarietyResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropVarietyData;
}

export interface VarietyListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropVarietyData[];
  page: number;
  page_size: number;
  total: number;
}

export interface VarietyLookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: VarietyLookupData[];
}

export interface LookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: string[];
}
