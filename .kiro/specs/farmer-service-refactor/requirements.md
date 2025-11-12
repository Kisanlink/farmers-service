# Requirements Document

## Introduction

This document outlines the requirements for refactoring the farmer service to follow the same architectural pattern as the auth service. The refactoring aims to improve code consistency, error handling, type safety, and maintainability by adopting a standardized service pattern across the application. The farmer service currently uses a mixed approach with v2 service imports and direct fetch calls, which should be unified into a consistent pattern matching the auth service implementation.

## Glossary

- **Farmer_Service**: The TypeScript service module responsible for all farmer-related API operations including CRUD operations, KisanSathi assignments, and lookup data retrieval
- **Auth_Service**: The reference implementation service module that demonstrates the target architectural pattern with comprehensive error handling, type definitions, and axios-based HTTP requests
- **API_Error**: A standardized error object containing status code, message, and type (error/warning/info) used for consistent error handling across services
- **KisanSathi**: A user role representing agricultural field workers who are assigned to support farmers
- **FPO**: Farmer Producer Organization, identified by a registration number (fpo_reg_no)
- **AAA_Service**: Authentication, Authorization, and Accounting Service that manages user identity and access control
- **V2_Farmer_Service**: The imported farmers-service module that provides identity and bulk operations

## Requirements

### Requirement 1

**User Story:** As a developer, I want the farmer service to use axios for all HTTP requests instead of mixed fetch/v2 imports, so that error handling and request configuration are consistent across the application

#### Acceptance Criteria

1. WHEN THE Farmer_Service makes any HTTP request, THE Farmer_Service SHALL use axios library exclusively
2. THE Farmer_Service SHALL remove all direct fetch API calls from the implementation
3. THE Farmer_Service SHALL remove dependencies on v2FarmerService imports for API operations
4. THE Farmer_Service SHALL configure axios requests with proper headers including Authorization bearer tokens
5. WHERE authentication is required, THE Farmer_Service SHALL retrieve access tokens from localStorage using a dedicated helper method

### Requirement 2

**User Story:** As a developer, I want comprehensive TypeScript interfaces for all farmer-related data structures, so that type safety is enforced throughout the application

#### Acceptance Criteria

1. THE Farmer_Service SHALL define TypeScript interfaces for all API request payloads
2. THE Farmer_Service SHALL define TypeScript interfaces for all API response structures
3. THE Farmer_Service SHALL include interfaces for Farmer, CreateFarmerData, UpdateFarmerData, UserDetails, KisanSathi, and IrrigationSource entities
4. THE Farmer_Service SHALL define an ApiError interface matching the Auth_Service pattern with status, message, and type fields
5. THE Farmer_Service SHALL export all interfaces for use by consuming components

### Requirement 3

**User Story:** As a developer, I want standardized error handling in the farmer service, so that API errors are caught, transformed, and presented consistently to users

#### Acceptance Criteria

1. WHEN an HTTP request fails, THE Farmer_Service SHALL catch axios errors using try-catch blocks
2. WHEN an axios error occurs, THE Farmer_Service SHALL check if the error is an AxiosError using axios.isAxiosError()
3. THE Farmer_Service SHALL extract the HTTP status code from error responses
4. THE Farmer_Service SHALL extract server error messages from response data
5. THE Farmer_Service SHALL create ApiError objects using a createApiError helper function
6. THE Farmer_Service SHALL map HTTP status codes to user-friendly error messages (400, 401, 403, 404, 429, 500)
7. THE Farmer_Service SHALL throw ApiError objects that consuming code can handle uniformly

### Requirement 4

**User Story:** As a developer, I want all farmer service methods organized in a single exported object, so that the API surface is clear and easy to import

#### Acceptance Criteria

1. THE Farmer_Service SHALL export a single farmerService object containing all methods
2. THE Farmer_Service SHALL implement getFarmers method with optional fpoRegNo parameter
3. THE Farmer_Service SHALL implement getFarmerById method with id and idType parameters
4. THE Farmer_Service SHALL implement addFarmer method accepting CreateFarmerData
5. THE Farmer_Service SHALL implement updateFarmer method accepting farmerId and UpdateFarmerData
6. THE Farmer_Service SHALL implement getKisanSathis method returning KisanSathi array
7. THE Farmer_Service SHALL implement assignKisanSathi method accepting kisansathiUserId and farmerIds array
8. THE Farmer_Service SHALL implement getIrrigationSources method for lookup data

### Requirement 5

**User Story:** As a developer, I want the farmer service to use centralized API configuration, so that endpoint URLs are managed consistently and can be easily updated

#### Acceptance Criteria

1. THE Farmer_Service SHALL import API_CONFIG from the centralized api.config.ts file
2. THE Farmer_Service SHALL use getFarmerServiceUrl helper function to build complete endpoint URLs
3. THE Farmer_Service SHALL reference API_CONFIG.FARMER_SERVICE.ENDPOINTS constants for all endpoint paths
4. THE Farmer_Service SHALL NOT contain any hardcoded API URLs or endpoint strings
5. WHEN constructing API URLs, THE Farmer_Service SHALL combine base URL and endpoint path using the configuration helper functions

### Requirement 6

**User Story:** As a developer, I want proper HTTP status code handling with appropriate error types, so that the UI can display warnings vs errors appropriately

#### Acceptance Criteria

1. WHEN a 400 status code is received, THE Farmer_Service SHALL throw an ApiError with type 'error' and message about invalid request parameters
2. WHEN a 401 status code is received, THE Farmer_Service SHALL throw an ApiError with type 'error' and message about authentication failure
3. WHEN a 403 status code is received, THE Farmer_Service SHALL throw an ApiError with type 'error' and message about access denial
4. WHEN a 404 status code is received, THE Farmer_Service SHALL throw an ApiError with type 'warning' and message about resource not found
5. WHEN a 429 status code is received, THE Farmer_Service SHALL throw an ApiError with type 'warning' and message about rate limiting
6. WHEN a 500 status code is received, THE Farmer_Service SHALL throw an ApiError with type 'error' and message about server error
7. WHEN an unknown status code is received, THE Farmer_Service SHALL throw an ApiError with the actual status and server message if available

### Requirement 7

**User Story:** As a developer, I want the farmer service to maintain backward compatibility with existing component usage, so that refactoring does not break existing functionality

#### Acceptance Criteria

1. THE Farmer_Service SHALL maintain the same method signatures as the current implementation
2. THE Farmer_Service SHALL return data structures compatible with existing component expectations
3. THE Farmer_Service SHALL preserve the behavior of optional parameters like fpoRegNo in getFarmers
4. THE Farmer_Service SHALL preserve the idType parameter behavior in getFarmerById method
5. THE Farmer_Service SHALL maintain support for both farmer_id and user_id lookup types

### Requirement 8

**User Story:** As a developer, I want helper methods for token management in the farmer service, so that authentication tokens are accessed consistently

#### Acceptance Criteria

1. THE Farmer_Service SHALL implement a getAccessToken helper method that retrieves tokens from localStorage
2. THE Farmer_Service SHALL use the getAccessToken method in all authenticated API requests
3. THE Farmer_Service SHALL include Authorization header with Bearer token format in all authenticated requests
4. WHEN no access token is available, THE Farmer_Service SHALL throw an appropriate ApiError with 401 status
