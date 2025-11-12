# Farmer Module V1 Usage Analysis

## Overview

This document identifies all locations in the current codebase where the farmer module v1 services are being used. These locations need to be updated to use the new v2 farmers-service.

## Files Using Farmer Module V1

### 1. **Core Service Files** (Direct API calls to v1 endpoints)

#### `Admin-Panel/src/services/farmerService.ts`

- **Status**: Main v1 farmer service file
- **Usage**: Contains all v1 farmer API implementations
- **Methods Used**:
  - `getFarmers(fpoRegNo?: string)`
  - `getFarmerById(id: string, idType?: string)`
  - `addFarmer(farmerData: CreateFarmerData)`
  - `updateFarmer(id: string, farmerData: UpdateFarmerData)`
  - `getKisanSathis()`
  - `assignKisanSathi(kisanSathiId: string, farmerIds: string[])`
- **API Endpoints**: `/api/v1/farmers/*`
- **Action Required**: **REPLACE ENTIRELY** with new v2 services

#### `Admin-Panel/src/services/kisanSathiService.ts`

- **Status**: V1 KisanSathi service
- **Usage**: KisanSathi-related API calls
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `kisanSathiService` from v2

#### `Admin-Panel/src/services/farmService.ts`

- **Status**: V1 farm service
- **Usage**: Farm management API calls
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `farmService` from v2

#### `Admin-Panel/src/services/farmDataService.ts`

- **Status**: V1 farm data service
- **Usage**: Farm data operations
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `farmService` from v2

#### `Admin-Panel/src/services/farmActivityService.ts`

- **Status**: V1 farm activity service
- **Usage**: Farm activity operations
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `activityService` from v2

#### `Admin-Panel/src/services/cropCycleService.ts`

- **Status**: V1 crop cycle service
- **Usage**: Crop cycle operations
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `cropService` from v2

#### `Admin-Panel/src/services/fpoService.ts`

- **Status**: V1 FPO service
- **Usage**: FPO operations
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `fpoService` from v2

#### `Admin-Panel/src/services/subscribeService.ts`

- **Status**: V1 subscription service
- **Usage**: Farmer subscription management
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new v2 services

#### `Admin-Panel/src/services/cropService.ts`

- **Status**: V1 crop service
- **Usage**: Crop-related operations
- **API Endpoints**: Uses `VITE_FARMER_MODULE_URL`
- **Action Required**: **REPLACE** with new `cropService` from v2

#### `Admin-Panel/src/services/stageService.ts`

- **Status**: V1 stage service
- **Usage**: Stage management
- **API Endpoints**: `/api/v1/stages/*`
- **Action Required**: **REPLACE** with new v2 services

#### `Admin-Panel/src/services/farmMapService.ts`

- **Status**: V1 farm map service
- **Usage**: Farm mapping and visualization
- **API Endpoints**: `/api/v1/getFarmCentroids`, `/api/v1/getFarmHeatmap`
- **Action Required**: **REPLACE** with new v2 services

### 2. **Component Files** (Using v1 services)

#### `Admin-Panel/src/contexts/AppContext.tsx`

- **Status**: Main application context
- **Usage**:
  - Imports `farmerService` from v1
  - Imports `kisanSathiService` from v1
  - Imports `subscribeService` from v1
  - Uses `farmerService.getFarmers()`
  - Uses `kisanSathiService.getFarmersByKisanSathiId()`
- **Action Required**: **UPDATE IMPORTS** to use new v2 services

#### `Admin-Panel/src/pages/Farmers.tsx`

- **Status**: Main farmers page
- **Usage**:
  - Imports `farmerService` and related types from v1
  - Uses `farmerService.getFarmers(fpoRegNo)`
  - Uses `farmerService.addFarmer(payload)`
  - Uses `farmerService.updateFarmer(id, payload)`
  - Uses `farmerService.getKisanSathis()`
  - Uses `farmerService.assignKisanSathi(kisanSathiId, farmerIds)`
- **Action Required**: **UPDATE IMPORTS AND METHOD CALLS** to use new v2 services

#### `Admin-Panel/src/pages/FarmerProfile.tsx`

- **Status**: Individual farmer profile page
- **Usage**:
  - Imports `farmerService` and `Farmer` type from v1
  - Uses `farmerService.getFarmerById(id, idType)`
- **Action Required**: **UPDATE IMPORTS AND METHOD CALLS** to use new v2 services

#### `Admin-Panel/src/pages/KisanSathiProfile.tsx`

- **Status**: KisanSathi profile page
- **Usage**:
  - Imports `KisanSathiFarmer` type from v1
- **Action Required**: **UPDATE IMPORTS** to use new v2 types

#### `Admin-Panel/src/pages/Kisansathis.tsx`

- **Status**: KisanSathis listing page
- **Usage**:
  - Imports `Farmer` type from v1 kisanSathiService
- **Action Required**: **UPDATE IMPORTS** to use new v2 types

#### `Admin-Panel/src/pages/SubscribeUsers.tsx`

- **Status**: Subscription management page
- **Usage**:
  - Imports `subscribeService` and `FarmerData` from v1
  - Uses `subscribeService.updateFarmerSubscription()`
- **Action Required**: **UPDATE IMPORTS AND METHOD CALLS** to use new v2 services

#### `Admin-Panel/src/pages/FPOs.tsx`

- **Status**: FPO management page
- **Usage**:
  - Uses `VITE_FARMER_MODULE_URL` directly
- **Action Required**: **UPDATE** to use new v2 `fpoService`

#### `Admin-Panel/src/pages/Login.tsx`

- **Status**: Login page
- **Usage**:
  - Uses `VITE_FARMER_MODULE_URL` directly
- **Action Required**: **UPDATE** to use new v2 services

### 3. **Provider Files**

#### `Admin-Panel/src/providers/FarmersProvider.tsx`

- **Status**: Farmers context provider
- **Usage**:
  - Imports `farmerService` from v1
  - Uses `farmerService.getFarmers()`
- **Action Required**: **UPDATE IMPORTS AND METHOD CALLS** to use new v2 services

### 4. **Configuration Files**

#### `Admin-Panel/src/env.d.ts`

- **Status**: Environment variable type definitions
- **Usage**:
  - Defines `VITE_FARMER_MODULE_URL` type
- **Action Required**: **KEEP** (still needed for v2 services)

## Migration Priority

### **HIGH PRIORITY** (Core Services)

1. `farmerService.ts` - Main farmer service
2. `kisanSathiService.ts` - KisanSathi service
3. `farmService.ts` - Farm service
4. `farmActivityService.ts` - Activity service
5. `cropCycleService.ts` - Crop cycle service

### **MEDIUM PRIORITY** (Supporting Services)

6. `fpoService.ts` - FPO service
7. `subscribeService.ts` - Subscription service
8. `cropService.ts` - Crop service
9. `stageService.ts` - Stage service
10. `farmMapService.ts` - Map service

### **LOW PRIORITY** (Components)

11. `AppContext.tsx` - Application context
12. `Farmers.tsx` - Main farmers page
13. `FarmerProfile.tsx` - Farmer profile page
14. `FarmersProvider.tsx` - Farmers provider
15. Other component files

## Migration Strategy

### Phase 1: Service Layer Migration

1. Replace all service files with v2 implementations
2. Update import statements in service files
3. Test service layer independently

### Phase 2: Component Layer Migration

1. Update imports in all component files
2. Update method calls to use new v2 service methods
3. Update type imports to use new v2 types
4. Test component functionality

### Phase 3: Integration Testing

1. Test complete application flow
2. Verify all farmer-related functionality
3. Test error handling and edge cases

## Key Changes Required

### Import Changes

```typescript
// OLD (v1)
import { farmerService, Farmer } from "../services/farmerService";

// NEW (v2)
import { farmerService, FarmerResponse } from "../farmers-service";
```

### Method Call Changes

```typescript
// OLD (v1)
const farmers = await farmerService.getFarmers(fpoRegNo);

// NEW (v2)
const farmers = await farmerService.identity.listFarmers({
  fpo_reg_no: fpoRegNo,
});
```

### Type Changes

```typescript
// OLD (v1)
interface Farmer {
  id: string;
  name: string;
  // ... v1 fields
}

// NEW (v2)
interface FarmerResponse {
  success: boolean;
  data: FarmerProfileData;
  // ... v2 structure
}
```

## Files to Delete After Migration

- `Admin-Panel/src/services/farmerService.ts`
- `Admin-Panel/src/services/kisanSathiService.ts`
- `Admin-Panel/src/services/farmService.ts`
- `Admin-Panel/src/services/farmDataService.ts`
- `Admin-Panel/src/services/farmActivityService.ts`
- `Admin-Panel/src/services/cropCycleService.ts`
- `Admin-Panel/src/services/fpoService.ts`
- `Admin-Panel/src/services/subscribeService.ts`
- `Admin-Panel/src/services/cropService.ts`
- `Admin-Panel/src/services/stageService.ts`
- `Admin-Panel/src/services/farmMapService.ts`

## Summary

- **Total Files to Update**: 15+ files
- **Service Files**: 11 files
- **Component Files**: 4+ files
- **Provider Files**: 1 file
- **Configuration Files**: 1 file (keep)

The migration will involve updating imports, method calls, and type definitions across the entire application to use the new v2 farmers-service.
