/**
 * Activity Service Types
 * Types for farm activity management operations
 */

export interface FarmActivityData {
  activity_id: string;
  crop_cycle_id: string;
  activity_type: string;
  planned_date?: string;
  actual_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityRequest {
  crop_cycle_id: string;
  activity_type: string;
  planned_date?: string;
  notes?: string;
}

export interface CompleteActivityRequest {
  actual_date: string;
  notes?: string;
}

export interface ActivityListQueryParams {
  crop_cycle_id?: string;
  activity_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface FarmActivityResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmActivityData;
}

export interface FarmActivityListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmActivityData[];
  page: number;
  page_size: number;
  total: number;
}
