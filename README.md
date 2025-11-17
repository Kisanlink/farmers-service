# Farmers Service SDK

TypeScript SDK for the Farmers Service API - A comprehensive client library for managing farmers, farms, crops, FPOs, and agricultural activities.

## Installation

```bash
npm install farmers-service
# or
yarn add farmers-service
```

## Quick Start

```typescript
import createFarmerService from 'farmers-service';

// Initialize the SDK
const farmerService = createFarmerService({
  baseURL: 'https://api.example.com',
  getAccessToken: () => localStorage.getItem('access_token') || undefined
});

// Use the services
const farmers = await farmerService.identity.listFarmers({
  page: 1,
  page_size: 10
});
```

## Features

- ✅ **Full Type Safety** - Complete TypeScript definitions
- ✅ **Modular Architecture** - Use only what you need
- ✅ **Comprehensive Documentation** - JSDoc comments for IntelliSense
- ✅ **Phone Lookup** - Automatic user lookup by phone number
- ✅ **Factory Pattern** - Easy testing and dependency injection

## Available Services

### Identity Service
Manage farmer profiles and user accounts:
```typescript
// List farmers with filters
const farmers = await farmerService.identity.listFarmers({
  aaa_org_id: 'org_123',
  phone_number: '9876543210'  // Search by phone
});

// Create farmer
const newFarmer = await farmerService.identity.createFarmer({
  user_id: 'user_123',
  aaa_org_id: 'org_123',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+919876543210'
});
```

### FPO Service
Manage Farmer Producer Organizations:
```typescript
// Create FPO with NEW CEO user
const fpo = await farmerService.fpo.createFPO({
  name: "Sree Rama FPO",
  registration_number: "FPO00000001",
  description: "FPO in Jangaon, Telangana",
  ceo_user: {
    first_name: "Kaushik",
    last_name: "Kumar",
    phone_number: "+919542687186",
    password: "SecurePass@123",  // Required for new users
    email: "kaushik@auto.local"
  }
});

// Create FPO with EXISTING CEO user
const fpo2 = await farmerService.fpo.createFPO({
  name: "Another FPO",
  registration_number: "FPO00000002",
  ceo_user: {
    first_name: "N/A",            // Will be ignored
    last_name: "N/A",             // Will be ignored
    phone_number: "9542687186"    // Only phone matters!
    // password NOT needed for existing users
  }
});
```

### Farm Service
Manage farm plots and land data:
```typescript
const farms = await farmerService.farm.listFarms({
  farmer_id: 'farmer_123',
  page: 1,
  page_size: 20
});
```

### Crop Service
Manage crops, varieties, and cycles:
```typescript
const crops = await farmerService.crop.listCrops();
const varieties = await farmerService.crop.listCropVarieties(cropId);
```

### Activity Service
Track agricultural activities:
```typescript
const activities = await farmerService.activity.listActivities({
  crop_cycle_id: 'cycle_123'
});
```

### Lookup Service
Access reference data:
```typescript
const irrigationSources = await farmerService.lookup.getIrrigationSources();
const soilTypes = await farmerService.lookup.getSoilTypes();
```

## API Reference

### Configuration

```typescript
interface FarmerServiceConfig {
  baseURL: string;
  getAccessToken?: () => string | undefined;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    retryableStatusCodes: number[];
  };
  logConfig?: {
    enabled: boolean;
    logLevel: 'info' | 'debug' | 'warn' | 'error';
    logRequests: boolean;
    logResponses: boolean;
  };
}
```

### CEO User Lookup Behavior

**Important:** The FPO creation endpoint automatically looks up users by `phone_number`:

- **If user exists:**
  - ✅ Reuses existing user (ignores other fields)
  - ✅ Phone number is the only field that matters
  - ✅ Password is **NOT required**

- **If user doesn't exist:**
  - Creates new user with provided details
  - Password **is required** (min 8 characters)

## Type Exports

Import specific types:
```typescript
import type {
  CreateFPORequest,
  CEOUser,
  FarmerListQueryParams,
  FPOResponse
} from 'farmers-service';
```

## Error Handling

```typescript
try {
  const fpo = await farmerService.fpo.createFPO(request);
} catch (error) {
  if (error.response) {
    console.error('API Error:', error.response.data);
  } else {
    console.error('Network Error:', error.message);
  }
}
```

## Validation

The SDK includes runtime validation using Zod schemas:

```typescript
import { validateResponse, FarmerResponseSchema } from 'farmers-service';

const validated = validateResponse(FarmerResponseSchema, apiResponse);
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run build:watch

# Run tests
npm test

# Test coverage
npm test:coverage
```

## Version History

### v1.1.0 (2025-11-17)
- ✅ Updated FPO types with nested `ceo_user` object
- ✅ Added `phone_number` search parameter for farmers
- ✅ Made password optional for existing users
- ✅ Updated `registration_no` → `registration_number`
- ✅ Comprehensive JSDoc documentation
- ✅ Build system with TypeScript compilation

### v1.0.0
- Initial release

## License

MIT

## Support

For issues and questions, please refer to the API documentation or contact the backend team.
