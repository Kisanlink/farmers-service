# Design Document: Farmer Service Refactor

## Overview

This design document outlines the architectural approach for refactoring the farmer service to match the auth service pattern. The refactored service will provide a clean, type-safe, and maintainable API for all farmer-related operations with consistent error handling and centralized configuration.

The refactor transforms the current mixed implementation (v2 service imports + fetch calls) into a unified axios-based service following established patterns from the auth service.

## Architecture

### Service Structure

The farmer service follows a functional service pattern with:

1. **Type Definitions**: Comprehensive TypeScript interfaces at the top of the file
2. **Helper Functions**: Utility functions for error creation and token management
3. **Service Object**: Single exported object containing all public methods
4. **Error Handling**: Consistent try-catch blocks with status-based error mapping

### Dependencies

- `axios`: HTTP client for all API requests
- `AxiosError`: Type for axios-specific error handling
- `API_CONFIG`: Centralized configuration from `../config/api.config`
- `getFarmerServiceUrl`: Helper function to build complete URLs

### Removed Dependencies

- `farmerService as v2FarmerService` from `../../../farmers-service`
- Direct `fetch` API calls
- Mixed service patterns

## Components and Interfaces

### Core Interfaces

#### ApiError Interface

```typescript
interface ApiError {
  status: number;
  message: string;
  type: "error" | "warning" | "info";
}
```

#### Farmer Entity

```typescript
interface Farmer {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  kisansathi_user_id?: string;
  full_name: string;
  gender: string;
  social_category: string;
  father_name: string;
  equity_share: string;
  total_share: string;
  area_type: string;
  is_fpo: boolean;
  state: NullableString;
  district: NullableString;
  block: NullableString;
  ia_name: NullableString;
  cbb_name: NullableString;
  fpo_name: NullableString;
  fpo_reg_no: NullableString;
  is_active: boolean;
  is_subscribed: boolean;
  type: string;
  user_details?: UserDetails;
}
```

#### Request/Response Interfaces

- `CreateFarmerData`: Payload for creating new farmers
- `UpdateFarmerData`: Payload for updating existing farmers
- `UserDetails`: User information associated with farmers
- `KisanSathi`: KisanSathi user information
- `IrrigationSource`: Lookup data for irrigation sources

### Helper Functions

#### createApiError

```typescript
const createApiError = (
  status: number,
  message: string,
  type: "error" | "warning" | "info" = "error"
): ApiError => ({
  status,
  message,
  type,
});
```

Purpose: Creates standardized error objects for consistent error handling

#### getAccessToken

```typescript
const getAccessToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw createApiError(401, "Authentication required. Please login.");
  }
  return token;
};
```

Purpose: Retrieves and validates access token from localStorage

## Data Models

### API Request Models

#### GET /api/v1/farmers

Query Parameters:

- `page`: number (default: 1)
- `page_size`: number (default: 50)
- `aaa_org_id`: string (optional, filters by FPO registration number)

#### GET /api/v1/farmers/:id

Path Parameters:

- `id`: string (farmer_id or user_id based on idType)

#### POST /api/v1/farmers

Request Body:

```typescript
{
  aaa_org_id: string;
  aaa_user_id?: string;
  profile: {
    phone_number: string;
    country_code: string;
    first_name: string;
    gender?: string;
    social_category?: string;
    father_name?: string;
    equity_share?: string;
    total_share?: string;
    area_type?: string;
    state?: string;
    district?: string;
    fpo_reg_no?: string;
    kisansathi_user_id?: string;
  }
}
```

#### PUT /api/v1/farmers/:id

Request Body: Partial<Farmer> with updatable fields

### API Response Models

All responses follow the standard format:

```typescript
{
  success: boolean;
  data: T;
  message?: string;
  request_id?: string;
  timestamp?: string;
}
```

## Error Handling

### Error Mapping Strategy

The service implements comprehensive error handling with status-based mapping:

| Status Code | Error Type | User Message                                          |
| ----------- | ---------- | ----------------------------------------------------- |
| 400         | error      | Invalid request parameters or server-specific message |
| 401         | error      | Authentication required or invalid credentials        |
| 403         | error      | Access denied. Please check your permissions          |
| 404         | warning    | Resource not found or service unavailable             |
| 429         | warning    | Too many requests. Please try again later             |
| 500         | error      | Internal server error. Please try again later         |
| Other       | error      | Server message or "An unexpected error occurred"      |

### Error Handling Pattern

Each service method follows this pattern:

```typescript
async methodName(params): Promise<ReturnType> {
  try {
    const token = getAccessToken();
    const response = await axios.method(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError.response?.status || 500;
      const serverMessage = axiosError.response?.data?.message ||
                           axiosError.response?.data?.error;

      switch (status) {
        case 400:
          throw createApiError(400, serverMessage || 'Invalid request');
        // ... other cases
      }
    }
    throw createApiError(500, 'An unexpected error occurred');
  }
}
```

## Service Methods

### getFarmers(fpoRegNo?: string)

- **Purpose**: Retrieve list of farmers with optional FPO filtering
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/farmers`
- **Query Params**: page=1, page_size=50, aaa_org_id (if fpoRegNo provided)
- **Returns**: Promise<any> (farmer list response)

### getFarmerById(id: string, idType: 'farmer_id' | 'user_id')

- **Purpose**: Retrieve single farmer by ID
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/farmers/${id}` or `/api/v1/farmers/user/${id}`
- **Returns**: Promise<any> (farmer details)

### addFarmer(farmerData: CreateFarmerData)

- **Purpose**: Create new farmer record
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/farmers`
- **Validation**: Requires aaa_org_id, phone_number, country_code, first_name
- **Returns**: Promise<any> (created farmer)

### updateFarmer(farmerId: string, farmerData: UpdateFarmerData)

- **Purpose**: Update existing farmer record
- **HTTP Method**: PUT
- **Endpoint**: `/api/v1/farmers/${farmerId}`
- **Returns**: Promise<any> (updated farmer)

### getKisanSathis()

- **Purpose**: Retrieve list of available KisanSathis
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/kisan-sathi` or AAA service users endpoint
- **Returns**: Promise<KisanSathi[]>

### assignKisanSathi(kisansathiUserId: string, farmerIds: string[])

- **Purpose**: Assign KisanSathi to multiple farmers
- **HTTP Method**: POST (multiple calls)
- **Endpoint**: `/api/v1/farmers/${farmerId}` (update each farmer)
- **Implementation**: Iterates through farmerIds and updates each with kisansathi_user_id
- **Returns**: Promise<any> (assignment results)

### getIrrigationSources()

- **Purpose**: Retrieve lookup data for irrigation sources
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/lookups/irrigation-sources`
- **Returns**: Promise<any> (irrigation sources list)

## Testing Strategy

### Unit Testing Approach

1. **Mock axios**: Use jest.mock('axios') to mock HTTP calls
2. **Test Success Paths**: Verify correct data transformation and return values
3. **Test Error Paths**: Verify error handling for each status code
4. **Test Token Management**: Verify getAccessToken behavior with/without tokens
5. **Test Parameter Handling**: Verify optional parameters and query string construction

### Test Cases

#### getFarmers Tests

- Should fetch farmers without fpoRegNo filter
- Should fetch farmers with fpoRegNo filter
- Should handle 401 authentication errors
- Should handle 500 server errors

#### addFarmer Tests

- Should create farmer with valid data
- Should throw error when aaa_org_id is missing
- Should handle 400 validation errors
- Should include optional aaa_user_id when provided

#### Error Handling Tests

- Should create ApiError with correct status and message
- Should extract server messages from error responses
- Should default to generic messages when server message unavailable
- Should set error type to 'warning' for 404 and 429 status codes

#### Token Management Tests

- Should retrieve token from localStorage
- Should throw 401 error when token is missing
- Should include Bearer token in Authorization header

### Integration Testing

- Test against actual API endpoints in development environment
- Verify response data structures match TypeScript interfaces
- Validate error responses from backend
- Test authentication flow with expired tokens

## Migration Strategy

### Phase 1: Create New Service File

1. Create `farmer.service.ts` alongside existing `farmerService.ts`
2. Implement all methods following auth service pattern
3. Ensure all TypeScript interfaces are properly defined
4. Add comprehensive error handling

### Phase 2: Update Imports

1. Identify all components importing from `farmerService.ts`
2. Update imports to use new `farmer.service.ts`
3. Update import statements to use named export `farmerService`

### Phase 3: Testing and Validation

1. Test each component with new service
2. Verify error handling in UI
3. Validate data flow and state management
4. Check console for any runtime errors

### Phase 4: Cleanup

1. Remove old `farmerService.ts` file
2. Remove v2FarmerService dependencies if no longer needed
3. Update any documentation references

## Backward Compatibility

The refactored service maintains full backward compatibility:

1. **Method Signatures**: All method names and parameters remain unchanged
2. **Return Types**: Response data structures match existing expectations
3. **Optional Parameters**: fpoRegNo and idType parameters work identically
4. **Error Behavior**: Errors are thrown (not returned), matching current pattern

Components using the farmer service require no changes beyond updating the import statement.

## Configuration Management

### Endpoint Configuration

All endpoints are defined in `src/config/api.config.ts`:

```typescript
FARMER_SERVICE: {
  BASE_URL: import.meta.env.VITE_FARMER_MODULE_URL,
  ENDPOINTS: {
    FARMERS: '/api/v1/farmers',
    KISAN_SATHI: '/api/v1/kisan-sathi',
    LOOKUPS: {
      IRRIGATION_SOURCES: '/api/v1/lookups/irrigation-sources',
    },
  },
}
```

### URL Construction

Use helper function for all URLs:

```typescript
const url = getFarmerServiceUrl(API_CONFIG.FARMER_SERVICE.ENDPOINTS.FARMERS);
```

This ensures:

- Consistent URL formatting
- Easy environment switching
- Centralized endpoint management
- No hardcoded URLs in service code

## Performance Considerations

1. **Request Batching**: assignKisanSathi uses Promise.all for parallel updates
2. **Token Caching**: Access token retrieved from localStorage (fast)
3. **Error Short-Circuiting**: Early return on missing token prevents unnecessary API calls
4. **Pagination**: getFarmers supports pagination (page_size parameter)

## Security Considerations

1. **Token Storage**: Access tokens stored in localStorage (matches existing pattern)
2. **Authorization Headers**: Bearer token included in all authenticated requests
3. **Error Messages**: Avoid exposing sensitive information in error messages
4. **Input Validation**: Validate required fields before making API calls
5. **HTTPS**: All API calls use HTTPS in production (configured via environment)
