/**
 * KisanSathi Service Types
 * Types for KisanSathi (field agent) management operations
 *
 * NOTE: Some KisanSathi types are exported from identity.types.ts
 * to avoid duplication
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

// Re-export from identity.types to maintain backward compatibility
export type {
  ReassignKisanSathiRequest,
  KisanSathiAssignmentData,
  KisanSathiAssignmentResponse
} from './identity.types';

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

export interface KisanSathiResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: KisanSathiData;
}
