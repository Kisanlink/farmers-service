/**
 * FPO Service Types
 * Types for FPO (Farmer Producer Organization) operations
 */

export interface CreateFPORequest {
  name: string;
  registration_number?: string;
  address?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface RegisterFPORequest {
  aaa_org_id: string;
  fpo_details?: Record<string, any>;
}

export interface FPOData {
  fpo_id: string;
  aaa_org_id: string;
  name: string;
  registration_number?: string;
  address?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

export interface FPOReferenceData {
  aaa_org_id: string;
  fpo_id: string;
  registered_at: string;
  is_active: boolean;
}

export interface FPOResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FPOData;
}

export interface FPOReferenceResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FPOReferenceData;
}
