// Farmer Service V2 Types
// Based on swagger.json API definitions

// Base response structure
export interface BaseResponse {
  message: string;
  request_id?: string;
  success: boolean;
  timestamp?: string;
}

// Error response structure
export interface ErrorResponse extends BaseResponse {
  correlation_id?: string;
  details?: Record<string, string>;
  error: string;
}

// Address data structure
export interface AddressData {
  city?: string;
  coordinates?: string;
  country?: string;
  postal_code?: string;
  state?: string;
  street_address?: string;
}

// Farmer profile data structure
export interface FarmerProfileData {
  aaa_org_id?: string;
  aaa_user_id?: string;
  address?: AddressData;
  created_at?: string;
  date_of_birth?: string;
  email?: string;
  farms?: FarmData[];
  first_name?: string;
  gender?: string;
  id?: string; // Farmer ID (primary key)
  kisan_sathi_user_id?: string;
  last_name?: string;
  metadata?: Record<string, string>;
  phone_number?: string;
  preferences?: Record<string, string>;
  updated_at?: string;
}

// Farm data structure
export interface FarmData {
  aaa_user_id?: string;
  aaa_org_id?: string;
  area_ha?: number;
  created_at?: string;
  geometry?: GeometryData;
  id?: string;
  metadata?: Record<string, string>;
  org_id?: string;
  updated_at?: string;
}

// Geometry data structure
export interface GeometryData {
  wkb?: number[]; // Well-Known Binary format
  wkt?: string; // Well-Known Text format
}

// Crop cycle data structure
export interface CropCycleData {
  aaa_user_id?: string;
  aaa_org_id?: string;
  crop_id?: string;
  end_date?: string;
  farm_id?: string;
  id?: string;
  metadata?: Record<string, string>;
  org_id?: string;
  planned_crops?: string[];
  season?: string;
  start_date?: string;
  status?: string;
  updated_at?: string;
  created_at?: string;
  outcome?: Record<string, string>;
}

// Farm activity data structure
export interface FarmActivityData {
  activity_id?: string;
  activity_type?: string;
  completed_at?: string;
  crop_cycle_id?: string;
  created_at?: string;
  description?: string;
  id?: string;
  metadata?: Record<string, string>;
  notes?: string;
  outcome?: string;
  planned_at?: string;
  status?: string;
  updated_at?: string;
}

// KisanSathi user data
export interface KisanSathiUserData {
  created_at?: string;
  email?: string;
  full_name?: string;
  id?: string;
  metadata?: Record<string, string>;
  phone_number?: string;
  role?: string;
  status?: string;
  username?: string;
}

// Bulk operation data
export interface BulkOperationData {
  estimated_completion?: string;
  message?: string;
  operation_id?: string;
  result_url?: string;
  status?: string;
  status_url?: string;
}

// Bulk operation status data
export interface BulkOperationStatusData {
  can_retry?: boolean;
  current_batch?: number;
  end_time?: string;
  error_summary?: Record<string, number>;
  estimated_completion?: string;
  fpo_org_id?: string;
  metadata?: Record<string, any>;
  operation_id?: string;
  processing_time?: string;
  progress?: ProgressInfo;
  result_file_url?: string;
  start_time?: string;
  status?: string;
  total_batches?: number;
}

// Progress info
export interface ProgressInfo {
  failed?: number;
  percentage?: number;
  processed?: number;
  skipped?: number;
  successful?: number;
  total?: number;
}

// Validation error
export interface ValidationError {
  field?: string;
  message?: string;
  row?: number;
  value?: string;
}

// Bulk validation data
export interface BulkValidationData {
  errors?: ValidationError[];
  is_valid?: boolean;
  summary?: Record<string, any>;
  total_records?: number;
  valid_records?: number;
}

// Request interfaces

// Create farmer request
export interface CreateFarmerRequest {
  aaa_org_id: string;
  aaa_user_id?: string; // Made optional
  kisan_sathi_user_id?: string;
  metadata?: Record<string, string>;
  org_id?: string;
  profile?: FarmerProfileData;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

// Update farmer request
export interface UpdateFarmerRequest {
  aaa_org_id?: string;
  aaa_user_id?: string;
  kisan_sathi_user_id?: string;
  metadata?: Record<string, string>;
  org_id?: string;
  profile?: Partial<FarmerProfileData>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

// Irrigation source request
export interface IrrigationSourceRequest {
  source_type: string;
  details?: string;
}

// Create farm request
export interface CreateFarmRequest {
  farmer_id?: string;
  aaa_user_id?: string;
  aaa_org_id: string;
  name?: string;
  ownership_type?: string;
  area_ha: number;
  geometry?: GeometryData;
  soil_type_id?: string;
  primary_irrigation_source_id?: string;
  bore_well_count?: number;
  other_irrigation_details?: string;
  irrigation_sources?: IrrigationSourceRequest[];
  metadata?: Record<string, string>;
  org_id?: string;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

// Create activity request
export interface CreateActivityRequest {
  crop_cycle_id: string;
  crop_stage_id?: string;
  activity_type: string;
  planned_at: string;
  metadata?: Record<string, string>;
}

// Complete activity request
export interface CompleteActivityRequest {
  id: string;
  completed_at: string;
  output?: Record<string, string>;
}

// Update activity request
export interface UpdateActivityRequest {
  id: string;
  crop_stage_id?: string;
  activity_type?: string;
  planned_at?: string;
  metadata?: Record<string, string>;
}

// Link farmer request

// Reassign KisanSathi request
export interface ReassignKisanSathiRequest {
  aaa_org_id: string;
  aaa_user_id: string;
  new_kisan_sathi_user_id?: string; // nil means remove
  metadata?: Record<string, string>;
  org_id?: string;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

// Export farmer portfolio request
export interface ExportFarmerPortfolioRequest {
  farmer_id: string;
  end_date?: string;
  format?: 'json' | 'csv';
  metadata?: Record<string, string>;
  org_id?: string;
  request_id?: string;
  request_type?: string;
  season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
  start_date?: string;
  timestamp?: string;
  user_id?: string;
}

// Crop cycle request interfaces

// Start crop cycle request
export interface StartCycleRequest {
  farm_id: string;
  planned_crops: string[];
  season: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
  start_date: string;
  metadata?: Record<string, string>;
  org_id?: string;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

// Update crop cycle request
export interface UpdateCycleRequest {
  id: string;
  metadata?: Record<string, string>;
  org_id?: string;
  planned_crops?: string[];
  request_id?: string;
  request_type?: string;
  season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
  start_date?: string;
  timestamp?: string;
  user_id?: string;
}

// End crop cycle request
export interface EndCycleRequest {
  end_date: string;
  id: string;
  status: 'COMPLETED' | 'CANCELLED';
  metadata?: Record<string, string>;
  org_id?: string;
  outcome?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

// Bulk farmer data
export interface FarmerBulkData {
  first_name: string;
  last_name: string;
  phone_number: string;
  city?: string;
  country?: string;
  custom_fields?: Record<string, string>;
  date_of_birth?: string;
  email?: string;
  external_id?: string;
  gender?: 'male' | 'female' | 'other';
  land_ownership_type?: string;
  password?: string;
  postal_code?: string;
  state?: string;
  street_address?: string;
}

// Response interfaces

// Farmer response
export interface FarmerResponse extends BaseResponse {
  data: FarmerProfileData;
}

// Farmer list response
export interface FarmerListResponse extends BaseResponse {
  data: FarmerProfileData[];
  page?: number;
  page_size?: number;
  total?: number;
}

// Farm response
export interface FarmResponse extends BaseResponse {
  data: FarmData;
}

// Farm list response
export interface FarmListResponse extends BaseResponse {
  data: FarmData[];
  page?: number;
  page_size?: number;
  total?: number;
}

// Farm activity response
export interface FarmActivityResponse extends BaseResponse {
  data: FarmActivityData;
}

// Farm activity list response
export interface FarmActivityListResponse extends BaseResponse {
  data: FarmActivityData[];
  page?: number;
  page_size?: number;
  total?: number;
}

// Crop cycle response
export interface CropCycleResponse extends BaseResponse {
  data: CropCycleData;
}

// Crop cycle list response
export interface CropCycleListResponse extends BaseResponse {
  data: CropCycleData[];
  page?: number;
  page_size?: number;
  total?: number;
}

// KisanSathi assignment response
export interface KisanSathiAssignmentResponse extends BaseResponse {
  data: KisanSathiAssignmentData;
}

// KisanSathi user response
export interface KisanSathiUserResponse extends BaseResponse {
  data: KisanSathiUserData;
}

// Farmer linkage response
export interface FarmerLinkageResponse extends BaseResponse {
  data: FarmerLinkageData;
}

// Bulk operation response
export interface BulkOperationResponse extends BaseResponse {
  data: BulkOperationData;
}

// Bulk operation status response
export interface BulkOperationStatusResponse extends BaseResponse {
  data: BulkOperationStatusData;
}

// Bulk validation response
export interface BulkValidationResponse extends BaseResponse {
  data: BulkValidationData;
}

// Export farmer portfolio response
export interface ExportFarmerPortfolioResponse extends BaseResponse {
  data: any; // The actual portfolio data structure
}

// Query parameters interfaces

// Farmer list query parameters
export interface FarmerListQueryParams {
  page?: number;
  page_size?: number;
  aaa_org_id?: string;
  kisan_sathi_user_id?: string;
}

// Farm list query parameters
export interface FarmListQueryParams {
  page?: number;
  page_size?: number;
  farmer_id?: string;
  org_id?: string;
  min_area?: number;
  max_area?: number;
}

// Activity list query parameters
export interface ActivityListQueryParams {
  crop_cycle_id?: string;
  activity_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

// Crop cycle list query parameters
export interface CropCycleListQueryParams {
  page?: number;
  page_size?: number;
  farmer_id?: string;
  farm_id?: string;
  crop_id?: string;
  status?: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
  start_date?: string;
  end_date?: string;
}

// API configuration
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers: Record<string, string>;
}

// Environment variables interface
// FPO Management Types
export interface CreateFPORequest {
  name: string;
  registration_no: string;
  ceo_user: {
    name: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    phone_number?: string;
  };
  business_config?: Record<string, string>;
  description?: string;
  metadata?: Record<string, string>;
  org_id?: string;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface RegisterFPORequest {
  aaa_org_id: string;
  name: string;
  business_config?: Record<string, string>;
  metadata?: Record<string, string>;
  org_id?: string;
  registration_no?: string;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface FPOResponse {
  success: boolean;
  message: string;
  data: {
    aaa_org_id: string;
    ceo_user_id: string;
    created_at: string;
    fpo_id: string;
    name: string;
    status: string;
    user_groups: Array<{
      created_at: string;
      description: string;
      group_id: string;
      name: string;
      org_id: string;
      permissions: string[];
    }>;
  };
  request_id?: string;
  timestamp?: string;
}

export interface FPOReferenceResponse {
  success: boolean;
  message: string;
  data: {
    aaa_org_id: string;
    business_config?: Record<string, string>;
    created_at: string;
    created_by: string;
    id: string;
    metadata?: Record<string, string>;
    name: string;
    registration_no: string;
    status: string;
    updated_at: string;
  };
  request_id?: string;
  timestamp?: string;
}

// Farmer Linkage Types
export interface LinkFarmerRequest {
  farmer_id: string;
  org_id?: string;
  linkage_type: 'MEMBER' | 'ASSOCIATE' | 'SUPPLIER';
  linkage_date: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface UnlinkFarmerRequest {
  farmer_id: string;
  org_id?: string;
  unlink_reason?: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface FarmerLinkageData {
  farmer_id: string;
  org_id?: string;
  linkage_type: 'MEMBER' | 'ASSOCIATE' | 'SUPPLIER';
  linkage_date: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, string>;
}

export interface FarmerLinkageResponse {
  success: boolean;
  message: string;
  data: FarmerLinkageData;
  errors?: ErrorResponse[];
}

// KisanSathi Management Types
export interface CreateKisanSathiRequest {
  name: string;
  email: string;
  phone: string;
  aadhaar_number?: string;
  address: string;
  state: string;
  district: string;
  block: string;
  village?: string;
  pincode?: string;
  org_id?: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface AssignKisanSathiRequest {
  kisansathi_id: string;
  farmer_id: string;
  org_id?: string;
  assignment_date: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface ReassignKisanSathiRequest {
  kisansathi_id: string;
  farmer_id: string;
  org_id?: string;
  action: 'REASSIGN' | 'REMOVE';
  new_kisansathi_id?: string;
  reason?: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface KisanSathiData {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar_number?: string;
  address: string;
  state: string;
  district: string;
  block: string;
  village?: string;
  pincode?: string;
  aaa_user_id?: string;
  org_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, string>;
}

export interface KisanSathiResponse {
  success: boolean;
  message: string;
  data: KisanSathiData;
  errors?: ErrorResponse[];
}

export interface KisanSathiAssignmentData {
  kisansathi_id: string;
  farmer_id: string;
  org_id?: string;
  assignment_date: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, string>;
}

export interface KisanSathiAssignmentResponse {
  success: boolean;
  message: string;
  data: KisanSathiAssignmentData;
  errors?: ErrorResponse[];
}

// Admin Types
export interface HealthCheckResponse {
  success: boolean;
  message: string;
  data: {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    services: {
      database: 'up' | 'down';
      redis: 'up' | 'down';
      external_apis: 'up' | 'down';
    };
    version: string;
  };
  errors?: ErrorResponse[];
}

export interface SeedRequest {
  force?: boolean;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface SeedResponse {
  success: boolean;
  message: string;
  data: {
    roles_created: number;
    permissions_created: number;
    timestamp: string;
  };
  errors?: ErrorResponse[];
}

export interface PermissionCheckRequest {
  user_id: string;
  resource: string;
  action: string;
  org_id?: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
}

export interface PermissionCheckResponse {
  success: boolean;
  message: string;
  data: {
    has_permission: boolean;
    user_id: string;
    resource: string;
    action: string;
    org_id?: string;
    checked_at: string;
  };
  errors?: ErrorResponse[];
}

export interface AuditQueryParams {
  page?: number;
  page_size?: number;
  user_id?: string;
  action?: string;
  resource?: string;
  org_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface AuditResponse {
  success: boolean;
  message: string;
  data: {
    audits: Array<{
      id: string;
      user_id: string;
      action: string;
      resource: string;
      resource_id?: string;
      org_id?: string;
      ip_address?: string;
      user_agent?: string;
      timestamp: string;
      metadata?: Record<string, string>;
    }>;
    pagination: {
      page: number;
      page_size: number;
      total: number;
      total_pages: number;
    };
  };
  errors?: ErrorResponse[];
}

// Data Quality Types
export interface ValidateGeometryRequest {
  geometry: {
    type: 'Polygon' | 'MultiPolygon' | 'Point';
    coordinates: number[][][] | number[][];
  };
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface ValidateGeometryResponse {
  success: boolean;
  message: string;
  data: {
    is_valid: boolean;
    area?: number;
    perimeter?: number;
    centroid?: {
      lat: number;
      lng: number;
    };
    validation_errors?: string[];
  };
  errors?: ErrorResponse[];
}

export interface DetectOverlapsRequest {
  farm_id?: string;
  org_id?: string;
  threshold?: number;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface DetectOverlapsResponse {
  success: boolean;
  message: string;
  data: {
    overlaps: Array<{
      farm_id_1: string;
      farm_id_2: string;
      overlap_area: number;
      overlap_percentage: number;
      geometry: any;
    }>;
    total_overlaps: number;
    processed_farms: number;
  };
  errors?: ErrorResponse[];
}

export interface ReconcileAAALinksRequest {
  org_id?: string;
  dry_run?: boolean;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface ReconcileAAALinksResponse {
  success: boolean;
  message: string;
  data: {
    reconciled_farmers: number;
    reconciled_farms: number;
    errors: Array<{
      entity_type: 'farmer' | 'farm';
      entity_id: string;
      error_message: string;
    }>;
    dry_run: boolean;
  };
  errors?: ErrorResponse[];
}

export interface RebuildSpatialIndexesRequest {
  org_id?: string;
  metadata?: Record<string, string>;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

export interface RebuildSpatialIndexesResponse {
  success: boolean;
  message: string;
  data: {
    indexes_rebuilt: number;
    farms_processed: number;
    processing_time_ms: number;
  };
  errors?: ErrorResponse[];
}

export interface ImportMetaEnv {
  readonly VITE_FARMER_MODULE_URL: string;
  readonly VITE_AAA_SERVICE_ENDPOINT?: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
