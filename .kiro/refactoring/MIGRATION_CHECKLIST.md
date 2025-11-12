# Farmers Service Migration Checklist

**Version:** 1.0.0
**Date:** 2025-11-12
**Purpose:** Track migration progress and ensure completeness

---

## Pre-Migration Setup

### Phase 0: Foundation Setup

- [ ] **Project Structure**
  - [ ] Create new directory structure
  - [ ] Set up config.ts
  - [ ] Create types/ directory
  - [ ] Create utils/ directory
  - [ ] Create services/ directory

- [ ] **Core Utilities**
  - [ ] Implement apiClient.ts with fetch
    - [ ] HTTP methods (GET, POST, PUT, DELETE, PATCH)
    - [ ] Request/response interceptors
    - [ ] Error handling
    - [ ] Retry logic with exponential backoff
    - [ ] Timeout handling
    - [ ] AbortController support
    - [ ] Request deduplication
    - [ ] Logging integration
  - [ ] Implement errorHandler.ts
    - [ ] ApiError class
    - [ ] Error code enum
    - [ ] Error transformation
    - [ ] Retry decision logic
  - [ ] Implement validators.ts (optional)
    - [ ] Input validation helpers
    - [ ] Response validation

- [ ] **Testing Infrastructure**
  - [ ] Set up testing framework (Vitest/Jest)
  - [ ] Create test utilities
    - [ ] Mock API client factory
    - [ ] Test fixtures
    - [ ] Test helpers
  - [ ] Configure coverage thresholds
  - [ ] Set up MSW (Mock Service Worker) for integration tests

- [ ] **CI/CD Pipeline**
  - [ ] Configure GitHub Actions / GitLab CI
  - [ ] Add linting (ESLint)
  - [ ] Add type checking (tsc)
  - [ ] Add test execution
  - [ ] Add coverage reporting
  - [ ] Add build verification

- [ ] **Documentation Framework**
  - [ ] Set up documentation structure
  - [ ] Create migration guide template
  - [ ] Create API reference template

---

## Service Migration Tracker

### Phase 1: Simple Services (Week 1)

#### 1. lookupService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (2)
  - [ ] Identify dependencies (none)
  - [ ] Review error scenarios

- [ ] **Type Definitions**
  - [ ] Create types/lookup.types.ts
  - [ ] Define LookupItem interface
  - [ ] Define LookupDataResponse interface
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/lookupService.ts
  - [ ] Implement createLookupService factory
  - [ ] Implement getIrrigationSources
  - [ ] Implement getSoilTypes
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests
    - [ ] Test getIrrigationSources
    - [ ] Test getSoilTypes
    - [ ] Test error handling
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging
  - [ ] Smoke tests passed

---

#### 2. adminService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (4)
  - [ ] Identify dependencies (none)
  - [ ] Review error scenarios

- [ ] **Type Definitions**
  - [ ] Create types/admin.types.ts
  - [ ] Define HealthCheckResponse
  - [ ] Define SeedRequest/Response
  - [ ] Define PermissionCheckRequest/Response
  - [ ] Define AuditQueryParams/Response
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/adminService.ts
  - [ ] Implement createAdminService factory
  - [ ] Implement getHealthStatus
  - [ ] Implement seedRolesAndPermissions
  - [ ] Implement checkUserPermission
  - [ ] Implement getAuditTrail
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Write integration tests
  - [ ] Test health check endpoint specifically
  - [ ] Test pagination in audit trail
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging
  - [ ] Configure monitoring alerts based on health endpoint

---

#### 3. dataQualityService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (4)
  - [ ] Identify dependencies (none)
  - [ ] Review error scenarios

- [ ] **Type Definitions**
  - [ ] Create types/dataQuality.types.ts
  - [ ] Define ValidateGeometryRequest/Response
  - [ ] Define DetectOverlapsRequest/Response
  - [ ] Define ReconcileAAALinksRequest/Response
  - [ ] Define RebuildSpatialIndexesRequest/Response
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/dataQualityService.ts
  - [ ] Implement createDataQualityService factory
  - [ ] Implement validateGeometry
  - [ ] Implement detectFarmOverlaps
  - [ ] Implement reconcileAAALinks
  - [ ] Implement rebuildSpatialIndexes
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Write integration tests
  - [ ] Test geometry validation edge cases
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

### Phase 2: Core Services (Week 2-3)

#### 4. identityService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (14)
  - [ ] Identify dependencies (none)
  - [ ] Review ID resolution patterns
  - [ ] Document token retrieval logic

- [ ] **Type Definitions**
  - [ ] Create types/identity.types.ts
  - [ ] Define FarmerProfileData
  - [ ] Define AddressData
  - [ ] Define CreateFarmerRequest
  - [ ] Define UpdateFarmerRequest
  - [ ] Define FarmerListQueryParams
  - [ ] Define LinkFarmerRequest
  - [ ] Define UnlinkFarmerRequest
  - [ ] Define ReassignKisanSathiRequest
  - [ ] Define FarmerResponse
  - [ ] Define FarmerListResponse
  - [ ] Define FarmerLinkageResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/identityService.ts
  - [ ] Implement createIdentityService factory
  - [ ] Implement listFarmers
  - [ ] Implement createFarmer
  - [ ] Implement getFarmerById
  - [ ] Implement updateFarmerById
  - [ ] Implement deleteFarmerById
  - [ ] Implement getFarmerByUserId
  - [ ] Implement updateFarmerByUserId
  - [ ] Implement deleteFarmerByUserId
  - [ ] Implement getFarmerByUserIdAndOrgId
  - [ ] Implement updateFarmerByUserIdAndOrgId
  - [ ] Implement deleteFarmerByUserIdAndOrgId
  - [ ] Implement linkFarmerToFPO
  - [ ] Implement getFarmerLinkageStatus
  - [ ] Implement unlinkFarmerFromFPO
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all 14 methods)
  - [ ] Test pagination
  - [ ] Test multiple ID patterns
  - [ ] Test linkage operations
  - [ ] Test error handling
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging
  - [ ] Critical: Test thoroughly (core service)

---

#### 5. farmService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (10)
  - [ ] Identify dependencies (identityService)
  - [ ] Review spatial operations
  - [ ] Document geometry handling

- [ ] **Type Definitions**
  - [ ] Create types/farm.types.ts
  - [ ] Define FarmData
  - [ ] Define GeometryData
  - [ ] Define IrrigationSourceRequest
  - [ ] Define CreateFarmRequest
  - [ ] Define FarmListQueryParams
  - [ ] Define FarmResponse
  - [ ] Define FarmListResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/farmService.ts
  - [ ] Implement createFarmService factory
  - [ ] Implement listFarms
  - [ ] Implement createFarm
  - [ ] Implement getFarmById
  - [ ] Implement updateFarm
  - [ ] Implement deleteFarm
  - [ ] Implement getFarmCentroids
  - [ ] Implement getFarmHeatmap
  - [ ] Implement detectFarmOverlaps
  - [ ] Implement validateGeometry
  - [ ] Implement rebuildSpatialIndexes
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test geometry validation
  - [ ] Test spatial operations
  - [ ] Test area filtering
  - [ ] Test overlap detection
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Spatial operations verified
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 6. stagesService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (6+)
  - [ ] Identify dependencies (none)

- [ ] **Type Definitions**
  - [ ] Create types/stages.types.ts
  - [ ] Define StageData
  - [ ] Define StageLookupData
  - [ ] Define CreateStageRequest
  - [ ] Define UpdateStageRequest
  - [ ] Define StageResponse
  - [ ] Define StageListResponse
  - [ ] Define StageLookupResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/stagesService.ts
  - [ ] Implement createStagesService factory
  - [ ] Implement listStages
  - [ ] Implement getStageLookup
  - [ ] Implement createStage
  - [ ] Implement getStageById
  - [ ] Implement updateStage
  - [ ] Implement deleteStage
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

### Phase 3: Business Logic Services (Week 4-5)

#### 7. cropService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (13)
  - [ ] Identify dependencies (lookupService)
  - [ ] Review perennial crop logic
  - [ ] Review variety management

- [ ] **Type Definitions**
  - [ ] Create types/crop.types.ts
  - [ ] Define CropData
  - [ ] Define CropLookupData
  - [ ] Define CropVarietyData
  - [ ] Define VarietyLookupData
  - [ ] Define CreateCropRequest
  - [ ] Define UpdateCropRequest
  - [ ] Define CreateVarietyRequest
  - [ ] Define UpdateVarietyRequest
  - [ ] Define CropResponse
  - [ ] Define CropListResponse
  - [ ] Define VarietyResponse
  - [ ] Define VarietyListResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/cropService.ts
  - [ ] Implement createCropService factory
  - [ ] Implement listCrops
  - [ ] Implement getCropLookup
  - [ ] Implement createCrop
  - [ ] Implement getCropById
  - [ ] Implement updateCrop
  - [ ] Implement deleteCrop
  - [ ] Implement getCropCategories
  - [ ] Implement getCropSeasons
  - [ ] Implement listVarieties
  - [ ] Implement getVarietyLookup
  - [ ] Implement createVariety
  - [ ] Implement getVarietyById
  - [ ] Implement updateVariety
  - [ ] Implement deleteVariety
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test perennial crop creation
  - [ ] Test variety management
  - [ ] Test properties transformation
  - [ ] Test metadata handling
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 8. cropStagesService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (5)
  - [ ] Identify dependencies (cropService, stagesService)

- [ ] **Type Definitions**
  - [ ] Create types/cropStages.types.ts (or reuse)
  - [ ] Define CropStageData
  - [ ] Define AssignStageRequest
  - [ ] Define ReorderStagesRequest
  - [ ] Define UpdateCropStageRequest
  - [ ] Define CropStagesResponse
  - [ ] Define CropStageResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/cropStagesService.ts
  - [ ] Implement createCropStagesService factory
  - [ ] Implement listCropStages
  - [ ] Implement assignStageToCrop
  - [ ] Implement reorderCropStages
  - [ ] Implement updateCropStage
  - [ ] Implement removeCropStage
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test ordering logic
  - [ ] Test duration units
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 9. cropCyclesService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (7)
  - [ ] Identify dependencies (cropService, farmService)
  - [ ] Review lifecycle states

- [ ] **Type Definitions**
  - [ ] Create types/cropCycles.types.ts
  - [ ] Define CropCycleData
  - [ ] Define CreateCropCycleRequest
  - [ ] Define UpdateCropCycleRequest
  - [ ] Define EndCropCycleRequest
  - [ ] Define CropCycleResponse
  - [ ] Define CropCycleListResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/cropCyclesService.ts
  - [ ] Implement createCropCyclesService factory
  - [ ] Implement listCropCycles
  - [ ] Implement createCropCycle
  - [ ] Implement getCropCycleById
  - [ ] Implement updateCropCycle
  - [ ] Implement endCropCycle
  - [ ] Implement deleteCropCycle
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test lifecycle transitions
  - [ ] Test season validation
  - [ ] Test perennial handling
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 10. activityService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (11)
  - [ ] Identify dependencies (cropCyclesService, cropStagesService)
  - [ ] Review filtering logic

- [ ] **Type Definitions**
  - [ ] Create types/activity.types.ts
  - [ ] Define FarmActivityData
  - [ ] Define CreateActivityRequest
  - [ ] Define UpdateActivityRequest
  - [ ] Define CompleteActivityRequest
  - [ ] Define ActivityListQueryParams
  - [ ] Define FarmActivityResponse
  - [ ] Define FarmActivityListResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/activityService.ts
  - [ ] Implement createActivityService factory
  - [ ] Implement listActivities
  - [ ] Implement createActivity
  - [ ] Implement getActivityById
  - [ ] Implement updateActivity
  - [ ] Implement deleteActivity
  - [ ] Implement completeActivity
  - [ ] Implement getActivitiesByCropCycle
  - [ ] Implement getActivitiesByType
  - [ ] Implement getActivitiesByStatus
  - [ ] Implement getActivitiesByDateRange
  - [ ] Implement getPendingActivities
  - [ ] Implement getCompletedActivities
  - [ ] Implement getOverdueActivities
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test filtering combinations
  - [ ] Test date range logic
  - [ ] Test status transitions
  - [ ] Test completion workflow
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 11. cropActivityService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (5)
  - [ ] Identify dependencies (cropCyclesService)
  - [ ] Compare with activityService

- [ ] **Type Definitions**
  - [ ] Reuse types/activity.types.ts or create separate

- [ ] **Implementation**
  - [ ] Create services/cropActivityService.ts
  - [ ] Implement createCropActivityService factory
  - [ ] Implement listCropActivities
  - [ ] Implement createCropActivity
  - [ ] Implement getCropActivityById
  - [ ] Implement updateCropActivity
  - [ ] Implement completeCropActivity
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

### Phase 4: Integration Services (Week 6)

#### 12. organizationService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (15+)
  - [ ] Identify external AAA service dependency
  - [ ] Review different base URL handling
  - [ ] Document hierarchical structures

- [ ] **Type Definitions**
  - [ ] Create types/organization.types.ts
  - [ ] Define Organization
  - [ ] Define Group
  - [ ] Define Role
  - [ ] Define CreateOrganizationRequest
  - [ ] Define UpdateOrganizationRequest
  - [ ] Define CreateGroupRequest
  - [ ] Define UpdateGroupRequest
  - [ ] Define AssignGroupRoleRequest
  - [ ] Define OrganizationResponse
  - [ ] Define GroupResponse
  - [ ] Define RoleResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/organizationService.ts
  - [ ] Handle different base URL configuration
  - [ ] Implement createOrganizationService factory
  - [ ] Implement listOrganizations
  - [ ] Implement getOrganizationById
  - [ ] Implement createOrganization
  - [ ] Implement updateOrganization
  - [ ] Implement deleteOrganization
  - [ ] Implement listGroups
  - [ ] Implement getGroupById
  - [ ] Implement createGroup
  - [ ] Implement updateGroup
  - [ ] Implement deleteGroup
  - [ ] Implement listRoles
  - [ ] Implement assignRoleToGroup
  - [ ] Implement listGroupRoles
  - [ ] Implement removeRoleFromGroup
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test external service integration
  - [ ] Test hierarchical operations
  - [ ] Write integration tests (may need mock AAA)
  - [ ] Achieve 85%+ coverage (external dependency)

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging
  - [ ] Verify AAA service connectivity

---

#### 13. fpoService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (3)
  - [ ] Identify dependencies (organizationService, identityService)
  - [ ] Review multi-step workflow

- [ ] **Type Definitions**
  - [ ] Create types/fpo.types.ts
  - [ ] Define CreateFPORequest
  - [ ] Define RegisterFPORequest
  - [ ] Define FPOResponse
  - [ ] Define FPOReferenceResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/fpoService.ts
  - [ ] Implement createFPOService factory
  - [ ] Implement createFPO
  - [ ] Implement registerFPO
  - [ ] Implement getFPOReference
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test multi-step workflow
  - [ ] Test transaction-like behavior
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 14. linkageService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (3)
  - [ ] Identify dependencies (identityService, fpoService)

- [ ] **Type Definitions**
  - [ ] Create types/linkage.types.ts (or reuse identity.types)
  - [ ] Define LinkFarmerRequest
  - [ ] Define UnlinkFarmerRequest
  - [ ] Define FarmerLinkageResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/linkageService.ts
  - [ ] Implement createLinkageService factory
  - [ ] Implement linkFarmer
  - [ ] Implement unlinkFarmer
  - [ ] Implement getFarmerLinkage
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test linkage types
  - [ ] Test status tracking
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

#### 15. kisanSathiService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (7)
  - [ ] Identify dependencies (identityService)

- [ ] **Type Definitions**
  - [ ] Create types/kisanSathi.types.ts
  - [ ] Define KisanSathiData
  - [ ] Define CreateKisanSathiRequest
  - [ ] Define AssignKisanSathiRequest
  - [ ] Define ReassignKisanSathiRequest
  - [ ] Define KisanSathiResponse
  - [ ] Define KisanSathiAssignmentResponse
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/kisanSathiService.ts
  - [ ] Implement createKisanSathiService factory
  - [ ] Implement createKisanSathi
  - [ ] Implement assignKisanSathi
  - [ ] Implement reassignKisanSathi
  - [ ] Implement getKisanSathiAssignment
  - [ ] Implement getAllKisanSathis
  - [ ] Implement getKisanSathiById
  - [ ] Implement updateKisanSathi
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test assignment workflow
  - [ ] Test reassignment logic
  - [ ] Write integration tests
  - [ ] Achieve 90%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

### Phase 5: Complex Services (Week 7)

#### 16. bulkService ✓ Priority: P0

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (3)
  - [ ] Identify dependencies (identityService, fpoService)
  - [ ] Review file upload handling
  - [ ] Review content type handling
  - [ ] Review retry logic

- [ ] **Type Definitions**
  - [ ] Create types/bulk.types.ts
  - [ ] Define FarmerBulkData
  - [ ] Define BulkOperationResponse
  - [ ] Define BulkOperationStatusResponse
  - [ ] Define BulkValidationResponse
  - [ ] Define BulkOperationData
  - [ ] Define ProgressInfo
  - [ ] Define ValidationError
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/bulkService.ts
  - [ ] Implement createBulkService factory
  - [ ] Implement bulkAddFarmers
    - [ ] Handle CSV upload
    - [ ] Handle Excel upload
    - [ ] Handle JSON upload
    - [ ] Handle multipart/form-data
    - [ ] Handle application/x-www-form-urlencoded
    - [ ] Implement retry logic for 415 errors
  - [ ] Implement downloadBulkTemplate
  - [ ] Implement validateBulkData
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test CSV upload
  - [ ] Test Excel upload
  - [ ] Test JSON upload
  - [ ] Test content type fallback
  - [ ] Test file reading
  - [ ] Test base64 encoding
  - [ ] Test error scenarios
  - [ ] Write integration tests
  - [ ] Achieve 85%+ coverage (file upload complexity)

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] File upload thoroughly tested
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging
  - [ ] Test with real file uploads

---

#### 17. reportingService ✓ Priority: P1

- [ ] **Pre-Migration**
  - [ ] Document current implementation
  - [ ] List all methods (5+)
  - [ ] Identify dependencies (all services - aggregation)
  - [ ] Review export formats

- [ ] **Type Definitions**
  - [ ] Create types/reporting.types.ts
  - [ ] Define ExportFarmerPortfolioRequest
  - [ ] Define ExportFarmerPortfolioResponse
  - [ ] Define dashboard counter types
  - [ ] Define analytics types
  - [ ] Export all types

- [ ] **Implementation**
  - [ ] Create services/reportingService.ts
  - [ ] Implement createReportingService factory
  - [ ] Implement exportFarmerPortfolio
  - [ ] Implement exportFarmerPortfolioById
  - [ ] Implement getOrgDashboardCounters
  - [ ] Implement getFarmerAnalytics
  - [ ] Implement getFarmPerformanceReport
  - [ ] Add JSDoc comments

- [ ] **Testing**
  - [ ] Write unit tests (all methods)
  - [ ] Test JSON export
  - [ ] Test CSV export
  - [ ] Test date range filtering
  - [ ] Test season filtering
  - [ ] Test large response handling
  - [ ] Write integration tests
  - [ ] Achieve 85%+ coverage

- [ ] **Validation**
  - [ ] Code review passed
  - [ ] All tests passing
  - [ ] Export formats verified
  - [ ] Documentation updated
  - [ ] Update index.ts

- [ ] **Deployment**
  - [ ] Merge to main
  - [ ] Deploy to staging

---

## Phase 6: Integration & Finalization (Week 8)

### Main Factory Integration

- [ ] **Update index.ts**
  - [ ] Import all service factories
  - [ ] Import all types
  - [ ] Implement createFarmerService factory
  - [ ] Wire up all 17 services
  - [ ] Export main factory
  - [ ] Export all individual service factories
  - [ ] Export all types
  - [ ] Add backward compatibility layer (deprecated)
  - [ ] Add deprecation notices

### Comprehensive Testing

- [ ] **Integration Tests**
  - [ ] Test service initialization
  - [ ] Test configuration injection
  - [ ] Test token management
  - [ ] Test error handling across services
  - [ ] Test retry logic
  - [ ] Test timeout handling
  - [ ] Test request cancellation

- [ ] **End-to-End Tests**
  - [ ] Test complete farmer onboarding flow
  - [ ] Test farm creation and management
  - [ ] Test crop cycle lifecycle
  - [ ] Test activity workflow
  - [ ] Test FPO creation and linkage
  - [ ] Test bulk upload
  - [ ] Test reporting exports

- [ ] **Contract Tests**
  - [ ] Validate against OpenAPI spec (if available)
  - [ ] Test response schemas
  - [ ] Test request validation

- [ ] **Regression Tests**
  - [ ] Compare old vs new outputs
  - [ ] Verify behavioral equivalence
  - [ ] Run against production-like data

### Performance Testing

- [ ] **Benchmarks**
  - [ ] Measure response times
  - [ ] Compare with baseline
  - [ ] Verify within 5% of current performance

- [ ] **Load Testing**
  - [ ] Test under load
  - [ ] Test concurrent requests
  - [ ] Test retry behavior under load

- [ ] **Bundle Size**
  - [ ] Measure final bundle size
  - [ ] Verify 15KB+ reduction
  - [ ] Check tree-shaking effectiveness

### Security Audit

- [ ] **Security Review**
  - [ ] Token handling audit
  - [ ] Sensitive data logging check
  - [ ] Input validation review
  - [ ] XSS prevention check
  - [ ] CSRF protection verification
  - [ ] Rate limiting compliance

- [ ] **Penetration Testing**
  - [ ] Test auth bypass attempts
  - [ ] Test injection attacks
  - [ ] Test data exposure

### Documentation

- [ ] **API Documentation**
  - [ ] Update all service docs
  - [ ] Add usage examples
  - [ ] Document breaking changes (if any)
  - [ ] Add migration guide

- [ ] **Migration Guide**
  - [ ] Write migration steps
  - [ ] Provide code examples
  - [ ] List deprecated APIs
  - [ ] Document new patterns
  - [ ] Add troubleshooting section

- [ ] **README**
  - [ ] Update installation instructions
  - [ ] Update usage examples
  - [ ] Add configuration guide
  - [ ] Add testing guide

- [ ] **CHANGELOG**
  - [ ] Document all changes
  - [ ] List new features
  - [ ] List bug fixes
  - [ ] List deprecated features

### Release Preparation

- [ ] **Version Bump**
  - [ ] Update package.json version
  - [ ] Follow semantic versioning
  - [ ] Tag release

- [ ] **Build Verification**
  - [ ] Run full build
  - [ ] Verify no errors
  - [ ] Check output files

- [ ] **Pre-Release Checklist**
  - [ ] All tests passing
  - [ ] Coverage thresholds met
  - [ ] Linting passing
  - [ ] Type checking passing
  - [ ] Documentation complete
  - [ ] Migration guide published

- [ ] **Deployment**
  - [ ] Deploy to staging
  - [ ] Run smoke tests
  - [ ] Deploy to production (canary)
  - [ ] Monitor error rates
  - [ ] Gradual rollout to 100%

---

## Post-Migration

### Monitoring

- [ ] Set up error rate monitoring
- [ ] Set up performance monitoring
- [ ] Set up usage analytics
- [ ] Configure alerts

### Support

- [ ] Monitor support channels
- [ ] Address migration issues
- [ ] Gather feedback
- [ ] Iterate on documentation

### Deprecation Timeline

- [ ] v2.0.0: New pattern introduced, old deprecated
- [ ] v2.x.x: Both patterns supported (6 months)
- [ ] v3.0.0: Old pattern removed (breaking change)

---

## Success Metrics

### Technical Metrics

- [ ] All 17 services migrated
- [ ] Test coverage > 85%
- [ ] No breaking changes
- [ ] Performance within 5% of baseline
- [ ] Bundle size reduced by 15KB+
- [ ] Zero critical bugs in production

### Quality Metrics

- [ ] All code reviews completed
- [ ] Documentation coverage 100%
- [ ] Security audit passed
- [ ] No production incidents

### Business Metrics

- [ ] Migration completed on time
- [ ] Adoption rate > 80% within 3 months
- [ ] Positive developer feedback
- [ ] Reduced support tickets

---

## Sign-Off

- [ ] Tech Lead approval
- [ ] Architecture approval
- [ ] QA approval
- [ ] Security approval
- [ ] Product approval
- [ ] Release approved

---

**Last Updated:** 2025-11-12
**Version:** 1.0.0
