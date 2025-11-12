/**
 * Stages Service Types
 *
 * Type definitions for stage and crop-stage management.
 */

// Core data types
export interface StageData {
  id: string;
  stage_name: string;
  description: string;
  is_active: boolean;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface StageLookupData {
  id: string;
  stage_name: string;
}

export interface CropStageData {
  id: string;
  crop_id: string;
  stage_id: string;
  stage_name: string;
  stage_description: string;
  order_index: number;
  duration_days?: number;
  is_active: boolean;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Request types
export interface CreateStageRequest {
  stage_name: string;
  description: string;
  is_active?: boolean;
  metadata?: Record<string, string>;
}

export interface UpdateStageRequest {
  stage_name?: string;
  description?: string;
  is_active?: boolean;
  metadata?: Record<string, string>;
}

export interface AssignStageRequest {
  stage_id: string;
  order_index: number;
  duration_days?: number;
  metadata?: Record<string, string>;
}

export interface UpdateCropStageRequest {
  order_index?: number;
  duration_days?: number;
  is_active?: boolean;
  metadata?: Record<string, string>;
}

export interface ReorderStagesRequest {
  stage_orders: Array<{
    stage_id: string;
    order_index: number;
  }>;
}

// Response types
export interface StageResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: StageData;
}

export interface StageListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: StageData[];
  page: number;
  page_size: number;
  total: number;
}

export interface StageLookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: StageLookupData[];
}

export interface CropStageResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropStageData;
}

export interface CropStagesResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropStageData[];
}
