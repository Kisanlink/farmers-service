# Farmers Service - Complete Service Inventory

**Date:** 2025-11-12
**Status:** Analysis Complete

---

## Service Breakdown

### 1. identityService.ts (373 lines)

**Purpose:** Farmer identity and profile management

**Base Path:** `/api/v1/identity`

**Methods (14):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listFarmers | `/farmers` | GET | List farmers with filtering |
| createFarmer | `/farmers` | POST | Create new farmer profile |
| getFarmerById | `/farmers/id/{farmerId}` | GET | Get farmer by primary key |
| updateFarmerById | `/farmers/id/{farmerId}` | PUT | Update farmer by primary key |
| deleteFarmerById | `/farmers/id/{farmerId}` | DELETE | Delete farmer by primary key |
| getFarmerByUserId | `/farmers/user/{userId}` | GET | Get farmer by AAA user ID |
| updateFarmerByUserId | `/farmers/user/{userId}` | PUT | Update farmer by AAA user ID |
| deleteFarmerByUserId | `/farmers/user/{userId}` | DELETE | Delete farmer by AAA user ID |
| getFarmerByUserIdAndOrgId | `/farmers/user/{userId}/org/{orgId}` | GET | Get farmer by user ID + org ID |
| updateFarmerByUserIdAndOrgId | `/farmers/user/{userId}/org/{orgId}` | PUT | Update farmer by user ID + org ID |
| deleteFarmerByUserIdAndOrgId | `/farmers/user/{userId}/org/{orgId}` | DELETE | Delete farmer by user ID + org ID |
| linkFarmerToFPO | `/farmers/link` | POST | Link farmer to FPO organization |
| getFarmerLinkageStatus | `/farmers/link/user/{userId}/org/{orgId}` | GET | Check farmer-FPO linkage |
| unlinkFarmerFromFPO | `/farmers/link/user/{userId}/org/{orgId}` | DELETE | Unlink farmer from FPO |

**Dependencies:**
- None (core service)

**Special Features:**
- Multiple ID lookup patterns (farmer_id, user_id, user_id+org_id)
- FPO linkage management
- KisanSathi reassignment

**Authentication:**
- Uses axios interceptors to inject Bearer token from localStorage
- Checks multiple token keys: access_token, token, authToken, jwt

**Migration Complexity:** High
- Many endpoint variations
- Complex ID resolution logic
- Critical service (used by most others)

---

### 2. farmService.ts (361 lines)

**Purpose:** Farm land parcel management with spatial operations

**Base Path:** `/api/v1`

**Methods (10):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listFarms | `/farms` | GET | List farms with filtering |
| createFarm | `/farms` | POST | Create new farm with geometry |
| getFarmById | `/farms/{farmId}` | GET | Get farm details |
| updateFarm | `/farms/{farmId}` | PUT | Update farm data |
| deleteFarm | `/farms/{farmId}` | DELETE | Soft delete farm |
| getFarmCentroids | `/getFarmCentroids` | GET | Get centroids for map display |
| getFarmHeatmap | `/getFarmHeatmap` | GET | Get heatmap data |
| detectFarmOverlaps | `/detectFarmOverlaps` | POST | Detect overlapping geometries |
| validateGeometry | `/validateGeometry` | POST | Validate WKT geometry |
| rebuildSpatialIndexes | `/rebuildSpatialIndexes` | POST | Admin: rebuild spatial indexes |

**Dependencies:**
- identityService (farmer_id references)

**Special Features:**
- GIS/spatial operations
- Geometry validation (WKT, WKB formats)
- Overlap detection
- Spatial indexing

**Data Structures:**
- GeometryData with WKT and WKB support
- Irrigation sources (multiple)
- Soil type references

**Migration Complexity:** Medium
- Spatial operations need careful testing
- Large geometry payloads
- Admin operations require special handling

---

### 3. activityService.ts (403 lines)

**Purpose:** Farm activity lifecycle and workflow management

**Base Path:** `/api/v1/crops`

**Methods (11):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listActivities | `/activities` | GET | List activities with filtering |
| createActivity | `/activities` | POST | Create planned activity |
| getActivityById | `/activities/{activityId}` | GET | Get activity details |
| updateActivity | `/activities/{activityId}` | PUT | Update activity |
| deleteActivity | `/activities/{activityId}` | DELETE | Delete activity |
| completeActivity | `/activities/{activityId}/complete` | POST | Mark activity as completed |
| getActivitiesByCropCycle | `/activities?crop_cycle_id={id}` | GET | Filter by crop cycle |
| getActivitiesByType | `/activities?activity_type={type}` | GET | Filter by type |
| getActivitiesByStatus | `/activities?status={status}` | GET | Filter by status |
| getActivitiesByDateRange | `/activities?date_from=&date_to=` | GET | Filter by date range |
| getPendingActivities | `/activities?status=pending` | GET | Get pending activities |
| getCompletedActivities | `/activities?status=completed` | GET | Get completed activities |
| getOverdueActivities | `/activities?status=pending&date_to={today}` | GET | Get overdue activities |

**Dependencies:**
- cropCyclesService (crop_cycle_id)
- cropStagesService (crop_stage_id)

**Special Features:**
- Rich filtering options
- Date range queries
- Status tracking (pending, completed, overdue)
- Completion workflow with outcomes

**Migration Complexity:** Medium
- Many query parameter combinations
- Date handling logic
- Status transitions

---

### 4. cropService.ts (494 lines)

**Purpose:** Master crop data and variety management

**Base Path:** `/api/v1`

**Methods (13):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listCrops | `/crops` | GET | List crops with pagination |
| getCropLookup | `/lookups/crops` | GET | Lightweight crop list |
| createCrop | `/crops` | POST | Create new crop |
| getCropById | `/crops/{id}` | GET | Get crop details |
| updateCrop | `/crops/{id}` | PUT | Update crop |
| deleteCrop | `/crops/{id}` | DELETE | Soft delete crop |
| getCropCategories | `/lookups/crop-categories` | GET | Get category list |
| getCropSeasons | `/lookups/crop-seasons` | GET | Get season list |
| listVarieties | `/varieties` | GET | List crop varieties |
| getVarietyLookup | `/lookups/varieties/{cropId}` | GET | Get varieties for crop |
| createVariety | `/varieties` | POST | Create new variety |
| getVarietyById | `/varieties/{id}` | GET | Get variety details |
| updateVariety | `/varieties/{id}` | PUT | Update variety |
| deleteVariety | `/varieties/{id}` | DELETE | Soft delete variety |

**Dependencies:**
- lookupService (categories, seasons)

**Special Features:**
- Perennial crop support with yield by age
- Variety management
- Lookup data caching opportunity
- Properties as string key-value pairs

**Data Transformations:**
- Properties object → string values (backend requirement)
- Metadata → JSON string

**Migration Complexity:** Medium-High
- Two entity types (crops + varieties)
- Complex data structures (perennial_yield, yield_by_age)
- Data transformation logic

---

### 5. cropCyclesService.ts (~300 lines)

**Purpose:** Crop cycle lifecycle management

**Base Path:** `/api/v1/crops`

**Methods (7):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listCropCycles | `/cycles` | GET | List crop cycles |
| createCropCycle | `/cycles` | POST | Start new crop cycle |
| getCropCycleById | `/cycles/{cycleId}` | GET | Get cycle details |
| updateCropCycle | `/cycles/{cycleId}` | PUT | Update cycle |
| endCropCycle | `/cycles/{cycleId}/end` | PUT | End cycle with outcome |
| deleteCropCycle | `/cycles/{cycleId}` | DELETE | Delete cycle |

**Dependencies:**
- farmService (farm_id)
- cropService (crop_id, variety_id)

**Special Features:**
- Lifecycle states (PLANNED, ACTIVE, COMPLETED, CANCELLED)
- Season tracking (RABI, KHARIF, ZAID, PERENNIAL)
- Outcome recording
- Area tracking (area_ha)

**Migration Complexity:** Medium
- State machine logic
- Season validation
- Perennial crop handling

---

### 6. cropStagesService.ts (111 lines)

**Purpose:** Assign and manage stages for specific crops

**Base Path:** `/api/v1/crops`

**Methods (5):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listCropStages | `/crops/{cropId}/stages` | GET | Get stages for crop |
| assignStageToCrop | `/crops/{cropId}/stages` | POST | Assign stage to crop |
| reorderCropStages | `/crops/{cropId}/stages/reorder` | POST | Change stage order |
| updateCropStage | `/crops/{cropId}/stages/{stageId}` | PUT | Update stage assignment |
| removeCropStage | `/crops/{cropId}/stages/{stageId}` | DELETE | Remove stage from crop |

**Dependencies:**
- cropService (crop_id)
- stagesService (stage_id)

**Special Features:**
- Stage ordering/sequencing
- Duration configuration per crop
- Duration units (DAYS, WEEKS, MONTHS)

**Migration Complexity:** Low-Medium
- Simple CRUD operations
- Ordering logic straightforward

---

### 7. stagesService.ts (~300 lines)

**Purpose:** Master stage data management

**Base Path:** `/api/v1`

**Methods (10+):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listStages | `/stages` | GET | List all stages |
| getStageLookup | `/lookups/stages` | GET | Lightweight stage list |
| createStage | `/stages` | POST | Create new stage |
| getStageById | `/stages/{id}` | GET | Get stage details |
| updateStage | `/stages/{id}` | PUT | Update stage |
| deleteStage | `/stages/{id}` | DELETE | Soft delete stage |

**Dependencies:**
- None (master data)

**Special Features:**
- Lookup data
- Stage descriptions
- Metadata storage

**Migration Complexity:** Low
- Standard CRUD
- Simple data model

---

### 8. lookupService.ts (81 lines)

**Purpose:** Reference data and lookup values

**Base Path:** `/api/v1/lookups`

**Methods (2):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| getIrrigationSources | `/irrigation-sources` | GET | List irrigation sources |
| getSoilTypes | `/soil-types` | GET | List soil types |

**Dependencies:**
- None

**Special Features:**
- Static/semi-static data
- Can be cached aggressively

**Migration Complexity:** Very Low
- Only GET requests
- Simple data structures
- Perfect for starting migration

---

### 9. organizationService.ts (~400 lines)

**Purpose:** Organization and group hierarchy management

**Base Path:** `/api/v2` (AAA Service)

**Note:** This service connects to an external AAA service, not the farmer module backend.

**Methods (15+):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listOrganizations | `/organizations` | GET | List organizations |
| getOrganizationById | `/organizations/{id}` | GET | Get org details |
| createOrganization | `/organizations` | POST | Create organization |
| updateOrganization | `/organizations/{id}` | PUT | Update organization |
| deleteOrganization | `/organizations/{id}` | DELETE | Delete organization |
| listGroups | `/organizations/{orgId}/groups` | GET | List groups in org |
| getGroupById | `/organizations/{orgId}/groups/{groupId}` | GET | Get group details |
| createGroup | `/organizations/{orgId}/groups` | POST | Create group |
| updateGroup | `/organizations/{orgId}/groups/{groupId}` | PUT | Update group |
| deleteGroup | `/organizations/{orgId}/groups/{groupId}` | DELETE | Delete group |
| listRoles | `/roles` | GET | List roles |
| assignRoleToGroup | `/organizations/{orgId}/groups/{groupId}/roles` | POST | Assign role |
| listGroupRoles | `/organizations/{orgId}/groups/{groupId}/roles` | GET | List group roles |
| removeRoleFromGroup | `/organizations/{orgId}/groups/{groupId}/roles/{roleId}` | DELETE | Remove role |

**Dependencies:**
- External AAA service

**Special Configuration:**
- Different base URL (VITE_AAA_SERVICE_ENDPOINT)
- Separate authentication

**Migration Complexity:** Medium
- External service integration
- Different base URL handling
- Hierarchical data structures

---

### 10. fpoService.ts (97 lines)

**Purpose:** FPO (Farmer Producer Organization) management

**Base Path:** `/api/v1/identity/fpo`

**Methods (3):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| createFPO | `/create` | POST | Create FPO with CEO user |
| registerFPO | `/register` | POST | Register FPO reference |
| getFPOReference | `/reference/{aaaOrgId}` | GET | Get FPO by org ID |

**Dependencies:**
- organizationService (creates org in AAA)
- identityService (CEO user creation)

**Special Features:**
- Creates organization in external AAA service
- Creates CEO user
- Sets up default groups and permissions

**Migration Complexity:** Medium
- Multi-step workflow
- External service coordination
- Transaction-like behavior

---

### 11. linkageService.ts (84 lines)

**Purpose:** Farmer-to-FPO linkage management

**Base Path:** `/identity`

**Methods (3):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| linkFarmer | `/link-farmer` | POST | Link farmer to FPO |
| unlinkFarmer | `/unlink-farmer` | POST | Unlink farmer from FPO |
| getFarmerLinkage | `/linkage/{farmerId}/{orgId}` | GET | Get linkage status |

**Dependencies:**
- identityService (farmer_id)
- fpoService (org_id)

**Special Features:**
- Linkage types (MEMBER, ASSOCIATE, SUPPLIER)
- Status tracking (ACTIVE, INACTIVE)
- Linkage date recording

**Migration Complexity:** Low
- Simple CRUD operations
- Clear data model

---

### 12. kisanSathiService.ts (~150 lines)

**Purpose:** KisanSathi (field agent) management and assignment

**Base Path:** `/api/v1/kisansathi`

**Methods (7):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| createKisanSathi | `/create-user` | POST | Create KisanSathi user |
| assignKisanSathi | `/assign` | POST | Assign to farmer |
| reassignKisanSathi | `/reassign` | POST | Reassign or remove |
| getKisanSathiAssignment | `/assignment/{farmerId}/{orgId}` | GET | Get assignment |
| getAllKisanSathis | `/` | GET | List all KisanSathis |
| getKisanSathiById | `/{id}` | GET | Get by ID |
| updateKisanSathi | `/{id}` | PUT | Update details |

**Dependencies:**
- identityService (farmer_id)

**Special Features:**
- Assignment tracking
- Reassignment workflow
- Geographic coverage (state, district, block, village)

**Migration Complexity:** Low-Medium
- Standard CRUD
- Assignment logic straightforward

---

### 13. adminService.ts (99 lines)

**Purpose:** System administration and monitoring

**Base Path:** `/admin`

**Methods (4):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| getHealthStatus | `/health` | GET | Health check |
| seedRolesAndPermissions | `/seed` | POST | Seed initial data |
| checkUserPermission | `/permissions/check` | POST | Validate permission |
| getAuditTrail | `/audit` | GET | Query audit logs |

**Dependencies:**
- None (system-level)

**Special Features:**
- Health check for monitoring
- Permission validation
- Audit trail access
- Data seeding

**Migration Complexity:** Low
- Simple endpoints
- Critical for monitoring
- Should migrate early

---

### 14. dataQualityService.ts (96 lines)

**Purpose:** Data validation and quality checks

**Base Path:** `/api/v1/data-quality`

**Methods (4):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| validateGeometry | `/validate-geometry` | POST | Validate farm geometry |
| detectFarmOverlaps | `/detect-farm-overlaps` | POST | Find overlapping farms |
| reconcileAAALinks | `/reconcile-aaa-links` | POST | Sync AAA linkages |
| rebuildSpatialIndexes | `/rebuild-spatial-indexes` | POST | Rebuild spatial indexes |

**Dependencies:**
- farmService (geometry operations)

**Special Features:**
- Geometry validation
- Data reconciliation
- Spatial operations
- Admin utilities

**Migration Complexity:** Low-Medium
- POST-only operations
- Complex payloads but simple API

---

### 15. bulkService.ts (~300 lines)

**Purpose:** Bulk farmer upload and batch operations

**Base Path:** `/api/v1/bulk`

**Methods (3):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| bulkAddFarmers | `/farmers/add` | POST | Bulk add farmers from file |
| downloadBulkTemplate | `/template` | GET | Download CSV template |
| validateBulkData | `/validate` | POST | Validate bulk data |

**Dependencies:**
- identityService (creates farmers)
- fpoService (org_id)

**Special Features:**
- File upload (CSV, Excel, JSON)
- Multiple content types (multipart, urlencoded)
- Async processing
- Validation workflow
- Progress tracking
- Error reporting

**Migration Complexity:** High
- File upload handling
- Multiple content types
- Retry logic for failed requests
- Complex error scenarios

---

### 16. reportingService.ts (~300 lines)

**Purpose:** Analytics, exports, and reporting

**Base Path:** `/api/v1/reports`

**Methods (5+):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| exportFarmerPortfolio | `/farmer-portfolio` | POST | Export farmer data |
| exportFarmerPortfolioById | `/farmer-portfolio/{farmerId}` | GET | Export by ID |
| getOrgDashboardCounters | `/org-dashboard-counters` | POST | Dashboard metrics |
| getFarmerAnalytics | `/farmer-analytics` | GET | Farmer analytics |
| getFarmPerformanceReport | `/farm-performance` | GET | Farm performance |

**Dependencies:**
- All services (aggregates data)

**Special Features:**
- Multiple export formats (JSON, CSV)
- Date range filtering
- Season filtering
- Dashboard aggregations

**Migration Complexity:** Medium
- Large response payloads
- Complex aggregations
- Multiple export formats

---

### 17. cropActivityService.ts (116 lines)

**Purpose:** Crop-specific activity operations

**Base Path:** `/crops`

**Methods (5):**

| Method | Endpoint | HTTP | Purpose |
|--------|----------|------|---------|
| listCropActivities | `/activities` | GET | List activities |
| createCropActivity | `/activities` | POST | Create activity |
| getCropActivityById | `/activities/{activityId}` | GET | Get activity |
| updateCropActivity | `/activities/{activityId}` | PUT | Update activity |
| completeCropActivity | `/activities/{activityId}/complete` | POST | Complete activity |

**Dependencies:**
- cropCyclesService (crop_cycle_id)

**Special Features:**
- Similar to activityService but crop-focused
- Activity completion workflow

**Migration Complexity:** Low
- Duplicates some activityService functionality
- Simple CRUD

---

## Summary Statistics

### Service Complexity Classification

**Low Complexity (6 services):**
- lookupService (2 methods)
- adminService (4 methods)
- linkageService (3 methods)
- kisanSathiService (7 methods)
- cropStagesService (5 methods)
- stagesService (6 methods)
- dataQualityService (4 methods)
- cropActivityService (5 methods)

**Medium Complexity (7 services):**
- farmService (10 methods, spatial ops)
- activityService (11 methods, many filters)
- cropCyclesService (7 methods, lifecycle)
- organizationService (15 methods, external)
- fpoService (3 methods, multi-step)
- reportingService (5+ methods, exports)

**High Complexity (3 services):**
- identityService (14 methods, multiple ID patterns)
- cropService (13 methods, two entities)
- bulkService (3 methods, file upload)

### Migration Order Recommendation

**Phase 1 - Foundation (Week 1):**
1. lookupService (simplest, no dependencies)
2. adminService (needed for health checks)
3. dataQualityService (standalone)

**Phase 2 - Core (Week 2-3):**
4. identityService (core, needed by others)
5. farmService (depends on identity)
6. stagesService (master data)

**Phase 3 - Business Logic (Week 4-5):**
7. cropService (master data)
8. cropStagesService (depends on crop + stages)
9. cropCyclesService (depends on crop + farm)
10. activityService (depends on crop cycles)
11. cropActivityService (similar to activity)

**Phase 4 - Integration (Week 6):**
12. organizationService (external service)
13. fpoService (depends on organization)
14. linkageService (depends on identity + fpo)
15. kisanSathiService (depends on identity)

**Phase 5 - Complex (Week 7):**
16. bulkService (file upload complexity)
17. reportingService (aggregation complexity)

---

## Total Endpoint Count

**By Module:**
- Identity: 14 endpoints
- Farm: 10 endpoints
- Crop: 16 endpoints (crops + varieties + cycles + stages)
- Activity: 11 endpoints
- Lookup: 6 endpoints
- FPO & Linkage: 6 endpoints
- KisanSathi: 7 endpoints
- Admin & Data Quality: 9 endpoints
- Bulk & Reporting: 5 endpoints

**Total: 84+ unique API endpoints**

---

## Type Definition Statistics

From types.ts (908 lines):

**Core Data Types:** 15
- FarmerProfileData
- FarmData
- CropCycleData
- FarmActivityData
- KisanSathiUserData
- BulkOperationData
- etc.

**Request Types:** 30+
- Create/Update/Delete variants
- Query parameter types
- Specialized request types

**Response Types:** 25+
- Single entity responses
- List responses with pagination
- Specialized responses

**Utility Types:** 10+
- BaseResponse
- ErrorResponse
- PaginatedResponse
- etc.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-12
