/**
 * FPO Service Types
 * Types for FPO (Farmer Producer Organization) operations
 */

/**
 * CEO User details for FPO creation
 *
 * **Important: Phone Number Lookup Behavior**
 *
 * The backend automatically looks up users by `phone_number`:
 * - If user **exists**:
 *   - ✅ Reuses existing user (ignores all other fields except `phone_number`)
 *   - ✅ Phone number is the only field that matters
 *   - ✅ Validates user is not already CEO of another FPO
 *   - ✅ Password is **NOT required** for existing users
 * - If user **doesn't exist**:
 *   - Creates new user with provided details
 *   - Password **is required** for new user creation
 *   - `first_name`, `last_name`, and `phone_number` are required
 *
 * **For Existing Users (Recommended):**
 * Only send `phone_number`, other fields can be omitted or will be ignored:
 * ```typescript
 * ceo_user: {
 *   first_name: "N/A",        // Optional, will be ignored
 *   last_name: "N/A",         // Optional, will be ignored
 *   phone_number: "9542687186" // This is the lookup key!
 *   // password is NOT needed for existing users
 * }
 * ```
 *
 * **For New Users:**
 * All required fields must be provided:
 * ```typescript
 * ceo_user: {
 *   first_name: "Kaushik",
 *   last_name: "Kumar",
 *   phone_number: "+919542687186",
 *   password: "SecurePass@123",  // Required for new users!
 *   email: "kaushik@auto.local"  // Optional
 * }
 * ```
 *
 * **Validation:**
 * - Password is validated only when creating a new user (min 8 characters)
 * - Phone number must be unique for new users
 * - User cannot be CEO of multiple FPOs simultaneously
 *
 * @see internal/services/fpo_ref_service.go:62-99 for backend implementation
 */
export interface CEOUser {
  /**
   * CEO first name (required for new users, ignored for existing users)
   * Can be dummy value like "N/A" if user exists
   */
  first_name: string;

  /**
   * CEO last name (required for new users, ignored for existing users)
   * Can be dummy value like "N/A" if user exists
   */
  last_name: string;

  /**
   * CEO phone number - **THIS IS THE KEY FIELD**
   * Used for user lookup. If found, existing user is reused.
   * Must be in E.164 format for new users (e.g., "+919542687186")
   */
  phone_number: string;

  /**
   * Password (OPTIONAL - only required for NEW users)
   * - For **existing users**: Can be omitted entirely
   * - For **new users**: Required, minimum 8 characters
   * - Backend validates password only when creating a new user
   */
  password?: string;

  /**
   * Email address (optional, ignored for existing users)
   */
  email?: string;

  /**
   * Full name (optional, ignored for existing users)
   */
  name?: string;
}

/**
 * Request to create a new FPO (Farmer Producer Organization)
 *
 * **Usage Examples:**
 *
 * **Example 1: Creating FPO with NEW CEO User**
 * ```typescript
 * const request: CreateFPORequest = {
 *   name: "Sree Rama FPO",
 *   registration_number: "FPO00000001",
 *   description: "FPO in Jangaon, Telangana",
 *   ceo_user: {
 *     first_name: "Kaushik",
 *     last_name: "Kumar",
 *     phone_number: "+919542687186",
 *     password: "SecurePass@123",      // Required for new users
 *     email: "kaushik@auto.local"
 *   }
 * };
 * ```
 *
 * **Example 2: Creating FPO with EXISTING CEO User (Clean Approach)**
 * ```typescript
 * const request: CreateFPORequest = {
 *   name: "Sree Rama FPO",
 *   registration_number: "FPO00000001",
 *   description: "FPO in Jangaon, Telangana",
 *   ceo_user: {
 *     first_name: "N/A",           // Can be dummy, will be ignored
 *     last_name: "N/A",            // Can be dummy, will be ignored
 *     phone_number: "9542687186"   // Only this matters!
 *     // password NOT needed for existing users ✅
 *   }
 * };
 * ```
 *
 * **Example 3: Creating FPO with EXISTING CEO User (Minimal)**
 * ```typescript
 * // Even cleaner - just send required structure fields
 * const request: CreateFPORequest = {
 *   name: "Sree Rama FPO",
 *   registration_number: "FPO00000001",
 *   ceo_user: {
 *     first_name: "",              // Empty string works
 *     last_name: "",               // Empty string works
 *     phone_number: "9542687186"   // The key field
 *   }
 * };
 * ```
 *
 * **How It Works:**
 * 1. Backend looks up user by `phone_number`
 * 2. If user exists → Reuses that user (ignores other fields)
 * 3. If user doesn't exist → Creates new user (password required)
 *
 * **Validation:**
 * - Password is validated **only** when creating a new user (min 8 chars)
 * - User cannot be CEO of multiple FPOs simultaneously
 * - Phone number must be unique in the system for new users
 * - Registration number should be unique (not enforced at API level)
 *
 * @see CEOUser for detailed information about user lookup behavior
 */
export interface CreateFPORequest {
  /**
   * FPO organization name (required)
   * @example "Sree Rama FPO"
   */
  name: string;

  /**
   * FPO registration number (required)
   * Should be unique identifier for the FPO
   * @example "FPO00000001"
   */
  registration_number: string;

  /**
   * CEO user details (required)
   * Backend will lookup by phone_number and reuse if exists
   * @see CEOUser for phone number lookup behavior
   */
  ceo_user: CEOUser;

  /**
   * FPO description (optional)
   * @example "FPO in Jangaon, Telangana"
   */
  description?: string;

  /**
   * Business configuration key-value pairs (optional)
   */
  business_config?: Record<string, string>;

  /**
   * Additional metadata (optional)
   */
  metadata?: Record<string, string>;

  /**
   * Organization ID (optional, usually auto-generated)
   */
  org_id?: string;

  /**
   * Request ID for tracking (optional)
   */
  request_id?: string;

  /**
   * Request type identifier (optional)
   */
  request_type?: string;

  /**
   * Timestamp (optional, usually auto-generated)
   */
  timestamp?: string;

  /**
   * User ID (optional, usually from auth context)
   */
  user_id?: string;
}

/**
 * Request to register FPO with AAA service
 */
export interface RegisterFPORequest {
  aaa_org_id: string;
  name: string;
  registration_number?: string;
  business_config?: Record<string, string>;
  metadata?: Record<string, string>;
  org_id?: string;
  request_id?: string;
  request_type?: string;
  timestamp?: string;
  user_id?: string;
}

/**
 * User group in FPO
 */
export interface UserGroup {
  created_at: string;
  description: string;
  group_id: string;
  name: string;
  org_id: string;
  permissions: string[];
}

/**
 * FPO data in response
 */
export interface FPOData {
  aaa_org_id: string;
  ceo_user_id: string;
  created_at: string;
  fpo_id: string;
  name: string;
  status: string;
  user_groups: UserGroup[];
}

/**
 * FPO reference data
 */
export interface FPOReferenceData {
  aaa_org_id: string;
  business_config?: Record<string, string>;
  created_at: string;
  created_by: string;
  id: string;
  metadata?: Record<string, string>;
  name: string;
  registration_number: string;
  status: string;
  updated_at: string;
}

/**
 * Response from FPO creation endpoint
 */
export interface FPOResponse {
  success: boolean;
  message: string;
  request_id?: string;
  timestamp?: string;
  data: FPOData;
}

/**
 * Response from FPO reference endpoint
 */
export interface FPOReferenceResponse {
  success: boolean;
  message: string;
  request_id?: string;
  timestamp?: string;
  data: FPOReferenceData;
}

// ==================== FPO LIFECYCLE MANAGEMENT TYPES ====================

/**
 * FPO Lifecycle Status
 * Represents the current state of an FPO in its lifecycle
 */
export type FPOStatus =
  | 'DRAFT'                  // Initial creation
  | 'PENDING_VERIFICATION'   // Awaiting approval
  | 'VERIFIED'               // Approved, ready for setup
  | 'REJECTED'               // Verification failed
  | 'PENDING_SETUP'          // AAA setup in progress
  | 'SETUP_FAILED'           // Setup encountered errors
  | 'ACTIVE'                 // Fully operational ✓
  | 'SUSPENDED'              // Temporarily disabled
  | 'INACTIVE'               // Permanently disabled
  | 'ARCHIVED';              // Historical record

/**
 * FPO Lifecycle Actions
 */
export type FPOAction =
  | 'submit_for_verification'
  | 'verify'
  | 'reject'
  | 'start_setup'
  | 'complete_setup'
  | 'fail_setup'
  | 'retry_setup'
  | 'activate'
  | 'suspend'
  | 'reactivate'
  | 'deactivate'
  | 'archive';

/**
 * Extended FPO data with lifecycle tracking
 */
export interface FPOLifecycleData {
  fpo_id: string;
  aaa_org_id: string;
  status: FPOStatus;
  name: string;
  registration_number?: string;

  // Lifecycle tracking
  setup_retries: number;
  max_setup_retries: number;
  last_setup_attempt_at?: string;
  setup_error_message?: string;

  // Status tracking
  suspended_at?: string;
  suspended_by?: string;
  suspension_reason?: string;
  suspended_until?: string;

  deactivated_at?: string;
  deactivated_by?: string;
  deactivation_reason?: string;

  archived_at?: string;
  archived_by?: string;

  // Metadata
  is_active: boolean;
  registered_at: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

/**
 * Audit history entry
 */
export interface FPOAuditEntry {
  id: string;
  fpo_id: string;
  action: FPOAction;
  from_status: FPOStatus;
  to_status: FPOStatus;
  performed_by: string;
  performed_by_name?: string;
  reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * Response from sync FPO endpoint
 */
export interface SyncFPOResponse {
  success: boolean;
  message: string;
  request_id: string;
  timestamp?: string;
  data: FPOLifecycleData;
  synced_from_aaa: boolean;
}

/**
 * Response from lifecycle endpoints (get, suspend, reactivate, deactivate)
 */
export interface FPOLifecycleResponse {
  success: boolean;
  message: string;
  request_id: string;
  timestamp?: string;
  data: FPOLifecycleData;
}

/**
 * Response from retry setup endpoint
 */
export interface RetrySetupResponse {
  success: boolean;
  message: string;
  request_id: string;
  timestamp?: string;
  data: {
    fpo_id: string;
    status: FPOStatus;
    retry_count: number;
    max_retries: number;
  };
}

/**
 * Request to suspend an FPO
 */
export interface SuspendFPORequest {
  reason: string;
  suspended_until?: string; // ISO 8601 date
  metadata?: Record<string, any>;
}

/**
 * Request to reactivate an FPO
 */
export interface ReactivateFPORequest {
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Request to deactivate an FPO
 */
export interface DeactivateFPORequest {
  reason: string;
  metadata?: Record<string, any>;
}

/**
 * Response from audit history endpoint
 */
export interface AuditHistoryResponse {
  success: boolean;
  message: string;
  request_id: string;
  timestamp?: string;
  data: FPOAuditEntry[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}
