/**
 * Organization Service Types
 *
 * Type definitions for organization, group, and role management.
 */

// Organization types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  type?: string;
  parent_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Organization[];
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  parent_id?: string;
  type?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
  type?: string;
}

export interface OrganizationResponse {
  success: boolean;
  message: string;
  data: Organization;
}

export interface OrganizationListResponse {
  success: boolean;
  message: string;
  data: Organization[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Group types
export interface Group {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  organization_id: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Group[];
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
}

export interface GroupResponse {
  success: boolean;
  message: string;
  data: Group;
}

export interface GroupListResponse {
  success: boolean;
  message: string;
  data: Group[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Role types
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: Role[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface AssignGroupRoleRequest {
  role_id: string;
  starts_at?: string; // ISO date-time
  ends_at?: string;   // ISO date-time
}

export interface GroupRoleAssignment {
  role_id: string;
  group_id: string;
  organization_id: string;
  starts_at?: string;
  ends_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupRoleListResponse {
  success: boolean;
  message: string;
  data: GroupRoleAssignment[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
