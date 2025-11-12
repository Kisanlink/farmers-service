/**
 * Admin Service Types
 * Types for admin operations
 */

export interface HealthCheckData {
  status: string;
  timestamp: string;
  version?: string;
  database?: string;
}

export interface SeedData {
  roles_created: number;
  permissions_created: number;
  message: string;
}

export interface PermissionCheckData {
  has_permission: boolean;
  user_id: string;
  permission: string;
  resource?: string;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: HealthCheckData;
}

export interface SeedRequest {
  force?: boolean;
}

export interface SeedResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: SeedData;
}

export interface PermissionCheckRequest {
  user_id: string;
  permission: string;
  resource?: string;
}

export interface PermissionCheckResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: PermissionCheckData;
}

export interface AuditQueryParams {
  user_id?: string;
  action?: string;
  resource?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface AuditResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: any[];
  page: number;
  page_size: number;
  total: number;
}
