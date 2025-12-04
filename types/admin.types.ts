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

/**
 * Entity types that can be permanently deleted
 */
export type PermanentDeleteEntityType = 'farmer' | 'farm' | 'crop_cycle' | 'farmer_link';

/**
 * Request to permanently delete a single entity with cascade
 */
export interface PermanentDeleteRequest {
  entity_type: PermanentDeleteEntityType;
  entity_id: string;
}

/**
 * Request to permanently delete all data for an organization
 */
export interface PermanentDeleteOrgRequest {
  org_id: string;
  dry_run?: boolean;
}

/**
 * Report of deleted records
 */
export interface DeleteReport {
  farmers_deleted: number;
  farms_deleted: number;
  crop_cycles_deleted: number;
  activities_deleted: number;
  farmer_links_deleted: number;
}

/**
 * Response for permanent delete operations
 */
export interface PermanentDeleteResponse {
  success: boolean;
  message: string;
  request_id?: string;
  deleted_by?: string;
  dry_run?: boolean;
  report: DeleteReport;
}

/**
 * Response for cleanup orphaned records operation
 */
export interface CleanupOrphanedResponse {
  success: boolean;
  message: string;
  request_id?: string;
  deleted_by?: string;
  report: DeleteReport;
}
