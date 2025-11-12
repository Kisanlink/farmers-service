/**
 * Identity Service Types
 * Types for farmer identity management operations
 */

export interface FarmerData {
  farmer_id: string;
  user_id: string;
  aaa_org_id: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;
  kisan_sathi_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFarmerRequest {
  user_id: string;
  aaa_org_id: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;
  kisan_sathi_user_id?: string;
}

export interface UpdateFarmerRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  kisan_sathi_user_id?: string;
}

export interface LinkFarmerRequest {
  user_id: string;
  org_id: string;
  role?: string;
}

export interface ReassignKisanSathiRequest {
  farmer_id: string;
  kisan_sathi_user_id: string;
  org_id: string;
}

export interface FarmerListQueryParams {
  page?: number;
  page_size?: number;
  aaa_org_id?: string;
  kisan_sathi_user_id?: string;
}

export interface FarmerLinkageData {
  user_id: string;
  org_id: string;
  role?: string;
  linked_at: string;
  is_active: boolean;
}

export interface KisanSathiAssignmentData {
  farmer_id: string;
  kisan_sathi_user_id: string;
  org_id: string;
  assigned_at: string;
  is_active: boolean;
}

export interface FarmerResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmerData;
}

export interface FarmerListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmerData[];
  page: number;
  page_size: number;
  total: number;
}

export interface FarmerLinkageResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmerLinkageData;
}

export interface KisanSathiAssignmentResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: KisanSathiAssignmentData;
}
