/**
 * Crop Stages Service Types
 *
 * Type definitions for crop stage assignments and management.
 */

// Core data types
export interface CropStageData {
  id: string;
  crop_id: string;
  stage_id: string;
  stage_name: string;
  stage_order: number;
  description?: string;
  duration_days?: number;
  duration_unit?: 'DAYS' | 'WEEKS' | 'MONTHS';
  is_active: boolean;
  properties?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Request types
export interface AssignStageRequest {
  stage_id: string;
  stage_order: number;
  duration_days?: number;
  duration_unit?: 'DAYS' | 'WEEKS' | 'MONTHS';
  metadata?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

export interface ReorderStagesRequest {
  stage_orders: Record<string, number>; // map of stage_id -> order
  metadata?: Record<string, unknown>;
}

export interface UpdateCropStageRequest {
  stage_order?: number;
  duration_days?: number;
  duration_unit?: 'DAYS' | 'WEEKS' | 'MONTHS';
  is_active?: boolean;
  metadata?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

// Response types
export interface CropStagesResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: CropStageData[];
}

export interface CropStageResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: CropStageData;
}

export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  request_id?: string;
  data: T;
}
