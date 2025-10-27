# Farmer Service API Implementation Checklist

## Comparison between swagger.json and farmer_service Implementation

### ✅ IMPLEMENTED APIs

#### 1. Identity Service (identityService.ts)
- ✅ `GET /identity/farmers` - List farmers with pagination
- ✅ `POST /identity/farmers` - Create a new farmer
- ✅ `GET /identity/farmers/id/{farmer_id}` - Get farmer by farmer ID
- ✅ `PUT /identity/farmers/id/{farmer_id}` - Update farmer by farmer ID
- ✅ `DELETE /identity/farmers/id/{farmer_id}` - Delete farmer by farmer ID
- ✅ `GET /identity/farmers/user/{aaa_user_id}` - Get farmer by user ID only
- ✅ `PUT /identity/farmers/user/{aaa_user_id}` - Update farmer by user ID only
- ✅ `DELETE /identity/farmers/user/{aaa_user_id}` - Delete farmer by user ID only
- ✅ `GET /identity/farmers/{aaa_user_id}/{aaa_org_id}` - Get farmer by user ID and org ID
- ✅ `PUT /identity/farmers/{aaa_user_id}/{aaa_org_id}` - Update farmer by user ID and org ID
- ✅ `DELETE /identity/farmers/{aaa_user_id}/{aaa_org_id}` - Delete farmer by user ID and org ID

#### 2. Farm Service (farmService.ts)
- ✅ `GET /farms` - List all farms with filtering
- ✅ `POST /farms` - Create a new farm
- ✅ `GET /farms/{farm_id}` - Get farm by ID
- ✅ `PUT /farms/{farm_id}` - Update an existing farm
- ✅ `DELETE /farms/{farm_id}` - Delete a farm

#### 3. Activity Service (activityService.ts)
- ✅ `GET /activities` - List farm activities with filtering
- ✅ `POST /activities` - Create a new farm activity
- ✅ `GET /activities/{id}` - Get a farm activity by ID
- ✅ `PUT /activities/{id}` - Update a farm activity
- ✅ `PUT /activities/{id}/complete` - Complete a farm activity

#### 4. Crop Service (cropService.ts)
- ✅ `GET /crops/cycles` - List crop cycles with filtering
- ✅ `POST /crops/cycles` - Start a new crop cycle
- ✅ `GET /crops/cycles/{cycle_id}` - Get crop cycle by ID
- ✅ `PUT /crops/cycles/{cycle_id}` - Update a crop cycle
- ✅ `POST /crops/cycles/{cycle_id}/end` - End a crop cycle

#### 5. Bulk Service (bulkService.ts)
- ✅ `POST /bulk/farmers/add` - Bulk add farmers to FPO
- ✅ `GET /bulk/template` - Get bulk upload template
- ✅ `POST /bulk/validate` - Validate bulk data
- ✅ `GET /bulk/status/{operation_id}` - Get bulk operation status
- ✅ `GET /bulk/results/{operation_id}` - Download bulk operation results
- ✅ `POST /bulk/cancel/{operation_id}` - Cancel bulk operation
- ✅ `POST /bulk/retry/{operation_id}` - Retry failed records

#### 6. Reporting Service (reportingService.ts)
- ✅ `POST /api/v1/reports/farmer-portfolio` - Export farmer portfolio
- ✅ `GET /api/v1/reports/farmer-portfolio/{farmer_id}` - Export farmer portfolio by ID
- ✅ `POST /api/v1/reports/org-dashboard` - Get organization dashboard counters
- ✅ `GET /api/v1/reports/org-dashboard/{org_id}` - Get organization dashboard counters by ID

---

### ❌ MISSING APIs (Not Implemented)

#### 1. FPO Management APIs
- ❌ `POST /fpo/create` - Create FPO Organization
- ❌ `POST /fpo/register` - Register FPO Reference
- ❌ `GET /fpo/reference/{aaa_org_id}` - Get FPO Reference

#### 2. Farmer Linkage APIs
- ❌ `POST /identity/link-farmer` - Link farmer to FPO
- ❌ `POST /identity/unlink-farmer` - Unlink farmer from FPO
- ❌ `GET /identity/linkage/{farmer_id}/{org_id}` - Get farmer linkage status

#### 3. KisanSathi Management APIs
- ❌ `POST /kisansathi/create-user` - Create KisanSathi user
- ❌ `POST /kisansathi/assign` - Assign KisanSathi to farmer
- ❌ `PUT /kisansathi/reassign` - Reassign or remove KisanSathi
- ❌ `GET /kisansathi/assignment/{farmer_id}/{org_id}` - Get KisanSathi assignment

#### 4. Admin APIs
- ❌ `GET /admin/health` - Health check
- ❌ `POST /admin/seed` - Seed roles and permissions
- ❌ `POST /admin/permissions/check` - Check user permission
- ❌ `GET /admin/audit` - Get audit trail

#### 5. Data Quality APIs
- ❌ `POST /api/v1/data-quality/validate-geometry` - Validate geometry
- ❌ `POST /api/v1/data-quality/detect-farm-overlaps` - Detect farm overlaps
- ❌ `POST /api/v1/data-quality/reconcile-aaa-links` - Reconcile AAA links
- ❌ `POST /api/v1/data-quality/rebuild-spatial-indexes` - Rebuild spatial indexes

#### 6. Crop Activities APIs (Alternate Routes)
- ❌ `GET /crops/activities` - List farm activities (alternate route)
- ❌ `POST /crops/activities` - Create a new farm activity (alternate route)
- ❌ `GET /crops/activities/{activity_id}` - Get farm activity by ID (alternate route)
- ❌ `PUT /crops/activities/{activity_id}` - Update a farm activity (alternate route)
- ❌ `POST /crops/activities/{activity_id}/complete` - Complete a farm activity (alternate route)

---

## Implementation Priority

### HIGH PRIORITY (Core Functionality)
1. **FPO Management APIs** - Essential for organizational setup
2. **Farmer Linkage APIs** - Core for farmer-FPO relationships
3. **KisanSathi Management APIs** - Important for field operations

### MEDIUM PRIORITY (Enhanced Functionality)
4. **Admin APIs** - Important for system administration
5. **Crop Activities APIs (Alternate Routes)** - Additional routes for crop activities

### LOW PRIORITY (Utility & Maintenance)
6. **Data Quality APIs** - Utility functions for data validation and maintenance

---

## Summary

### Overall Coverage
- **Total Endpoints in Swagger**: 52 endpoints
- **Implemented Endpoints**: 31 endpoints (60%)
- **Missing Endpoints**: 21 endpoints (40%)

### Coverage by Category
1. ✅ **Identity (Farmers)**: 100% (11/11 endpoints)
2. ✅ **Farms**: 100% (5/5 endpoints)
3. ✅ **Activities**: 100% (5/5 endpoints)
4. ✅ **Crop Cycles**: 100% (5/5 endpoints)
5. ✅ **Bulk Operations**: 100% (7/7 endpoints)
6. ✅ **Reporting**: 100% (4/4 endpoints)
7. ❌ **FPO Management**: 0% (0/3 endpoints)
8. ❌ **Farmer Linkage**: 0% (0/3 endpoints)
9. ❌ **KisanSathi**: 0% (0/4 endpoints)
10. ❌ **Admin**: 0% (0/4 endpoints)
11. ❌ **Data Quality**: 0% (0/4 endpoints)
12. ❌ **Crop Activities (Alternate)**: 0% (0/5 endpoints)

---

## Notes

1. **Good Coverage**: The core farmer management, farm management, activities, crop cycles, bulk operations, and reporting APIs are fully implemented.

2. **Missing Core Features**: 
   - FPO Management (organizational structure)
   - Farmer-FPO linkage (relationships)
   - KisanSathi management (field worker operations)

3. **Missing Utility Features**:
   - Admin operations (health, permissions, audit)
   - Data quality tools (geometry validation, overlap detection)

4. **Duplicate Routes**: The `/crops/activities` routes appear to be alternate routes for the `/activities` routes. Need clarification on which to use.

---

## Recommendations

1. **Immediate Action**: Implement FPO Management, Farmer Linkage, and KisanSathi APIs as they are core to the business logic.

2. **Short-term**: Add Admin APIs for better system management and monitoring.

3. **Long-term**: Consider implementing Data Quality APIs for robust data validation.

4. **Clarification Needed**: Determine whether `/activities` and `/crops/activities` are meant to be separate implementations or if one should be preferred over the other.

