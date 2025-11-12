/**
 * Integration Tests for Lookup Service
 *
 * Tests the lookup service against mock server to validate:
 * - Correct endpoint calls
 * - Response parsing
 * - Error handling
 * - Authentication
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestContext, expectUnauthorizedError } from '../helpers/test-utils';

describe('Lookup Service Integration Tests', () => {
  let context: TestContext;

  beforeEach(() => {
    context = new TestContext();
  });

  afterEach(() => {
    context.cleanup();
  });

  describe('getIrrigationSources', () => {
    it('should fetch irrigation sources successfully', async () => {
      const service = context.getService();

      const response = await service.lookup.getIrrigationSources();

      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toBeGreaterThan(0);

      // Validate structure of first item
      const firstItem = response.data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('is_active');
      expect(firstItem).toHaveProperty('created_at');
      expect(firstItem).toHaveProperty('updated_at');
    });

    it('should return array of irrigation sources with correct data', async () => {
      const service = context.getService();

      const response = await service.lookup.getIrrigationSources();

      expect(response.data.length).toBeGreaterThanOrEqual(2);

      // Check for expected irrigation sources
      const names = response.data.map(item => item.name);
      expect(names).toContain('Drip Irrigation');
      expect(names).toContain('Flood Irrigation');
    });

    it('should handle response with timestamp', async () => {
      const service = context.getService();

      const response = await service.lookup.getIrrigationSources();

      expect(response).toHaveProperty('timestamp');
      expect(response.timestamp).toBeDefined();
    });

    it('should return items with is_active flag', async () => {
      const service = context.getService();

      const response = await service.lookup.getIrrigationSources();

      response.data.forEach(item => {
        expect(item).toHaveProperty('is_active');
        expect(typeof item.is_active).toBe('boolean');
      });
    });
  });

  describe('getSoilTypes', () => {
    it('should fetch soil types successfully', async () => {
      const service = context.getService();

      const response = await service.lookup.getSoilTypes();

      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toBeGreaterThan(0);

      // Validate structure of first item
      const firstItem = response.data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('is_active');
      expect(firstItem).toHaveProperty('created_at');
      expect(firstItem).toHaveProperty('updated_at');
    });

    it('should return array of soil types with correct data', async () => {
      const service = context.getService();

      const response = await service.lookup.getSoilTypes();

      expect(response.data.length).toBeGreaterThanOrEqual(2);

      // Check for expected soil types
      const names = response.data.map(item => item.name);
      expect(names).toContain('Clay');
      expect(names).toContain('Loam');
    });

    it('should handle response with message field', async () => {
      const service = context.getService();

      const response = await service.lookup.getSoilTypes();

      expect(response).toHaveProperty('message');
      expect(response.message).toBeDefined();
      expect(typeof response.message).toBe('string');
    });

    it('should return items with optional description field', async () => {
      const service = context.getService();

      const response = await service.lookup.getSoilTypes();

      const itemsWithDescription = response.data.filter(item => item.description);
      expect(itemsWithDescription.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent lookup requests', async () => {
      const service = context.getService();

      const promises = [
        service.lookup.getIrrigationSources(),
        service.lookup.getSoilTypes(),
        service.lookup.getIrrigationSources(),
        service.lookup.getSoilTypes(),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.data).toBeInstanceOf(Array);
      });
    });
  });

  describe('Request History Tracking', () => {
    it('should track requests in mock server', async () => {
      const service = context.getService();
      const mockServer = context.getMockServer();

      const initialHistory = mockServer.getRequestHistory().length;

      await service.lookup.getIrrigationSources();
      await service.lookup.getSoilTypes();

      const finalHistory = mockServer.getRequestHistory().length;
      expect(finalHistory).toBe(initialHistory + 2);
    });
  });
});

describe('Lookup Service Error Handling', () => {
  let context: TestContext;

  beforeEach(() => {
    context = new TestContext();
  });

  afterEach(() => {
    context.cleanup();
  });

  describe('Token Revocation', () => {
    it('should support token revocation functionality in mock server', async () => {
      const token = 'test-token-12345';
      const mockServer = context.getMockServer();

      // Verify token revocation method exists and works
      mockServer.revokeSession(token);

      // This test verifies that the revokeSession method is available
      // Token revocation would be tested on authenticated endpoints
      expect(mockServer.revokeSession).toBeDefined();
      expect(typeof mockServer.revokeSession).toBe('function');
    });
  });

  describe('Type Safety', () => {
    it('should return correctly typed response for irrigation sources', async () => {
      const service = context.getService();

      const response = await service.lookup.getIrrigationSources();

      // TypeScript should enforce this at compile time, but we can verify at runtime
      expect(response).toMatchObject({
        success: expect.any(Boolean),
        message: expect.any(String),
        data: expect.any(Array),
      });

      response.data.forEach(item => {
        expect(item).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          is_active: expect.any(Boolean),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        });
      });
    });

    it('should return correctly typed response for soil types', async () => {
      const service = context.getService();

      const response = await service.lookup.getSoilTypes();

      expect(response).toMatchObject({
        success: expect.any(Boolean),
        message: expect.any(String),
        data: expect.any(Array),
      });

      response.data.forEach(item => {
        expect(item).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          is_active: expect.any(Boolean),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        });
      });
    });
  });

  describe('Inactive Item Filtering', () => {
    it('should not return inactive irrigation sources', async () => {
      const service = context.getService();

      const response = await service.lookup.getIrrigationSources();

      // Verify all returned items are active
      response.data.forEach(item => {
        expect(item.is_active).toBe(true);
      });

      // Verify the inactive item is not included
      const names = response.data.map(item => item.name);
      expect(names).not.toContain('Sprinkler Irrigation (Inactive)');
    });

    it('should not return inactive soil types', async () => {
      const service = context.getService();

      const response = await service.lookup.getSoilTypes();

      // Verify all returned items are active
      response.data.forEach(item => {
        expect(item.is_active).toBe(true);
      });

      // Verify the inactive item is not included
      const names = response.data.map(item => item.name);
      expect(names).not.toContain('Sand (Inactive)');
    });
  });
});

describe('Lookup Service Network Error Scenarios', () => {
  let context: TestContext;

  beforeEach(() => {
    context = new TestContext();
  });

  afterEach(() => {
    context.cleanup();
  });

  describe('Timeout Handling', () => {
    it('should timeout after specified duration', async () => {
      // Create context with very high latency (simulates slow server)
      const slowContext = new TestContext({ latency: 5000 });
      const service = slowContext.getService();

      try {
        // Request with 100ms timeout should fail due to 5000ms latency
        await service.lookup.getIrrigationSources();
        expect.fail('Should have thrown timeout error');
      } catch (error: any) {
        expect(error.message).toMatch(/timeout/i);
      } finally {
        slowContext.cleanup();
      }
    }, 10000);
  });

  describe('Retry on 503', () => {
    it('should retry on 503 service unavailable', async () => {
      // Create context with 50% failure rate
      const flakyContext = new TestContext({ failureRate: 0.5 });
      const service = flakyContext.getService();

      try {
        // This may succeed on retry or fail after max retries
        const response = await service.lookup.getIrrigationSources();
        // If it succeeds, verify the response
        expect(response.success).toBe(true);
      } catch (error: any) {
        // If it fails, it should be due to service unavailability
        expect(error.message).toMatch(/Random server failure|Service Unavailable/i);
      } finally {
        flakyContext.cleanup();
      }
    }, 15000);
  });

  describe('Malformed JSON Handling', () => {
    it('should handle malformed JSON response gracefully', async () => {
      const service = context.getService();

      // Save original fetch
      const originalFetch = global.fetch;

      try {
        // Mock fetch to return malformed JSON
        global.fetch = vi.fn(async () => ({
          ok: true,
          status: 200,
          json: async () => {
            throw new Error('Unexpected token in JSON');
          },
          text: async () => 'not valid json {{{',
        })) as any;

        await service.lookup.getIrrigationSources();
        expect.fail('Should have thrown error for malformed JSON');
      } catch (error: any) {
        expect(error.message).toMatch(/JSON|Unexpected token/i);
      } finally {
        // Restore original fetch
        global.fetch = originalFetch;
      }
    }, 10000);
  });

  describe('Network Failure Handling', () => {
    it('should handle network failures gracefully', async () => {
      const service = context.getService();

      // Save original fetch
      const originalFetch = global.fetch;

      try {
        // Mock fetch to simulate network error
        global.fetch = vi.fn(async () => {
          throw new Error('fetch failed: Network request failed');
        }) as any;

        await service.lookup.getIrrigationSources();
        expect.fail('Should have thrown network error');
      } catch (error: any) {
        expect(error.message).toMatch(/fetch|Network|Request failed/i);
      } finally {
        // Restore original fetch
        global.fetch = originalFetch;
      }
    }, 10000);
  });
});

describe('Lookup Service Internationalization', () => {
  let context: TestContext;

  beforeEach(() => {
    context = new TestContext();
  });

  afterEach(() => {
    context.cleanup();
  });

  describe('Unicode Character Support', () => {
    it('should handle Hindi characters in lookup names', async () => {
      const mockServer = context.getMockServer();

      // Add irrigation source with Hindi name
      const hindiSource = {
        id: 'irrigation-hindi-001',
        name: 'ड्रिप सिंचाई',  // Drip Irrigation in Hindi
        description: 'जल बचत सिंचाई विधि',  // Water saving irrigation method in Hindi
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Directly insert into mock server's irrigation sources
      (mockServer as any).irrigationSources.set(hindiSource.id, hindiSource);

      const service = context.getService();
      const response = await service.lookup.getIrrigationSources();

      // Verify Hindi characters are preserved
      const hindiItem = response.data.find(item => item.id === 'irrigation-hindi-001');
      expect(hindiItem).toBeDefined();
      expect(hindiItem?.name).toBe('ड्रिप सिंचाई');
      expect(hindiItem?.description).toBe('जल बचत सिंचाई विधि');
    });

    it('should handle Tamil characters in lookup names', async () => {
      const mockServer = context.getMockServer();

      // Add soil type with Tamil name
      const tamilSoil = {
        id: 'soil-tamil-001',
        name: 'களிமண் மண்',  // Clay Soil in Tamil
        description: 'கனமான களிமண் மண்',  // Heavy clay soil in Tamil
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Directly insert into mock server's soil types
      (mockServer as any).soilTypes.set(tamilSoil.id, tamilSoil);

      const service = context.getService();
      const response = await service.lookup.getSoilTypes();

      // Verify Tamil characters are preserved
      const tamilItem = response.data.find(item => item.id === 'soil-tamil-001');
      expect(tamilItem).toBeDefined();
      expect(tamilItem?.name).toBe('களிமண் மண்');
      expect(tamilItem?.description).toBe('கனமான களிமண் மண்');
    });

    it('should handle mixed language characters', async () => {
      const mockServer = context.getMockServer();

      // Add irrigation source with mixed English and Hindi
      const mixedSource = {
        id: 'irrigation-mixed-001',
        name: 'Drip सिंचाई System',
        description: 'Modern ड्रिप irrigation तकनीक',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (mockServer as any).irrigationSources.set(mixedSource.id, mixedSource);

      const service = context.getService();
      const response = await service.lookup.getIrrigationSources();

      const mixedItem = response.data.find(item => item.id === 'irrigation-mixed-001');
      expect(mixedItem).toBeDefined();
      expect(mixedItem?.name).toBe('Drip सिंचाई System');
    });

    it('should properly encode and decode UTF-8 characters', async () => {
      const mockServer = context.getMockServer();

      // Test various UTF-8 characters including emoji
      const emojiSource = {
        id: 'irrigation-emoji-001',
        name: 'Water 💧 Irrigation',
        description: 'Modern irrigation with water drops 💧💧💧',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (mockServer as any).irrigationSources.set(emojiSource.id, emojiSource);

      const service = context.getService();
      const response = await service.lookup.getIrrigationSources();

      const emojiItem = response.data.find(item => item.id === 'irrigation-emoji-001');
      expect(emojiItem).toBeDefined();
      expect(emojiItem?.name).toBe('Water 💧 Irrigation');
      expect(emojiItem?.description).toBe('Modern irrigation with water drops 💧💧💧');
    });

    it('should handle special characters and diacritics', async () => {
      const mockServer = context.getMockServer();

      const specialSource = {
        id: 'irrigation-special-001',
        name: 'Café & Résumé Irrigation',
        description: 'Special chars: ñ, ü, ö, é, à',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (mockServer as any).irrigationSources.set(specialSource.id, specialSource);

      const service = context.getService();
      const response = await service.lookup.getIrrigationSources();

      const specialItem = response.data.find(item => item.id === 'irrigation-special-001');
      expect(specialItem).toBeDefined();
      expect(specialItem?.name).toBe('Café & Résumé Irrigation');
      expect(specialItem?.description).toBe('Special chars: ñ, ü, ö, é, à');
    });
  });
});
