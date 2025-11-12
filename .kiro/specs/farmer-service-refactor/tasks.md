# Implementation Plan

- [ ] 1. Create new farmer.service.ts file with TypeScript interfaces and helper functions

  - Create `src/services/farmer.service.ts` file
  - Define all TypeScript interfaces (ApiError, Farmer, CreateFarmerData, UpdateFarmerData, UserDetails, KisanSathi, NullableString, Role)
  - Implement createApiError helper function
  - Implement getAccessToken helper function
  - Import axios, AxiosError, API_CONFIG, and getFarmerServiceUrl
  - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 8.1, 8.2, 8.4_

- [ ] 2. Implement getFarmers method with error handling

  - Create getFarmers method in farmerService object
  - Accept optional fpoRegNo parameter
  - Build URL using getFarmerServiceUrl and API_CONFIG.FARMER_SERVICE.ENDPOINTS.FARMERS
  - Construct query parameters (page=1, page_size=50, aaa_org_id if fpoRegNo provided)
  - Use axios.get with Authorization header
  - Implement try-catch block with status-based error mapping
  - Return response.data
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.3, 8.3_

- [ ] 3. Implement getFarmerById method with idType support

  - Create getFarmerById method in farmerService object
  - Accept id parameter and idType parameter ('farmer_id' | 'user_id')
  - Build endpoint path based on idType (direct ID or /user/:id)
  - Use axios.get with Authorization header
  - Implement try-catch block with error handling
  - Return response.data
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.3, 5.3, 5.4, 5.5, 7.4, 7.5, 8.3_

- [ ] 4. Implement addFarmer method with validation

  - Create addFarmer method in farmerService object
  - Accept farmerData parameter of type CreateFarmerData
  - Validate that aaa_org_id is provided (throw error if missing)
  - Construct request body with aaa_org_id, optional aaa_user_id, and profile
  - Use axios.post with Authorization header and JSON content type
  - Implement try-catch block with error handling
  - Return response.data
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.4, 5.3, 5.4, 5.5, 6.1, 8.3_

- [ ] 5. Implement updateFarmer method

  - Create updateFarmer method in farmerService object
  - Accept farmerId and farmerData parameters
  - Build URL with farmerId path parameter
  - Use axios.put with Authorization header and JSON content type
  - Implement try-catch block with error handling
  - Return response.data
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.5, 5.3, 5.4, 5.5, 8.3_

- [ ] 6. Implement getKisanSathis method

  - Create getKisanSathis method in farmerService object
  - Build URL using KISAN_SATHI endpoint from API_CONFIG
  - Use axios.get with Authorization header
  - Implement try-catch block with error handling
  - Return response.data as KisanSathi array
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.6, 5.3, 5.4, 5.5, 8.3_

- [ ] 7. Implement assignKisanSathi method with batch updates

  - Create assignKisanSathi method in farmerService object
  - Accept kisansathiUserId and farmerIds array parameters
  - Iterate through farmerIds array
  - For each farmerId, call updateFarmer with kisansathi_user_id field
  - Use Promise.all for parallel execution
  - Implement try-catch block with error handling
  - Return success status and results array
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.7, 8.3_

- [ ] 8. Implement getIrrigationSources method

  - Create getIrrigationSources method in farmerService object
  - Build URL using LOOKUPS.IRRIGATION_SOURCES endpoint from API_CONFIG
  - Use axios.get with Authorization header
  - Implement try-catch block with error handling
  - Return response.data
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.8, 5.3, 5.4, 5.5, 8.3_

- [ ] 9. Update API configuration if needed

  - Review API_CONFIG.FARMER_SERVICE.ENDPOINTS in api.config.ts
  - Add any missing endpoint definitions (KISAN_SATHI if not present)
  - Ensure all endpoints used by farmer service are defined
  - Verify endpoint paths match backend API
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10. Update component imports to use new farmer.service.ts

  - Search for all files importing from farmerService.ts
  - Update import statements to use farmer.service.ts
  - Verify import syntax matches new export pattern
  - Test each component to ensure functionality is preserved
  - _Requirements: 7.1, 7.2_

- [ ] 11. Remove old farmerService.ts and cleanup dependencies
  - Delete src/services/farmerService.ts file
  - Remove v2FarmerService import if no longer used elsewhere
  - Search for any remaining references to old service
  - Update any documentation or comments referencing old service
  - _Requirements: 1.2, 1.3_
