/**
 * KisanSathi Service Types
 * Types for KisanSathi (field agent) management operations
 */

export interface CreateKisanSathiRequest {
  user_id: string;
  org_id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface AssignKisanSathiRequest {
  farmer_id: string;
  kisan_sathi_user_id: string;
  org_id: string;
}

export interface ReassignKisanSathiRequest {
  farmer_id: string;
  kisan_sathi_user_id: string;
  org_id: string;
}

export interface KisanSathiData {
  id: string;
  user_id: string;
  org_id: string;
  name: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KisanSathiAssignmentData {
  farmer_id: string;
  kisan_sathi_user_id: string;
  org_id: string;
  assigned_at: string;
  is_active: boolean;
}

export interface KisanSathiResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: KisanSathiData;
}

export interface KisanSathiAssignmentResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: KisanSathiAssignmentData;
}
