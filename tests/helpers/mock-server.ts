/**
 * Mock Server for Integration Tests
 *
 * This mock server simulates Farmers Service API responses with realistic data and edge cases.
 * It includes validation logic, state management, and error simulation capabilities.
 */

import { vi } from 'vitest';

export interface MockServerConfig {
  baseURL: string;
  failureRate?: number; // Simulate random failures
  latency?: number; // Simulate network latency
}

interface MockFarmer {
  id: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  aaa_user_id?: string;
  aaa_org_id?: string;
  address?: any;
  fpo_id?: string;
  fpo_linkage_status?: string;
  kisan_sathi_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MockFarm {
  id: string;
  farmer_id: string;
  name: string;
  area: number;
  geometry: any;
  soil_type_id?: string;
  irrigation_source_ids?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MockCrop {
  id: string;
  name: string;
  category?: string;
  season?: string;
  is_perennial: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MockCropVariety {
  id: string;
  crop_id: string;
  name: string;
  properties?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MockCropCycle {
  id: string;
  farm_id: string;
  crop_id: string;
  variety_id?: string;
  start_date: string;
  end_date?: string;
  expected_harvest_date?: string;
  season?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface MockActivity {
  id: string;
  crop_cycle_id: string;
  activity_type: string;
  scheduled_date: string;
  completed_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MockLookupItem {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MockSession {
  access_token: string;
  user_id: string;
  expires_at: number;
  created_at: number;
}

export class MockServer {
  private farmers: Map<string, MockFarmer> = new Map();
  private farms: Map<string, MockFarm> = new Map();
  private crops: Map<string, MockCrop> = new Map();
  private varieties: Map<string, MockCropVariety> = new Map();
  private cropCycles: Map<string, MockCropCycle> = new Map();
  private activities: Map<string, MockActivity> = new Map();
  private irrigationSources: Map<string, MockLookupItem> = new Map();
  private soilTypes: Map<string, MockLookupItem> = new Map();
  private sessions: Map<string, MockSession> = new Map();
  private revokedTokens: Set<string> = new Set();

  // Track request history for validation
  private requestHistory: Array<{ method: string; url: string; body?: any; timestamp: number }> = [];

  // Simulate concurrent operation locks
  private locks: Map<string, number> = new Map();

  constructor(private config: MockServerConfig) {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Create test farmers
    const farmer1: MockFarmer = {
      id: 'farmer-001',
      first_name: 'Ravi',
      last_name: 'Sharma',
      phone_number: '9876543210',
      email: 'ravi.sharma@example.com',
      aaa_user_id: 'user-001',
      aaa_org_id: 'org-001',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const farmer2: MockFarmer = {
      id: 'farmer-002',
      first_name: 'Priya',
      last_name: 'Patel',
      phone_number: '9123456789',
      aaa_user_id: 'user-002',
      aaa_org_id: 'org-001',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.farmers.set(farmer1.id, farmer1);
    this.farmers.set(farmer2.id, farmer2);

    // Create test farms
    const farm1: MockFarm = {
      id: 'farm-001',
      farmer_id: 'farmer-001',
      name: 'Green Farm',
      area: 5.5,
      geometry: {
        type: 'Point',
        coordinates: [77.5946, 12.9716], // Bangalore
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.farms.set(farm1.id, farm1);

    // Create test crops
    const crop1: MockCrop = {
      id: 'crop-001',
      name: 'Rice',
      category: 'Cereal',
      season: 'Kharif',
      is_perennial: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const crop2: MockCrop = {
      id: 'crop-002',
      name: 'Wheat',
      category: 'Cereal',
      season: 'Rabi',
      is_perennial: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.crops.set(crop1.id, crop1);
    this.crops.set(crop2.id, crop2);

    // Create lookup data
    const irrigation1: MockLookupItem = {
      id: 'irrigation-001',
      name: 'Drip Irrigation',
      description: 'Water saving irrigation method',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const irrigation2: MockLookupItem = {
      id: 'irrigation-002',
      name: 'Flood Irrigation',
      description: 'Traditional flooding method',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const irrigation3: MockLookupItem = {
      id: 'irrigation-003',
      name: 'Sprinkler Irrigation (Inactive)',
      description: 'Inactive sprinkler method',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.irrigationSources.set(irrigation1.id, irrigation1);
    this.irrigationSources.set(irrigation2.id, irrigation2);
    this.irrigationSources.set(irrigation3.id, irrigation3);

    const soil1: MockLookupItem = {
      id: 'soil-001',
      name: 'Clay',
      description: 'Heavy clay soil',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const soil2: MockLookupItem = {
      id: 'soil-002',
      name: 'Loam',
      description: 'Balanced soil type',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const soil3: MockLookupItem = {
      id: 'soil-003',
      name: 'Sand (Inactive)',
      description: 'Inactive sandy soil',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.soilTypes.set(soil1.id, soil1);
    this.soilTypes.set(soil2.id, soil2);
    this.soilTypes.set(soil3.id, soil3);

    // Create test session
    const session: MockSession = {
      access_token: 'test-token-12345',
      user_id: 'user-001',
      expires_at: Date.now() + 3600000, // 1 hour
      created_at: Date.now(),
    };

    this.sessions.set(session.access_token, session);
  }

  // Helper to simulate latency
  private async simulateLatency() {
    if (this.config.latency) {
      await new Promise(resolve => setTimeout(resolve, this.config.latency));
    }
  }

  // Helper to simulate failures
  private shouldFail(): boolean {
    if (this.config.failureRate) {
      return Math.random() < this.config.failureRate;
    }
    return false;
  }

  // Validate token
  private validateToken(authHeader?: string): MockSession | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.replace('Bearer ', '');

    // Check if token has been revoked
    if (this.revokedTokens.has(token)) {
      return null;
    }

    const session = this.sessions.get(token);

    if (!session || session.expires_at < Date.now()) {
      return null;
    }

    return session;
  }

  // Revoke session/token
  revokeSession(token: string): void {
    this.revokedTokens.add(token);
  }

  // Check for concurrent operations (race condition simulation)
  private checkConcurrentOperation(key: string): boolean {
    const lastOperation = this.locks.get(key);
    const now = Date.now();

    if (lastOperation && now - lastOperation < 100) {
      // Operation attempted within 100ms - potential race condition
      return true;
    }

    this.locks.set(key, now);
    return false;
  }

  // API Handlers
  async handleRequest(method: string, url: string, body?: any, headers?: Record<string, string>): Promise<any> {
    await this.simulateLatency();

    // Track request
    this.requestHistory.push({ method, url, body, timestamp: Date.now() });

    // Random failure simulation
    if (this.shouldFail()) {
      throw new Error('Random server failure (503 Service Unavailable)');
    }

    // Route requests
    const urlPath = url.replace(this.config.baseURL, '');

    // Lookup endpoints
    if (urlPath === '/api/v1/lookups/irrigation-sources' && method === 'GET') {
      return this.handleGetIrrigationSources();
    }

    if (urlPath === '/api/v1/lookups/soil-types' && method === 'GET') {
      return this.handleGetSoilTypes();
    }

    // Identity endpoints
    if (urlPath === '/api/v1/identity/farmers' && method === 'GET') {
      return this.handleListFarmers(headers?.['Authorization']);
    }

    if (urlPath === '/api/v1/identity/farmers' && method === 'POST') {
      return this.handleCreateFarmer(body, headers?.['Authorization']);
    }

    if (urlPath.match(/^\/api\/v1\/identity\/farmers\/id\/[^\/]+$/) && method === 'GET') {
      const farmerId = urlPath.split('/').pop()!;
      return this.handleGetFarmer(farmerId, headers?.['Authorization']);
    }

    if (urlPath.match(/^\/api\/v1\/identity\/farmers\/id\/[^\/]+$/) && method === 'PUT') {
      const farmerId = urlPath.split('/').pop()!;
      return this.handleUpdateFarmer(farmerId, body, headers?.['Authorization']);
    }

    if (urlPath.match(/^\/api\/v1\/identity\/farmers\/id\/[^\/]+$/) && method === 'DELETE') {
      const farmerId = urlPath.split('/').pop()!;
      return this.handleDeleteFarmer(farmerId, headers?.['Authorization']);
    }

    // Farm endpoints
    if (urlPath === '/api/v1/farms' && method === 'GET') {
      return this.handleListFarms(headers?.['Authorization']);
    }

    if (urlPath === '/api/v1/farms' && method === 'POST') {
      return this.handleCreateFarm(body, headers?.['Authorization']);
    }

    throw new Error(`Unhandled request: ${method} ${urlPath}`);
  }

  // Lookup Handlers
  private handleGetIrrigationSources() {
    // Filter out inactive items
    const sources = Array.from(this.irrigationSources.values()).filter(
      source => source.is_active === true
    );
    return {
      success: true,
      message: 'Irrigation sources retrieved successfully',
      data: sources,
      timestamp: new Date().toISOString(),
    };
  }

  private handleGetSoilTypes() {
    // Filter out inactive items
    const types = Array.from(this.soilTypes.values()).filter(
      type => type.is_active === true
    );
    return {
      success: true,
      message: 'Soil types retrieved successfully',
      data: types,
      timestamp: new Date().toISOString(),
    };
  }

  // Identity Handlers
  private handleListFarmers(authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const farmers = Array.from(this.farmers.values());

    return {
      success: true,
      message: 'Farmers retrieved successfully',
      data: farmers,
      total: farmers.length,
      page: 1,
      page_size: 10,
      timestamp: new Date().toISOString(),
    };
  }

  private handleCreateFarmer(body: any, authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const { phone_number, first_name, last_name } = body;

    // Validation
    if (!phone_number) {
      throw new Error('Phone number is required');
    }

    // Check for race condition on duplicate phone numbers
    const concurrencyKey = `create-farmer:${phone_number}`;
    if (this.checkConcurrentOperation(concurrencyKey)) {
      throw new Error('Concurrent farmer creation attempt detected');
    }

    // Check if farmer exists
    const existingFarmer = Array.from(this.farmers.values()).find(
      f => f.phone_number === phone_number
    );

    if (existingFarmer) {
      throw new Error('Farmer with this phone number already exists');
    }

    // Create new farmer
    const newFarmer: MockFarmer = {
      id: `farmer-${Date.now()}-${Math.random().toString(36)}`,
      first_name,
      last_name,
      phone_number,
      ...body,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.farmers.set(newFarmer.id, newFarmer);

    return {
      success: true,
      message: 'Farmer created successfully',
      data: newFarmer,
      timestamp: new Date().toISOString(),
    };
  }

  private handleGetFarmer(farmerId: string, authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const farmer = this.farmers.get(farmerId);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    return {
      success: true,
      message: 'Farmer retrieved successfully',
      data: farmer,
      timestamp: new Date().toISOString(),
    };
  }

  private handleUpdateFarmer(farmerId: string, body: any, authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const farmer = this.farmers.get(farmerId);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    // Update fields
    Object.assign(farmer, body, {
      updated_at: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Farmer updated successfully',
      data: farmer,
      timestamp: new Date().toISOString(),
    };
  }

  private handleDeleteFarmer(farmerId: string, authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const farmer = this.farmers.get(farmerId);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    this.farmers.delete(farmerId);

    return {
      success: true,
      message: 'Farmer deleted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  // Farm Handlers
  private handleListFarms(authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const farms = Array.from(this.farms.values());

    return {
      success: true,
      message: 'Farms retrieved successfully',
      data: farms,
      total: farms.length,
      page: 1,
      page_size: 10,
      timestamp: new Date().toISOString(),
    };
  }

  private handleCreateFarm(body: any, authHeader?: string) {
    const session = this.validateToken(authHeader);
    if (!session) {
      throw new Error('Unauthorized');
    }

    const { farmer_id, name, area, geometry } = body;

    // Validation
    if (!farmer_id || !name) {
      throw new Error('Farmer ID and name are required');
    }

    // Check if farmer exists
    const farmer = this.farmers.get(farmer_id);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    // Validate area
    if (area && (area <= 0 || area > 10000)) {
      throw new Error('Invalid farm area');
    }

    // Create new farm
    const newFarm: MockFarm = {
      id: `farm-${Date.now()}-${Math.random().toString(36)}`,
      farmer_id,
      name,
      area,
      geometry,
      ...body,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.farms.set(newFarm.id, newFarm);

    return {
      success: true,
      message: 'Farm created successfully',
      data: newFarm,
      timestamp: new Date().toISOString(),
    };
  }

  // Public methods for testing
  reset() {
    this.farmers.clear();
    this.farms.clear();
    this.crops.clear();
    this.varieties.clear();
    this.cropCycles.clear();
    this.activities.clear();
    this.irrigationSources.clear();
    this.soilTypes.clear();
    this.sessions.clear();
    this.revokedTokens.clear();
    this.requestHistory = [];
    this.locks.clear();
    this.seedInitialData();
  }

  getRequestHistory() {
    return this.requestHistory;
  }

  getFarmerByPhone(phone_number: string): MockFarmer | undefined {
    return Array.from(this.farmers.values()).find(
      f => f.phone_number === phone_number
    );
  }

  getSessionByToken(token: string): MockSession | undefined {
    return this.sessions.get(token);
  }
}

// Create a singleton mock server instance
let mockServerInstance: MockServer | null = null;

export function createMockServer(config?: Partial<MockServerConfig>): MockServer {
  const defaultConfig: MockServerConfig = {
    baseURL: 'http://mock-api.test',
    failureRate: 0,
    latency: 0,
    ...config,
  };

  mockServerInstance = new MockServer(defaultConfig);
  return mockServerInstance;
}

export function getMockServer(): MockServer {
  if (!mockServerInstance) {
    throw new Error('Mock server not initialized. Call createMockServer() first.');
  }
  return mockServerInstance;
}

// Mock fetch implementation
export function setupMockFetch() {
  global.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const mockServer = getMockServer();
    const urlString = typeof url === 'string' ? url : url.toString();
    const method = init?.method || 'GET';
    const body = init?.body ? JSON.parse(init.body as string) : undefined;
    const headers = init?.headers as Record<string, string>;

    try {
      const response = await mockServer.handleRequest(method, urlString, body, headers);

      return {
        ok: true,
        status: 200,
        json: async () => response,
        text: async () => JSON.stringify(response),
      } as Response;
    } catch (error: any) {
      const status = error.message.includes('Unauthorized') ? 401 :
                     error.message.includes('Insufficient permissions') ? 403 :
                     error.message.includes('not found') ? 404 :
                     error.message.includes('already exists') ? 409 :
                     error.message.includes('Invalid') ? 400 :
                     error.message.includes('Random server failure') ? 503 : 500;

      return {
        ok: false,
        status,
        json: async () => ({ error: error.message }),
        text: async () => JSON.stringify({ error: error.message }),
      } as Response;
    }
  }) as any;
}

export function clearMockFetch() {
  if (global.fetch && 'mockClear' in global.fetch) {
    (global.fetch as any).mockClear();
  }
}
