# Farmers Service Architecture Refactoring Design Document

**Version:** 1.0.0
**Date:** 2025-11-12
**Author:** SDE-3 Backend Architect
**Status:** Design Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Target Architecture Design](#target-architecture-design)
4. [Migration Strategy](#migration-strategy)
5. [Risk Analysis & Mitigation](#risk-analysis--mitigation)
6. [Implementation Plan](#implementation-plan)
7. [Testing Strategy](#testing-strategy)
8. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 Project Overview

This document provides a comprehensive architecture design for refactoring the farmers-service codebase from a class-based, axios-dependent structure to a modern factory function pattern using native fetch API, following the proven auth-service pattern.

### 1.2 Key Objectives

- **Modernize Architecture**: Migrate from class-based to factory function pattern
- **Remove Axios Dependency**: Replace with native fetch API for better bundle size and maintainability
- **Improve Type Safety**: Centralize type definitions and enhance type contracts
- **Enable Dependency Injection**: Implement testable, configurable services
- **Maintain 100% Functionality**: Zero breaking changes to API contracts
- **Enhance Developer Experience**: Cleaner API, better error handling, improved observability

### 1.3 Key Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Total Services | 16 | 16 |
| Total Lines of Code | ~5,938 | ~4,500 (24% reduction) |
| External Dependencies | axios | native fetch |
| Architecture Pattern | Class-based | Factory functions |
| API Consistency | Varies | Unified |
| Test Coverage | Unknown | 85%+ |

---

## 2. Current State Analysis

### 2.1 Service Inventory

The farmers-service codebase consists of 16 service modules totaling approximately 5,938 lines of TypeScript code:

#### 2.1.1 Core Services (9)

1. **identityService.ts** (373 lines)
   - Farmer CRUD operations
   - Farmer linkage management
   - KisanSathi reassignment
   - Multiple ID-based lookup patterns (farmer_id, user_id, user_id+org_id)

2. **farmService.ts** (361 lines)
   - Farm CRUD operations
   - Spatial operations (centroids, heatmap, overlaps)
   - Geometry validation
   - Area-based filtering

3. **activityService.ts** (403 lines)
   - Farm activity lifecycle management
   - Activity filtering (crop_cycle, type, status, date range)
   - Completion tracking
   - Overdue activity detection

4. **cropService.ts** (494 lines)
   - Crop master data management
   - Crop variety management
   - Lookup data (categories, seasons)
   - Perennial crop support

5. **cropCyclesService.ts** (~300 lines)
   - Crop cycle lifecycle (start, update, end)
   - Season-based filtering
   - Farm-level cycle management

6. **cropStagesService.ts** (111 lines)
   - Stage assignment to crops
   - Stage reordering
   - Stage lifecycle management

7. **stagesService.ts** (~300 lines)
   - Master stage data management
   - Stage lookup data
   - Crop-stage associations

8. **lookupService.ts** (81 lines)
   - Irrigation sources
   - Soil types
   - Reference data management

9. **organizationService.ts** (~400 lines)
   - Organization hierarchy management
   - Group management
   - Role assignments
   - **Note:** Connects to external AAA service

#### 2.1.2 Business Logic Services (3)

10. **bulkService.ts** (~300 lines)
    - Bulk farmer upload
    - CSV/Excel processing
    - Batch operations
    - Validation workflows

11. **reportingService.ts** (~300 lines)
    - Farmer portfolio exports
    - Dashboard counters
    - Analytics data
    - Performance reports

12. **dataQualityService.ts** (96 lines)
    - Geometry validation
    - Farm overlap detection
    - AAA link reconciliation
    - Spatial index rebuilding

#### 2.1.3 Integration Services (4)

13. **fpoService.ts** (97 lines)
    - FPO creation and registration
    - FPO reference management

14. **linkageService.ts** (84 lines)
    - Farmer-to-FPO linkage
    - Linkage status tracking

15. **kisanSathiService.ts** (~150 lines)
    - KisanSathi user management
    - Assignment and reassignment
    - CRUD operations

16. **adminService.ts** (99 lines)
    - Health checks
    - Permission validation
    - Audit trail access
    - System seeding

#### 2.1.4 Supporting Files

17. **types.ts** (908 lines)
    - All type definitions
    - Request/Response interfaces
    - Shared data structures

18. **index.ts** (682 lines)
    - Module exports
    - Singleton instances
    - Utility functions
    - Main FarmerService wrapper class

19. **cropActivityService.ts** (116 lines)
    - Crop-specific activity operations
    - Activity completion workflows

### 2.2 Current Architecture Pattern

#### 2.2.1 Class-Based Services

```typescript
// Current Pattern
export class IdentityService {
  private basePath = '/api/v1/identity';

  async listFarmers(params?: FarmerListQueryParams): Promise<FarmerListResponse> {
    const response: AxiosResponse<FarmerListResponse> = await apiClient.get(url);
    return response.data;
  }
}

export const identityService = new IdentityService();
```

**Issues:**
- Global singleton instances prevent configuration
- Hard to test (no dependency injection)
- Tightly coupled to axios
- Inconsistent error handling across services
- No unified logging/observability hooks

#### 2.2.2 Axios Dependency

All services use axios with:
- Separate axios instance per service
- Inconsistent interceptor configuration
- Mixed approaches to auth token retrieval
- Varied error handling patterns

```typescript
// Multiple patterns found:
localStorage.getItem('access_token')
localStorage.getItem('token')
localStorage.getItem('authToken')
localStorage.getItem('jwt')
```

#### 2.2.3 Configuration Management

```typescript
const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL ||
           (import.meta as any).env?.VITE_FARMER_MODULE_URL ||
           'http://localhost:8000',
  timeout: 30000,
  headers: { ... }
};
```

**Issues:**
- Hard-coded in each service
- No runtime configuration
- Cannot override per-instance

### 2.3 API Endpoint Inventory

#### 2.3.1 Identity Module (14 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/identity/farmers` | List farmers with pagination |
| POST | `/api/v1/identity/farmers` | Create farmer |
| GET | `/api/v1/identity/farmers/id/{farmerId}` | Get by farmer ID |
| PUT | `/api/v1/identity/farmers/id/{farmerId}` | Update by farmer ID |
| DELETE | `/api/v1/identity/farmers/id/{farmerId}` | Delete by farmer ID |
| GET | `/api/v1/identity/farmers/user/{userId}` | Get by user ID |
| PUT | `/api/v1/identity/farmers/user/{userId}` | Update by user ID |
| DELETE | `/api/v1/identity/farmers/user/{userId}` | Delete by user ID |
| GET | `/api/v1/identity/farmers/user/{userId}/org/{orgId}` | Get by user+org |
| PUT | `/api/v1/identity/farmers/user/{userId}/org/{orgId}` | Update by user+org |
| DELETE | `/api/v1/identity/farmers/user/{userId}/org/{orgId}` | Delete by user+org |
| POST | `/api/v1/identity/farmers/link` | Link farmer to FPO |
| GET | `/api/v1/identity/farmers/link/user/{userId}/org/{orgId}` | Get linkage status |
| DELETE | `/api/v1/identity/farmers/link/user/{userId}/org/{orgId}` | Unlink farmer |

#### 2.3.2 Farm Module (10 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/farms` | List farms |
| POST | `/api/v1/farms` | Create farm |
| GET | `/api/v1/farms/{farmId}` | Get farm by ID |
| PUT | `/api/v1/farms/{farmId}` | Update farm |
| DELETE | `/api/v1/farms/{farmId}` | Delete farm |
| GET | `/api/v1/getFarmCentroids` | Get centroids for mapping |
| GET | `/api/v1/getFarmHeatmap` | Get heatmap data |
| POST | `/api/v1/detectFarmOverlaps` | Detect overlapping farms |
| POST | `/api/v1/validateGeometry` | Validate geometry |
| POST | `/api/v1/rebuildSpatialIndexes` | Rebuild indexes |

#### 2.3.3 Crop Module (16 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/crops` | List crops |
| POST | `/api/v1/crops` | Create crop |
| GET | `/api/v1/crops/{id}` | Get crop |
| PUT | `/api/v1/crops/{id}` | Update crop |
| DELETE | `/api/v1/crops/{id}` | Delete crop |
| GET | `/api/v1/crops/{cropId}/stages` | List crop stages |
| POST | `/api/v1/crops/{cropId}/stages` | Assign stage |
| POST | `/api/v1/crops/{cropId}/stages/reorder` | Reorder stages |
| PUT | `/api/v1/crops/{cropId}/stages/{stageId}` | Update stage |
| DELETE | `/api/v1/crops/{cropId}/stages/{stageId}` | Remove stage |
| GET | `/api/v1/varieties` | List varieties |
| POST | `/api/v1/varieties` | Create variety |
| GET | `/api/v1/varieties/{id}` | Get variety |
| PUT | `/api/v1/varieties/{id}` | Update variety |
| DELETE | `/api/v1/varieties/{id}` | Delete variety |
| GET | `/api/v1/crops/cycles` | List crop cycles |

#### 2.3.4 Activity Module (11 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/crops/activities` | List activities |
| POST | `/api/v1/crops/activities` | Create activity |
| GET | `/api/v1/crops/activities/{id}` | Get activity |
| PUT | `/api/v1/crops/activities/{id}` | Update activity |
| DELETE | `/api/v1/crops/activities/{id}` | Delete activity |
| POST | `/api/v1/crops/activities/{id}/complete` | Complete activity |

#### 2.3.5 Lookup Module (6 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/lookups/crops` | Crop lookup |
| GET | `/api/v1/lookups/varieties/{cropId}` | Variety lookup |
| GET | `/api/v1/lookups/crop-categories` | Categories |
| GET | `/api/v1/lookups/crop-seasons` | Seasons |
| GET | `/api/v1/lookups/irrigation-sources` | Irrigation sources |
| GET | `/api/v1/lookups/soil-types` | Soil types |

#### 2.3.6 FPO & Linkage Module (6 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/identity/fpo/create` | Create FPO |
| POST | `/api/v1/identity/fpo/register` | Register FPO |
| GET | `/api/v1/identity/fpo/reference/{aaaOrgId}` | Get FPO reference |
| POST | `/identity/link-farmer` | Link farmer |
| POST | `/identity/unlink-farmer` | Unlink farmer |
| GET | `/identity/linkage/{farmerId}/{orgId}` | Get linkage |

#### 2.3.7 KisanSathi Module (7 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/kisansathi/create-user` | Create KisanSathi |
| POST | `/api/v1/kisansathi/assign` | Assign to farmer |
| POST | `/api/v1/kisansathi/reassign` | Reassign |
| GET | `/api/v1/kisansathi/assignment/{farmerId}/{orgId}` | Get assignment |
| GET | `/api/v1/kisansathi` | List all |
| GET | `/api/v1/kisansathi/{id}` | Get by ID |
| PUT | `/api/v1/kisansathi/{id}` | Update |

#### 2.3.8 Admin & Data Quality (9 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/health` | Health check |
| POST | `/admin/seed` | Seed roles/permissions |
| POST | `/admin/permissions/check` | Check permission |
| GET | `/admin/audit` | Audit trail |
| POST | `/api/v1/data-quality/validate-geometry` | Validate geometry |
| POST | `/api/v1/data-quality/detect-farm-overlaps` | Detect overlaps |
| POST | `/api/v1/data-quality/reconcile-aaa-links` | Reconcile links |
| POST | `/api/v1/data-quality/rebuild-spatial-indexes` | Rebuild indexes |

#### 2.3.9 Bulk & Reporting (5 endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/bulk/farmers/add` | Bulk add farmers |
| GET | `/api/v1/bulk/template` | Download template |
| POST | `/api/v1/reports/farmer-portfolio` | Export portfolio |
| POST | `/api/v1/reports/org-dashboard-counters` | Dashboard counters |

**Total Endpoints:** 84+

### 2.4 Dependency Analysis

#### 2.4.1 External Dependencies

```json
{
  "axios": "Current primary HTTP client",
  "typescript": "Type system"
}
```

#### 2.4.2 Internal Dependencies

```
index.ts
├── types.ts (imported by all)
├── identityService.ts
├── farmService.ts
├── activityService.ts
├── cropService.ts
├── cropCyclesService.ts
├── cropStagesService.ts
├── stagesService.ts
├── lookupService.ts
├── organizationService.ts
├── fpoService.ts
├── linkageService.ts
├── kisanSathiService.ts
├── adminService.ts
├── dataQualityService.ts
├── bulkService.ts
├── reportingService.ts
└── cropActivityService.ts
```

**Key Finding:** Services are loosely coupled at runtime but share common type definitions.

### 2.5 Current Issues & Pain Points

#### 2.5.1 Architecture Issues

| Issue | Impact | Severity |
|-------|--------|----------|
| No dependency injection | Hard to test, configure | High |
| Global singletons | Cannot run multiple instances | Medium |
| Inconsistent error handling | Poor debugging experience | High |
| No centralized logging | Limited observability | Medium |
| Mixed auth token strategies | Security concerns | High |
| Hard-coded base URLs | Deployment inflexibility | Medium |

#### 2.5.2 Code Quality Issues

| Issue | Impact | Severity |
|-------|--------|----------|
| Duplicate interceptor code | Maintainability burden | Medium |
| Inconsistent API patterns | Developer confusion | Medium |
| No request/response typing | Type safety gaps | Low |
| Missing error boundaries | Unhandled exceptions | High |
| No retry logic | Brittle under load | Medium |

#### 2.5.3 Security Concerns

1. **Token Management**
   - Multiple token retrieval patterns
   - No token validation
   - Exposed in interceptors

2. **Input Validation**
   - Inconsistent validation
   - No sanitization layer

3. **Error Leakage**
   - Stack traces may expose internals
   - No error sanitization for production

---

## 3. Target Architecture Design

### 3.1 Architecture Overview

The target architecture follows the proven auth-service pattern:

```
farmers-service/
├── config.ts                    # Configuration types
├── types/                       # Type definitions (modular)
│   ├── index.ts
│   ├── identity.types.ts
│   ├── farm.types.ts
│   ├── crop.types.ts
│   ├── activity.types.ts
│   ├── lookup.types.ts
│   ├── fpo.types.ts
│   ├── admin.types.ts
│   └── shared.types.ts
├── utils/
│   ├── apiClient.ts            # Centralized fetch client
│   ├── errorHandler.ts         # Error handling utilities
│   └── validators.ts           # Input validation
├── services/                    # Service factories
│   ├── identityService.ts
│   ├── farmService.ts
│   ├── activityService.ts
│   ├── cropService.ts
│   ├── cropCyclesService.ts
│   ├── cropStagesService.ts
│   ├── stagesService.ts
│   ├── lookupService.ts
│   ├── organizationService.ts
│   ├── fpoService.ts
│   ├── linkageService.ts
│   ├── kisanSathiService.ts
│   ├── adminService.ts
│   ├── dataQualityService.ts
│   ├── bulkService.ts
│   ├── reportingService.ts
│   └── cropActivityService.ts
└── index.ts                     # Main factory & exports
```

### 3.2 Core Components

#### 3.2.1 Configuration (config.ts)

```typescript
export interface FarmerServiceConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  getAccessToken?: () => string | undefined;
  timeout?: number;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    retryableStatusCodes: number[];
  };
  logConfig?: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    logRequests: boolean;
    logResponses: boolean;
  };
}
```

#### 3.2.2 API Client (utils/apiClient.ts)

```typescript
export interface ApiClient {
  get: <T>(endpoint: string, options?: RequestOptions) => Promise<T>;
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => Promise<T>;
  delete: <T>(endpoint: string, options?: RequestOptions) => Promise<T>;
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => Promise<T>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  signal?: AbortSignal;
}

const createApiClient = (config: FarmerServiceConfig): ApiClient => {
  // Native fetch implementation with:
  // - Automatic token injection
  // - Retry logic
  // - Error handling
  // - Request/Response logging
  // - Timeout handling
  return { get, post, put, delete, patch };
};
```

**Key Features:**
- Native fetch API (no external dependencies)
- Configurable retry logic with exponential backoff
- Unified error handling
- Request/response interceptors via hooks
- AbortController support for cancellation
- TypeScript-first design

#### 3.2.3 Error Handler (utils/errorHandler.ts)

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  // Unified error transformation
  // - Network errors
  // - HTTP errors
  // - Validation errors
  // - Timeout errors
};

export const isRetryableError = (error: ApiError): boolean => {
  // Retry logic for transient failures
};
```

#### 3.2.4 Service Factory Pattern

```typescript
// services/identityService.ts
import { ApiClient } from '../utils/apiClient';
import {
  FarmerListResponse,
  FarmerResponse,
  CreateFarmerRequest,
  UpdateFarmerRequest,
  FarmerListQueryParams
} from '../types/identity.types';

const createIdentityService = (apiClient: ApiClient) => {
  return {
    listFarmers: (params?: FarmerListQueryParams) =>
      apiClient.get<FarmerListResponse>('/api/v1/identity/farmers', { params }),

    createFarmer: (data: CreateFarmerRequest) =>
      apiClient.post<FarmerResponse>('/api/v1/identity/farmers', data),

    getFarmerById: (farmerId: string) =>
      apiClient.get<FarmerResponse>(`/api/v1/identity/farmers/id/${farmerId}`),

    updateFarmerById: (farmerId: string, data: UpdateFarmerRequest) =>
      apiClient.put<FarmerResponse>(`/api/v1/identity/farmers/id/${farmerId}`, data),

    deleteFarmerById: (farmerId: string) =>
      apiClient.delete<BaseResponse>(`/api/v1/identity/farmers/id/${farmerId}`),

    // ... all other methods
  };
};

export default createIdentityService;
```

**Benefits:**
- Pure functions (no side effects)
- Testable (inject mock API client)
- Configurable (different configs per instance)
- Composable (can wrap/extend easily)
- Tree-shakeable (unused exports are eliminated)

#### 3.2.5 Main Factory (index.ts)

```typescript
import { FarmerServiceConfig } from './config';
import createApiClient from './utils/apiClient';
import createIdentityService from './services/identityService';
import createFarmService from './services/farmService';
// ... import all service factories

const createFarmerService = (config: FarmerServiceConfig) => {
  const apiClient = createApiClient(config);

  return {
    identity: createIdentityService(apiClient),
    farm: createFarmService(apiClient),
    activity: createActivityService(apiClient),
    crop: createCropService(apiClient),
    cropCycles: createCropCyclesService(apiClient),
    cropStages: createCropStagesService(apiClient),
    stages: createStagesService(apiClient),
    lookup: createLookupService(apiClient),
    organization: createOrganizationService(apiClient),
    fpo: createFPOService(apiClient),
    linkage: createLinkageService(apiClient),
    kisanSathi: createKisanSathiService(apiClient),
    admin: createAdminService(apiClient),
    dataQuality: createDataQualityService(apiClient),
    bulk: createBulkService(apiClient),
    reporting: createReportingService(apiClient),
    cropActivity: createCropActivityService(apiClient),
  };
};

export default createFarmerService;

// Export types
export * from './types';
export * from './config';

// Export individual service factories for advanced use cases
export { default as createApiClient } from './utils/apiClient';
export { default as createIdentityService } from './services/identityService';
// ... export all service factories
```

### 3.3 Type System Architecture

#### 3.3.1 Modular Type Organization

```typescript
// types/shared.types.ts
export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  request_id?: string;
  timestamp?: string;
  data: T;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  page: number;
  page_size: number;
  total: number;
  total_pages?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: Record<string, unknown>;
  correlation_id?: string;
}

// types/identity.types.ts
export interface FarmerProfileData {
  id: string;
  aaa_user_id?: string;
  aaa_org_id?: string;
  first_name?: string;
  last_name?: string;
  // ... all fields
}

export interface CreateFarmerRequest { /* ... */ }
export interface UpdateFarmerRequest { /* ... */ }
export interface FarmerListQueryParams { /* ... */ }
export type FarmerResponse = BaseResponse<FarmerProfileData>;
export type FarmerListResponse = PaginatedResponse<FarmerProfileData>;

// Similar structure for farm.types.ts, crop.types.ts, etc.
```

**Benefits:**
- Better code organization
- Faster IDE performance
- Easier to find types
- Reduced file size
- Logical grouping

### 3.4 Dependency Injection Pattern

```typescript
// Usage Example 1: Default configuration
const farmerService = createFarmerService({
  baseURL: 'https://api.example.com',
  getAccessToken: () => localStorage.getItem('access_token') || undefined,
});

// Usage Example 2: Custom configuration
const farmerService = createFarmerService({
  baseURL: process.env.FARMER_API_URL,
  timeout: 60000,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  },
  logConfig: {
    enabled: true,
    logLevel: 'debug',
    logRequests: true,
    logResponses: true,
  },
  getAccessToken: () => secureTokenStorage.getToken(),
});

// Usage Example 3: Testing with mocks
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
};

const testService = createIdentityService(mockApiClient);
```

### 3.5 Error Handling Architecture

#### 3.5.1 Error Classification

```typescript
export enum ErrorCode {
  // Network Errors (1xxx)
  NETWORK_ERROR = 1000,
  TIMEOUT_ERROR = 1001,
  ABORTED_ERROR = 1002,

  // Client Errors (4xxx)
  BAD_REQUEST = 4000,
  UNAUTHORIZED = 4001,
  FORBIDDEN = 4003,
  NOT_FOUND = 4004,
  VALIDATION_ERROR = 4022,

  // Server Errors (5xxx)
  INTERNAL_ERROR = 5000,
  SERVICE_UNAVAILABLE = 5003,
  GATEWAY_TIMEOUT = 5004,
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public status?: number,
    public details?: Record<string, unknown>,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

#### 3.5.2 Error Handling Flow

```typescript
const handleApiError = async (response: Response): Promise<never> => {
  let errorBody: any;
  try {
    errorBody = await response.json();
  } catch {
    errorBody = { message: response.statusText };
  }

  const errorCode = mapStatusToErrorCode(response.status);
  const retryable = isRetryableStatusCode(response.status);

  throw new ApiError(
    errorBody.message || errorBody.error || 'API request failed',
    errorCode,
    response.status,
    errorBody.details,
    retryable
  );
};
```

### 3.6 Observability & Logging

#### 3.6.1 Request Logging

```typescript
interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  correlationId: string;
}

interface ResponseLog {
  timestamp: string;
  status: number;
  headers: Record<string, string>;
  body?: unknown;
  duration: number;
  correlationId: string;
}
```

#### 3.6.2 Metrics Collection

```typescript
interface RequestMetrics {
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  retries: number;
  timestamp: number;
}

// Collect metrics for:
// - Request success/failure rates
// - Response times (p50, p95, p99)
// - Retry counts
// - Error rates by endpoint
```

### 3.7 Security Architecture

#### 3.7.1 Token Management

```typescript
interface TokenManager {
  getToken: () => string | undefined;
  refreshToken?: () => Promise<string>;
  onTokenExpired?: () => void;
}

const createApiClient = (config: FarmerServiceConfig & { tokenManager?: TokenManager }) => {
  // Inject token via config
  // Support token refresh
  // Handle 401 responses
};
```

#### 3.7.2 Request Sanitization

```typescript
// Sanitize all request bodies before sending
const sanitizeRequestBody = (body: unknown): unknown => {
  // Remove sensitive fields
  // Validate data types
  // Enforce size limits
};
```

#### 3.7.3 Response Validation

```typescript
// Validate response structure matches expected types
const validateResponse = <T>(response: unknown, schema: Schema<T>): T => {
  // Runtime type checking
  // Detect malformed responses
  // Prevent injection attacks
};
```

### 3.8 Performance Optimizations

#### 3.8.1 Request Deduplication

```typescript
// Prevent duplicate in-flight requests
const requestCache = new Map<string, Promise<unknown>>();

const deduplicateRequest = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (requestCache.has(key)) {
    return requestCache.get(key) as Promise<T>;
  }
  const promise = fetcher().finally(() => requestCache.delete(key));
  requestCache.set(key, promise);
  return promise;
};
```

#### 3.8.2 Response Caching

```typescript
interface CacheConfig {
  ttl: number; // milliseconds
  maxSize: number;
  strategy: 'lru' | 'fifo';
}

// Implement HTTP caching headers support
// - ETag / If-None-Match
// - Last-Modified / If-Modified-Since
// - Cache-Control
```

#### 3.8.3 Bundle Size Optimization

- **Before:** axios (~15KB gzipped)
- **After:** native fetch (0KB - built-in)
- **Savings:** ~15KB gzipped

### 3.9 Testing Architecture

#### 3.9.1 Unit Testing

```typescript
// Example: Testing identity service
describe('IdentityService', () => {
  let mockApiClient: MockApiClient;
  let identityService: ReturnType<typeof createIdentityService>;

  beforeEach(() => {
    mockApiClient = createMockApiClient();
    identityService = createIdentityService(mockApiClient);
  });

  it('should list farmers with pagination', async () => {
    const mockResponse: FarmerListResponse = { /* ... */ };
    mockApiClient.get.mockResolvedValue(mockResponse);

    const result = await identityService.listFarmers({ page: 1, page_size: 10 });

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/api/v1/identity/farmers',
      { params: { page: 1, page_size: 10 } }
    );
    expect(result).toEqual(mockResponse);
  });
});
```

#### 3.9.2 Integration Testing

```typescript
// Test against real API or mock server
describe('Integration: Identity Service', () => {
  let farmerService: ReturnType<typeof createFarmerService>;

  beforeEach(() => {
    farmerService = createFarmerService({
      baseURL: TEST_API_URL,
      getAccessToken: () => TEST_TOKEN,
    });
  });

  it('should create and retrieve farmer', async () => {
    const createRequest: CreateFarmerRequest = { /* ... */ };
    const createResponse = await farmerService.identity.createFarmer(createRequest);

    const farmerId = createResponse.data.id!;
    const getResponse = await farmerService.identity.getFarmerById(farmerId);

    expect(getResponse.data).toMatchObject(createRequest);
  });
});
```

#### 3.9.3 Contract Testing

```typescript
// Validate API contracts using OpenAPI spec
import { validateAgainstSchema } from 'openapi-validator';

describe('Contract Tests', () => {
  it('should match OpenAPI schema for listFarmers', async () => {
    const response = await farmerService.identity.listFarmers();
    const validation = validateAgainstSchema(response, '/api/v1/identity/farmers', 'get');
    expect(validation.errors).toHaveLength(0);
  });
});
```

---

## 4. Migration Strategy

### 4.1 Migration Principles

1. **Incremental Migration**: Migrate one service at a time
2. **Backward Compatibility**: Maintain existing API contracts
3. **Test-First Approach**: Write tests before refactoring
4. **Feature Parity**: Ensure 100% functional equivalence
5. **No Breaking Changes**: Consumers should not need updates
6. **Parallel Running**: Old and new can coexist during migration

### 4.2 Migration Phases

#### Phase 0: Preparation (Week 1)

**Goals:**
- Set up new project structure
- Implement core utilities
- Establish testing infrastructure

**Deliverables:**
1. Project structure scaffolding
2. `config.ts` implementation
3. `utils/apiClient.ts` implementation
4. `utils/errorHandler.ts` implementation
5. `types/shared.types.ts` base types
6. Testing setup (vitest/jest + testing-library)

**Success Criteria:**
- All utilities have 100% test coverage
- API client can make real HTTP requests
- Error handling covers all edge cases

#### Phase 1: Core Services (Weeks 2-3)

**Order of Migration:**

1. **lookupService** (Day 1-2)
   - Simplest service (2 methods)
   - No dependencies
   - Good learning curve

2. **adminService** (Day 3-4)
   - Independent module
   - 4 methods
   - Health check needed for monitoring

3. **dataQualityService** (Day 5-6)
   - 4 methods
   - No service dependencies

4. **identityService** (Day 7-10)
   - Core service
   - 14 methods
   - Most complex method variations

5. **farmService** (Day 11-14)
   - 10 methods
   - Spatial operations
   - Depends on identity

**Migration Steps per Service:**

1. Create `types/{service}.types.ts`
2. Write comprehensive unit tests
3. Implement `services/{service}Service.ts` factory
4. Run tests against existing API
5. Add integration tests
6. Update main factory in `index.ts`
7. Document changes

#### Phase 2: Business Logic Services (Weeks 4-5)

**Order:**

6. **cropService** (Day 15-18)
   - 13 methods
   - Crop & variety management
   - Lookup dependencies

7. **stagesService** (Day 19-21)
   - 10+ methods
   - Master stage data

8. **cropStagesService** (Day 22-23)
   - 5 methods
   - Depends on crop & stages

9. **cropCyclesService** (Day 24-26)
   - 7 methods
   - Depends on crop & farm

10. **activityService** (Day 27-29)
    - 11 methods
    - Depends on crop cycles

11. **cropActivityService** (Day 30)
    - 5 methods
    - Similar to activityService

#### Phase 3: Integration Services (Week 6)

**Order:**

12. **organizationService** (Day 31-32)
    - External AAA service integration
    - 15+ methods
    - Different base URL

13. **fpoService** (Day 33-34)
    - 3 methods
    - FPO management

14. **linkageService** (Day 35)
    - 3 methods
    - Farmer-FPO linkage

15. **kisanSathiService** (Day 36-37)
    - 7 methods
    - KisanSathi management

#### Phase 4: Complex Services (Week 7)

**Order:**

16. **bulkService** (Day 38-40)
    - Complex file upload logic
    - Multiple content types
    - Retry handling

17. **reportingService** (Day 41-42)
    - 5+ methods
    - Export functionality
    - Large response handling

#### Phase 5: Integration & Cleanup (Week 8)

**Tasks:**

1. Update main `index.ts` with all services
2. Create comprehensive integration tests
3. Performance benchmarking
4. Security audit
5. Documentation
6. Migration guide for consumers
7. Deprecation notices for old exports

### 4.3 Service Migration Template

For each service migration:

```typescript
// 1. Create types file
// types/{service}.types.ts
export interface {Service}Data { /* ... */ }
export interface Create{Service}Request { /* ... */ }
export type {Service}Response = BaseResponse<{Service}Data>;

// 2. Create service factory
// services/{service}Service.ts
import { ApiClient } from '../utils/apiClient';
import { /* types */ } from '../types/{service}.types';

const create{Service}Service = (apiClient: ApiClient) => {
  return {
    method1: (params) => apiClient.get(/* ... */),
    method2: (data) => apiClient.post(/* ... */),
    // ... all methods
  };
};

export default create{Service}Service;

// 3. Write tests
// services/__tests__/{service}Service.test.ts
describe('{Service}Service', () => {
  let mockApiClient: MockApiClient;
  let service: ReturnType<typeof create{Service}Service>;

  beforeEach(() => {
    mockApiClient = createMockApiClient();
    service = create{Service}Service(mockApiClient);
  });

  describe('method1', () => {
    it('should call correct endpoint', async () => {
      // Test implementation
    });
  });
});

// 4. Update index.ts
import create{Service}Service from './services/{service}Service';

const createFarmerService = (config) => {
  const apiClient = createApiClient(config);
  return {
    // ...
    {service}: create{Service}Service(apiClient),
  };
};
```

### 4.4 Testing Strategy During Migration

#### 4.4.1 Test Types

1. **Unit Tests**
   - Test service factory functions with mocked API client
   - Verify correct endpoint calls
   - Validate request/response transformations
   - Coverage target: 90%+

2. **Integration Tests**
   - Test against real API or comprehensive mock server
   - Validate end-to-end flows
   - Test error scenarios
   - Coverage target: 80%+

3. **Contract Tests**
   - Validate API responses match OpenAPI spec
   - Detect breaking changes
   - Ensure backward compatibility

4. **Regression Tests**
   - Compare old vs new implementation outputs
   - Run same inputs through both
   - Verify identical results

#### 4.4.2 Test Checklist per Service

- [ ] All methods have unit tests
- [ ] Happy path scenarios covered
- [ ] Error scenarios covered
- [ ] Edge cases tested
- [ ] Type safety verified
- [ ] Request validation tested
- [ ] Response validation tested
- [ ] Integration tests pass
- [ ] Contract tests pass
- [ ] Regression tests pass

### 4.5 Backward Compatibility Strategy

To ensure zero breaking changes:

```typescript
// index.ts - Maintain old exports alongside new
import createFarmerService from './factory';

// New factory pattern (recommended)
export default createFarmerService;

// Legacy class-based exports (deprecated, but maintained)
export class IdentityService {
  private service: ReturnType<typeof createIdentityService>;

  constructor() {
    const apiClient = createApiClient({
      baseURL: getDefaultBaseURL(),
      getAccessToken: () => localStorage.getItem('access_token') || undefined,
    });
    this.service = createIdentityService(apiClient);
  }

  async listFarmers(params?: FarmerListQueryParams) {
    return this.service.listFarmers(params);
  }
  // ... delegate all methods
}

export const identityService = new IdentityService();

// All other legacy exports...
```

**Deprecation Timeline:**
- **v2.0.0**: Introduce new factory pattern, mark old as deprecated
- **v2.x.x**: Support both patterns (6 months)
- **v3.0.0**: Remove legacy class-based exports (breaking change)

### 4.6 Rollback Plan

If critical issues are discovered:

1. **Immediate Rollback (< 1 hour)**
   - Revert to previous version via package manager
   - All old exports still work

2. **Partial Rollback (< 4 hours)**
   - Keep utilities, roll back specific services
   - Modular architecture allows selective rollback

3. **Feature Flag Approach**
   - Use feature flags to toggle between old/new implementations
   - Gradual rollout to production

```typescript
const USE_NEW_SERVICES = process.env.FEATURE_FLAG_NEW_FARMER_SERVICE === 'true';

export const farmerService = USE_NEW_SERVICES
  ? createFarmerService(config)
  : legacyFarmerService;
```

---

## 5. Risk Analysis & Mitigation

### 5.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Functional regression** | Medium | Critical | Comprehensive test suite, parallel testing, gradual rollout |
| **Performance degradation** | Low | High | Benchmark testing, caching strategy, load testing |
| **Type safety gaps** | Low | Medium | Strict TypeScript config, runtime validation, contract tests |
| **Fetch API compatibility** | Low | Low | Polyfill for older environments, feature detection |
| **Error handling gaps** | Medium | High | Comprehensive error scenarios, error boundary testing |
| **Token refresh issues** | Medium | High | Token refresh mechanism, 401 handling, integration tests |

### 5.2 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Production deployment issues** | Low | Critical | Staged rollout, feature flags, immediate rollback capability |
| **Consumer breaking changes** | Medium | High | Maintain backward compatibility, deprecation notices, migration guide |
| **Documentation gaps** | High | Medium | Comprehensive docs, code examples, migration guide |
| **Team knowledge transfer** | Medium | Medium | Pair programming, code reviews, architecture sessions |

### 5.3 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Timeline overrun** | Medium | Medium | Buffer time (20%), prioritize critical services |
| **Resource unavailability** | Low | High | Cross-training, documentation, knowledge sharing |
| **Scope creep** | Medium | Medium | Strict scope definition, change control process |

### 5.4 Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Token exposure** | Low | Critical | Secure token storage, no logging of sensitive data |
| **XSS vulnerabilities** | Low | High | Input sanitization, Content Security Policy |
| **MITM attacks** | Low | Critical | HTTPS enforcement, certificate validation |
| **Rate limiting bypass** | Low | Medium | Respect retry-after headers, exponential backoff |

### 5.5 Mitigation Strategies

#### 5.5.1 Quality Assurance

1. **Automated Testing**
   - Unit test coverage > 90%
   - Integration test coverage > 80%
   - Contract tests for all endpoints
   - Regression tests for critical flows

2. **Code Review Process**
   - Mandatory peer review
   - Architecture review for significant changes
   - Security review checklist

3. **Continuous Integration**
   - Automated tests on every commit
   - Type checking in CI
   - Linting and code quality checks

#### 5.5.2 Deployment Strategy

1. **Staged Rollout**
   - Week 1: Internal testing environment
   - Week 2: Staging environment
   - Week 3: Canary deployment (5% traffic)
   - Week 4: Gradual increase to 100%

2. **Monitoring**
   - Error rate monitoring
   - Response time monitoring
   - Success rate tracking
   - Alert on anomalies

3. **Rollback Mechanism**
   - One-click rollback capability
   - Automated health checks
   - Circuit breaker pattern

#### 5.5.3 Communication Plan

1. **Internal Communication**
   - Weekly progress updates
   - Architecture decision records (ADRs)
   - Knowledge sharing sessions

2. **External Communication**
   - Migration announcement
   - Deprecation notices
   - Migration guide
   - API documentation updates

---

## 6. Implementation Plan

### 6.1 Team Structure

**Recommended Team:**
- 1 x Senior Backend Engineer (Lead)
- 2 x Backend Engineers
- 1 x QA Engineer
- 1 x DevOps Engineer (part-time)

**Estimated Effort:**
- Total: 8 weeks (320 hours)
- Per engineer: 40 days

### 6.2 Detailed Timeline

#### Week 1: Foundation
- [ ] Project scaffolding
- [ ] Core utilities implementation
- [ ] Testing infrastructure setup
- [ ] CI/CD pipeline setup
- [ ] Documentation framework

#### Week 2-3: Core Services
- [ ] Migrate lookupService
- [ ] Migrate adminService
- [ ] Migrate dataQualityService
- [ ] Migrate identityService
- [ ] Migrate farmService

#### Week 4-5: Business Logic Services
- [ ] Migrate cropService
- [ ] Migrate stagesService
- [ ] Migrate cropStagesService
- [ ] Migrate cropCyclesService
- [ ] Migrate activityService
- [ ] Migrate cropActivityService

#### Week 6: Integration Services
- [ ] Migrate organizationService
- [ ] Migrate fpoService
- [ ] Migrate linkageService
- [ ] Migrate kisanSathiService

#### Week 7: Complex Services
- [ ] Migrate bulkService
- [ ] Migrate reportingService

#### Week 8: Integration & Cleanup
- [ ] Comprehensive integration tests
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation completion
- [ ] Migration guide
- [ ] Release preparation

### 6.3 Milestones

| Milestone | Date | Deliverable |
|-----------|------|-------------|
| M1: Foundation Complete | Week 1 | Core utilities, testing infrastructure |
| M2: Core Services | Week 3 | 5 services migrated |
| M3: Business Logic | Week 5 | 11 services migrated |
| M4: All Services | Week 7 | All 17 services migrated |
| M5: Production Ready | Week 8 | Testing, docs, release |

### 6.4 Success Criteria

**Technical Criteria:**
- [ ] All 17 services migrated
- [ ] Test coverage > 85%
- [ ] Zero breaking changes
- [ ] Performance within 5% of baseline
- [ ] Bundle size reduced by 15KB+
- [ ] All CI/CD checks passing

**Quality Criteria:**
- [ ] Code review approval for all changes
- [ ] Documentation complete
- [ ] Migration guide published
- [ ] Security audit passed

**Business Criteria:**
- [ ] Timeline met (within 20% buffer)
- [ ] Zero production incidents
- [ ] Positive developer feedback
- [ ] Adoption rate > 80% within 3 months

---

## 7. Testing Strategy

### 7.1 Test Pyramid

```
        E2E Tests (5%)
       /            \
      /              \
  Integration Tests  \
    (15%)             \
   /                   \
  /                     \
Unit Tests (80%)        Contract Tests
```

### 7.2 Unit Testing

**Framework:** Vitest (or Jest)

**Coverage Targets:**
- Statements: 90%
- Branches: 85%
- Functions: 90%
- Lines: 90%

**Test Structure:**
```typescript
describe('IdentityService', () => {
  describe('listFarmers', () => {
    it('should call correct endpoint with params', async () => {});
    it('should handle pagination correctly', async () => {});
    it('should handle empty results', async () => {});
    it('should throw error on network failure', async () => {});
  });
});
```

### 7.3 Integration Testing

**Approach:**
- Real API calls to staging environment
- Mock server for CI/CD (MSW - Mock Service Worker)

**Test Scenarios:**
- CRUD operations
- Complex workflows
- Error handling
- Retry logic
- Timeout handling

### 7.4 Contract Testing

**Tools:** Pact or OpenAPI validator

**Purpose:**
- Ensure API responses match OpenAPI spec
- Detect breaking changes
- Validate request/response schemas

### 7.5 Performance Testing

**Metrics:**
- Response times (p50, p95, p99)
- Request success rate
- Error rate
- Retry count

**Tools:**
- k6 or Artillery for load testing
- Lighthouse for bundle size analysis

### 7.6 Security Testing

**Checklist:**
- [ ] Token handling secure
- [ ] No sensitive data in logs
- [ ] Input validation
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting compliance

---

## 8. Appendices

### Appendix A: Service Migration Checklist

For each service:

**Pre-Migration:**
- [ ] Document existing endpoints
- [ ] List all methods
- [ ] Identify dependencies
- [ ] Review error scenarios
- [ ] Check for special logic

**Implementation:**
- [ ] Create type definitions
- [ ] Implement service factory
- [ ] Write unit tests
- [ ] Verify endpoint correctness
- [ ] Test error handling
- [ ] Add integration tests

**Validation:**
- [ ] Code review completed
- [ ] Tests passing
- [ ] Contract tests passing
- [ ] Documentation updated
- [ ] Migration notes added

**Deployment:**
- [ ] Merged to main
- [ ] Deployed to staging
- [ ] Smoke tests passed
- [ ] Deployed to production
- [ ] Monitoring enabled

### Appendix B: API Client Comparison

| Feature | Current (Axios) | Target (Fetch) |
|---------|-----------------|----------------|
| HTTP Methods | ✅ | ✅ |
| Interceptors | ✅ (built-in) | ✅ (custom) |
| Request Cancellation | ✅ (cancel token) | ✅ (AbortController) |
| Timeout | ✅ (built-in) | ✅ (AbortSignal) |
| Retry Logic | ❌ (manual) | ✅ (built-in) |
| Error Handling | ⚠️ (inconsistent) | ✅ (unified) |
| TypeScript Support | ✅ | ✅ |
| Bundle Size | ~15KB gzipped | 0KB (native) |
| Browser Support | All modern | All modern |

### Appendix C: Error Code Reference

| Code | Name | HTTP Status | Retryable |
|------|------|-------------|-----------|
| 1000 | NETWORK_ERROR | N/A | Yes |
| 1001 | TIMEOUT_ERROR | 408 | Yes |
| 1002 | ABORTED_ERROR | N/A | No |
| 4000 | BAD_REQUEST | 400 | No |
| 4001 | UNAUTHORIZED | 401 | No* |
| 4003 | FORBIDDEN | 403 | No |
| 4004 | NOT_FOUND | 404 | No |
| 4022 | VALIDATION_ERROR | 422 | No |
| 5000 | INTERNAL_ERROR | 500 | Yes |
| 5003 | SERVICE_UNAVAILABLE | 503 | Yes |
| 5004 | GATEWAY_TIMEOUT | 504 | Yes |

*Can retry after token refresh

### Appendix D: Configuration Examples

#### Development Environment
```typescript
const farmerService = createFarmerService({
  baseURL: 'http://localhost:8000',
  getAccessToken: () => localStorage.getItem('dev_token') || undefined,
  timeout: 30000,
  logConfig: {
    enabled: true,
    logLevel: 'debug',
    logRequests: true,
    logResponses: true,
  },
});
```

#### Production Environment
```typescript
const farmerService = createFarmerService({
  baseURL: process.env.FARMER_API_URL!,
  getAccessToken: () => secureTokenStorage.getToken(),
  timeout: 60000,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  },
  logConfig: {
    enabled: true,
    logLevel: 'error',
    logRequests: false,
    logResponses: false,
  },
});
```

#### Testing Environment
```typescript
const farmerService = createFarmerService({
  baseURL: 'http://mock-api.test',
  getAccessToken: () => 'test-token',
  timeout: 5000,
  logConfig: {
    enabled: false,
  },
});
```

### Appendix E: Performance Benchmarks

Target performance metrics:

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Initial Load Time | 250ms | 220ms | -12% |
| Bundle Size | 85KB | 70KB | -18% |
| API Call Overhead | 50ms | 45ms | -10% |
| Memory Usage | 12MB | 10MB | -17% |

### Appendix F: Glossary

**Terms:**
- **Factory Function**: A function that returns an object with methods
- **Dependency Injection**: Passing dependencies as parameters rather than hard-coding them
- **API Client**: A wrapper around HTTP client functionality
- **Singleton**: A single instance of a class/object shared globally
- **Interceptor**: Middleware that runs before/after HTTP requests
- **Retry Logic**: Automatic retry of failed requests with backoff
- **Type Guards**: Runtime checks that TypeScript can use for type narrowing

### Appendix G: References

**External Documentation:**
- [Fetch API Specification](https://fetch.spec.whatwg.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

**Internal Documentation:**
- Auth Service Implementation (~/auth-service)
- Farmers API Specification (OpenAPI)
- Testing Standards Document
- Security Guidelines

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-12 | SDE-3 Backend Architect | Initial comprehensive design |

**Review Status:** Draft - Pending Review
**Next Review Date:** 2025-11-15

---

**End of Document**
