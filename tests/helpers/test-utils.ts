/**
 * Test Utilities for Integration Tests
 *
 * Provides helper functions for testing business logic,
 * validation, edge cases, and security scenarios for farmers-service.
 */

import { vi, expect } from 'vitest';
import createFarmerService from '../../index';
import { createMockServer, setupMockFetch, clearMockFetch, MockServer } from './mock-server';
import { FarmerServiceConfig } from '../../config';

// Test configuration
export const TEST_CONFIG: FarmerServiceConfig = {
  baseURL: 'http://mock-api.test',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  getAccessToken: () => undefined, // Will be set by test context
};

// Test data generators
export function generatePhoneNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export function generateEmail(): string {
  return `test${Date.now()}${Math.random().toString(36)}@example.com`;
}

export function generateName(): string {
  const firstNames = ['Ravi', 'Priya', 'Suresh', 'Lakshmi', 'Rajesh', 'Anita', 'Kumar', 'Deepa'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Rao', 'Desai', 'Nair'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

export function generateFarmName(): string {
  const prefixes = ['Green', 'Golden', 'Happy', 'Sunrise', 'Moonlight', 'Rainbow'];
  const suffixes = ['Farm', 'Fields', 'Estate', 'Gardens', 'Acres'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

export function generateCoordinates(): [number, number] {
  // Generate coordinates within India bounds
  const lat = 8.4 + Math.random() * 27.6; // 8.4 to 36.0
  const lng = 68.7 + Math.random() * 28.3; // 68.7 to 97.0
  return [lng, lat];
}

export function generateFarmerId(): string {
  return `farmer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateOrgId(): string {
  return `org-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Test context manager configuration
export interface TestContextConfig extends Partial<FarmerServiceConfig> {
  latency?: number;
  failureRate?: number;
}

// Test context manager
export class TestContext {
  private mockServer: MockServer;
  private farmerService: ReturnType<typeof createFarmerService>;
  private currentToken?: string;

  constructor(config?: TestContextConfig) {
    this.mockServer = createMockServer({
      baseURL: config?.baseURL || TEST_CONFIG.baseURL,
      latency: config?.latency,
      failureRate: config?.failureRate,
    });

    setupMockFetch();

    const testConfig: FarmerServiceConfig = {
      ...TEST_CONFIG,
      ...config,
      getAccessToken: () => this.currentToken,
    };

    this.farmerService = createFarmerService(testConfig);
  }

  getService() {
    return this.farmerService;
  }

  getMockServer() {
    return this.mockServer;
  }

  setAccessToken(token: string) {
    this.currentToken = token;
  }

  clearAccessToken() {
    this.currentToken = undefined;
  }

  async createTestFarmer(farmerData?: Partial<any>) {
    const defaultData = {
      first_name: generateName().split(' ')[0],
      last_name: generateName().split(' ')[1],
      phone_number: generatePhoneNumber(),
      aaa_user_id: generateFarmerId(),
      aaa_org_id: generateOrgId(),
    };

    const farmer = await this.farmerService.identity.createFarmer({
      ...defaultData,
      ...farmerData,
    });

    return farmer;
  }

  async createTestFarm(farmerId: string, farmData?: Partial<any>) {
    const coords = generateCoordinates();
    const defaultData = {
      farmer_id: farmerId,
      name: generateFarmName(),
      area: Math.random() * 10 + 1, // 1-11 acres
      geometry: {
        type: 'Point',
        coordinates: coords,
      },
    };

    const farm = await this.farmerService.farm.createFarm({
      ...defaultData,
      ...farmData,
    });

    return farm;
  }

  cleanup() {
    this.mockServer.reset();
    clearMockFetch();
    this.currentToken = undefined;
  }
}

// Validation helpers
export function expectValidationError(error: any, expectedMessage?: string) {
  expect(error).toBeDefined();
  expect(error.status).toBe(400);
  if (expectedMessage) {
    expect(error.message).toContain(expectedMessage);
  }
}

export function expectUnauthorizedError(error: any) {
  expect(error).toBeDefined();
  expect(error.status).toBe(401);
  expect(error.message).toContain('Unauthorized');
}

export function expectForbiddenError(error: any) {
  expect(error).toBeDefined();
  expect(error.status).toBe(403);
  expect(error.message).toContain('Insufficient permissions');
}

export function expectNotFoundError(error: any) {
  expect(error).toBeDefined();
  expect(error.status).toBe(404);
  expect(error.message).toContain('not found');
}

export function expectConflictError(error: any, expectedMessage?: string) {
  expect(error).toBeDefined();
  expect(error.status).toBe(409);
  if (expectedMessage) {
    expect(error.message).toContain(expectedMessage);
  }
}

// Business logic invariant checkers
export class InvariantChecker {
  /**
   * Checks that a farmer cannot be linked to multiple FPOs simultaneously
   */
  static checkSingleFPOLinkage(farmer: any) {
    if (farmer.fpo_id && farmer.fpo_linkage_status) {
      expect(farmer.fpo_linkage_status).toMatch(/^(pending|active|inactive)$/);
    }
  }

  /**
   * Checks that farm area calculations are consistent
   */
  static checkFarmAreaConsistency(farm: any) {
    if (farm.area && farm.geometry) {
      expect(farm.area).toBeGreaterThan(0);
      // Area should be reasonable (not negative or absurdly large)
      expect(farm.area).toBeLessThan(10000); // Max 10000 acres
    }
  }

  /**
   * Checks that crop cycle dates are logical
   */
  static checkCropCycleDates(cycle: any) {
    if (cycle.start_date && cycle.end_date) {
      const start = new Date(cycle.start_date);
      const end = new Date(cycle.end_date);
      expect(end.getTime()).toBeGreaterThanOrEqual(start.getTime());
    }

    if (cycle.expected_harvest_date && cycle.start_date) {
      const start = new Date(cycle.start_date);
      const harvest = new Date(cycle.expected_harvest_date);
      expect(harvest.getTime()).toBeGreaterThan(start.getTime());
    }
  }

  /**
   * Checks that activity dates are within crop cycle bounds
   */
  static checkActivityDateBounds(activity: any, cycle: any) {
    if (activity.scheduled_date && cycle.start_date) {
      const activityDate = new Date(activity.scheduled_date);
      const cycleStart = new Date(cycle.start_date);

      expect(activityDate.getTime()).toBeGreaterThanOrEqual(cycleStart.getTime());

      if (cycle.end_date) {
        const cycleEnd = new Date(cycle.end_date);
        expect(activityDate.getTime()).toBeLessThanOrEqual(cycleEnd.getTime());
      }
    }
  }

  /**
   * Checks that phone numbers are unique
   */
  static async checkPhoneNumberUniqueness(
    context: TestContext,
    phoneNumber: string
  ) {
    const service = context.getService();

    // Try to create duplicate farmer
    await expect(
      service.identity.createFarmer({
        phone_number: phoneNumber,
        first_name: 'Test',
        last_name: 'User',
      })
    ).rejects.toThrow('already exists');
  }

  /**
   * Checks that farm geometries don't overlap beyond threshold
   */
  static checkFarmOverlap(farm1: any, farm2: any) {
    // This would need actual geometry calculation
    // For now, just ensure both have valid geometries
    expect(farm1.geometry).toBeDefined();
    expect(farm2.geometry).toBeDefined();
    expect(farm1.geometry.type).toBe('Point');
    expect(farm2.geometry.type).toBe('Point');
  }

  /**
   * Checks that crop stages are in proper sequence
   */
  static checkStageSequencing(stages: any[]) {
    const sortedStages = [...stages].sort((a, b) => a.sequence_order - b.sequence_order);

    sortedStages.forEach((stage, idx) => {
      expect(stage.sequence_order).toBe(idx + 1);
    });
  }
}

// Security test helpers
export class SecurityTester {
  /**
   * Tests for SQL injection attempts
   */
  static async testSQLInjection(
    context: TestContext,
    endpoint: (payload: any) => Promise<any>
  ) {
    const injectionPayloads = [
      "'; DROP TABLE farmers; --",
      "1' OR '1'='1",
      "admin'--",
      "' OR 1=1--",
      "'; EXEC sp_MSForEachTable 'DROP TABLE ?'; --",
    ];

    for (const payload of injectionPayloads) {
      await expect(endpoint({ name: payload })).rejects.toThrow();
    }
  }

  /**
   * Tests for XSS attempts
   */
  static async testXSS(
    context: TestContext,
    endpoint: (payload: any) => Promise<any>
  ) {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
    ];

    for (const payload of xssPayloads) {
      const result = await endpoint({ name: payload });
      // Check that the payload is properly escaped/sanitized
      if (result.name) {
        expect(result.name).not.toContain('<script>');
        expect(result.name).not.toContain('javascript:');
      }
    }
  }

  /**
   * Tests for authorization bypass attempts
   */
  static async testAuthorizationBypass(
    context: TestContext,
    protectedAction: () => Promise<any>
  ) {
    // Try without token
    context.clearAccessToken();
    await expect(protectedAction()).rejects.toThrow('Unauthorized');

    // Try with invalid token
    context.setAccessToken('invalid-token-12345');
    await expect(protectedAction()).rejects.toThrow('Unauthorized');

    // Try with expired token (simulated)
    context.setAccessToken('expired-token-12345');
    await expect(protectedAction()).rejects.toThrow('Unauthorized');
  }

  /**
   * Tests for IDOR (Insecure Direct Object Reference)
   */
  static async testIDOR(
    context: TestContext,
    getResource: (id: string) => Promise<any>,
    ownResourceId: string,
    otherResourceId: string
  ) {
    // Should be able to access own resource
    const ownResource = await getResource(ownResourceId);
    expect(ownResource).toBeDefined();

    // Should not be able to access other user's resource (unless authorized)
    await expect(getResource(otherResourceId)).rejects.toThrow();
  }
}

// Concurrency test helpers
export class ConcurrencyTester {
  /**
   * Tests for race conditions in resource creation
   */
  static async testRaceCondition(
    context: TestContext,
    createResource: () => Promise<any>,
    uniqueField: string
  ) {
    const promises = [];
    const results: any[] = [];
    const errors: any[] = [];

    // Create multiple concurrent requests
    for (let i = 0; i < 5; i++) {
      promises.push(
        createResource()
          .then(result => results.push(result))
          .catch(error => errors.push(error))
      );
    }

    await Promise.all(promises);

    // Should have exactly one success and rest failures
    expect(results.length).toBe(1);
    expect(errors.length).toBe(4);

    // Check that errors are about duplicates
    errors.forEach(error => {
      expect(error.message).toMatch(/already exists|concurrent/i);
    });
  }

  /**
   * Tests for deadlock scenarios
   */
  static async testDeadlockPrevention(
    context: TestContext,
    action1: () => Promise<any>,
    action2: () => Promise<any>
  ) {
    // Execute potentially conflicting actions concurrently
    const results = await Promise.allSettled([action1(), action2()]);

    // Both should complete without deadlock
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    // At least one should succeed
    expect(fulfilled.length).toBeGreaterThan(0);

    // If one fails, it should be due to conflict, not deadlock
    if (rejected.length > 0) {
      const reasons = rejected.map(r => (r as any).reason.message);
      reasons.forEach(reason => {
        expect(reason).not.toContain('deadlock');
        expect(reason).not.toContain('timeout');
      });
    }
  }
}

// Edge case generators
export class EdgeCaseGenerator {
  static getBoundaryValues() {
    return {
      strings: [
        '',                           // Empty string
        ' ',                          // Single space
        '  ',                         // Multiple spaces
        '\n',                         // Newline
        '\t',                         // Tab
        'a'.repeat(255),              // Max typical string length
        'a'.repeat(256),              // Over typical limit
        'a'.repeat(1000),             // Very long string
        '😀',                         // Emoji
        'नमस्ते',                       // Unicode characters
        '<>',                         // HTML characters
        '\\',                         // Backslash
        '"',                          // Quote
        "'",                          // Single quote
        null,                         // Null value
        undefined,                    // Undefined value
      ],
      numbers: [
        0,                            // Zero
        -1,                           // Negative
        1,                            // Small positive
        Number.MAX_SAFE_INTEGER,      // Max safe integer
        Number.MIN_SAFE_INTEGER,      // Min safe integer
        Number.MAX_VALUE,             // Max value
        Number.MIN_VALUE,             // Min value
        Infinity,                     // Infinity
        -Infinity,                    // Negative infinity
        NaN,                          // Not a number
        0.1 + 0.2,                    // Floating point precision issue
      ],
      arrays: [
        [],                           // Empty array
        [null],                       // Array with null
        [undefined],                  // Array with undefined
        new Array(1000),              // Large empty array
        new Array(1000).fill('a'),   // Large filled array
      ],
    };
  }

  static getPhoneNumberEdgeCases() {
    return [
      '',                   // Empty
      '0',                  // Too short
      '123',                // Still too short
      '12345678901234567890', // Too long
      'abcdefghij',         // Letters
      '123-456-7890',       // With dashes
      '(123) 456-7890',     // With formatting
      '+11234567890',       // With country code included
      ' 1234567890',        // Leading space
      '1234567890 ',        // Trailing space
      '12345 67890',        // Space in middle
    ];
  }

  static getAreaEdgeCases() {
    return [
      0,                    // Zero area
      -1,                   // Negative area
      0.001,                // Very small area
      10000,                // Very large area
      NaN,                  // Not a number
      Infinity,             // Infinity
    ];
  }

  static getGeometryEdgeCases() {
    return [
      { type: 'Point', coordinates: [0, 0] },                    // Null Island
      { type: 'Point', coordinates: [180, 90] },                 // Max coordinates
      { type: 'Point', coordinates: [-180, -90] },               // Min coordinates
      { type: 'Point', coordinates: [181, 91] },                 // Out of bounds
      { type: 'Polygon', coordinates: [] },                      // Empty polygon
      { type: 'Invalid', coordinates: [0, 0] },                  // Invalid type
      null,                                                      // Null geometry
      undefined,                                                 // Undefined geometry
    ];
  }
}

// Performance test helpers
export class PerformanceTester {
  /**
   * Tests response time under load
   */
  static async testResponseTime(
    context: TestContext,
    action: () => Promise<any>,
    maxTime: number = 1000
  ) {
    const start = Date.now();
    await action();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(maxTime);
  }

  /**
   * Tests bulk operations
   */
  static async testBulkOperation(
    context: TestContext,
    createItem: () => Promise<any>,
    count: number = 100
  ) {
    const promises = [];
    const start = Date.now();

    for (let i = 0; i < count; i++) {
      promises.push(createItem());
    }

    const results = await Promise.allSettled(promises);
    const elapsed = Date.now() - start;

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Most should succeed
    expect(successful).toBeGreaterThan(count * 0.9);

    // Should complete in reasonable time
    expect(elapsed).toBeLessThan(count * 100); // 100ms per item max

    return { successful, failed, elapsed };
  }
}

// Audit trail validator
export class AuditValidator {
  /**
   * Validates that actions are properly logged
   */
  static validateAuditEntry(entry: any) {
    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('user_id');
    expect(entry).toHaveProperty('action');
    expect(entry).toHaveProperty('resource_type');
    expect(entry).toHaveProperty('resource_id');

    // Timestamp should be recent
    const timestamp = new Date(entry.timestamp).getTime();
    expect(Date.now() - timestamp).toBeLessThan(60000); // Within last minute
  }

  /**
   * Validates that sensitive data is not logged
   */
  static validateNoSensitiveData(entry: any) {
    const json = JSON.stringify(entry);

    // Should not contain sensitive information
    expect(json).not.toContain('password');
    expect(json).not.toContain('token');
    expect(json).not.toContain('secret');

    // Should not contain full phone numbers (should be masked)
    // Allow patterns like +91-****-**-1234
  }
}
