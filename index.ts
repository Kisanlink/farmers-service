// Farmer Service V2 - Main Export File
// This file provides a centralized way to import all farmer service modules

// Import all types
import type {
  // Core data types
  FarmerProfileData,
  FarmData,
  FarmActivityData,
  CropCycleData,
  
  // Request types
  CreateFarmerRequest,
  UpdateFarmerRequest,
  CreateFarmRequest,
  CreateActivityRequest,
  CompleteActivityRequest,
  StartCycleRequest,
  UpdateCycleRequest,
  EndCycleRequest,
  CreateFPORequest,
  RegisterFPORequest,
  LinkFarmerRequest,
  UnlinkFarmerRequest,
  CreateKisanSathiRequest,
  AssignKisanSathiRequest,
  ReassignKisanSathiRequest,
  SeedRequest,
  PermissionCheckRequest,
  ValidateGeometryRequest,
  DetectOverlapsRequest,
  ReconcileAAALinksRequest,
  RebuildSpatialIndexesRequest,
  
  // Response types
  FarmerResponse,
  FarmerListResponse,
  FarmResponse,
  FarmListResponse,
  FarmActivityResponse,
  FarmActivityListResponse,
  CropCycleResponse,
  CropCycleListResponse,
  FPOResponse,
  FPOReferenceResponse,
  FarmerLinkageResponse,
  KisanSathiResponse,
  KisanSathiAssignmentResponse,
  HealthCheckResponse,
  SeedResponse,
  PermissionCheckResponse,
  AuditResponse,
  ValidateGeometryResponse,
  DetectOverlapsResponse,
  ReconcileAAALinksResponse,
  RebuildSpatialIndexesResponse,
  
  // Query parameter types
  FarmerListQueryParams,
  FarmListQueryParams,
  ActivityListQueryParams,
  CropCycleListQueryParams,
  AuditQueryParams,
  
  // Utility types
  BaseResponse,
  ErrorResponse,
  ApiConfig
} from './types';

// Import all service classes
import { IdentityService, identityService } from './identityService';
import { FarmService, farmService } from './farmService';
import { ActivityService, activityService } from './activityService';
import { BulkService, bulkService } from './bulkService';
import { ReportingService, reportingService } from './reportingService';
import { CropService, cropService } from './cropService';
import { CropCyclesService, cropCyclesService } from './cropCyclesService';
import { CropStagesService, cropStagesService } from './cropStagesService';
import type { Role, RoleListResponse, AssignGroupRoleRequest, GroupRoleAssignment, GroupRoleListResponse } from './organizationService';
import { OrganizationService, organizationService } from './organizationService';
import { LookupService, lookupService } from './lookupService';
import { FPOService, fpoService } from './fpoService';
import { LinkageService, linkageService } from './linkageService';
import { KisanSathiService, kisanSathiService } from './kisanSathiService';
import { AdminService, adminService } from './adminService';
import { DataQualityService, dataQualityService } from './dataQualityService';
import { CropActivityService, cropActivityService } from './cropActivityService';

// Export all types
export * from './types';

// Export all services
export { IdentityService, identityService };
export { FarmService, farmService };
export { ActivityService, activityService };
export { BulkService, bulkService };
export { ReportingService, reportingService };
export { CropService, cropService };
export { CropCyclesService, cropCyclesService };
export { CropStagesService, cropStagesService };
export { OrganizationService, organizationService };
export { LookupService, lookupService };
export type { Role, RoleListResponse, AssignGroupRoleRequest, GroupRoleAssignment, GroupRoleListResponse };
export type { LookupItem, LookupDataResponse } from './lookupService';
export { FPOService, fpoService };
export { LinkageService, linkageService };
export { KisanSathiService, kisanSathiService };
export { AdminService, adminService };
export { DataQualityService, dataQualityService };
export { CropActivityService, cropActivityService };

// Crop stages types
export type {
  CropStageData,
  AssignStageRequest,
  ReorderStagesRequest,
  UpdateCropStageRequest,
  CropStagesResponse,
  CropStageResponse,
} from './cropStagesService';

// Organization types
export type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationResponse,
  OrganizationListResponse,
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupResponse,
  GroupListResponse,
} from './organizationService';

// Re-export commonly used types for convenience
export type {
  // Core data types
  FarmerProfileData,
  FarmData,
  FarmActivityData,
  CropCycleData,
  
  // Request types
  CreateFarmerRequest,
  UpdateFarmerRequest,
  CreateFarmRequest,
  CreateActivityRequest,
  CompleteActivityRequest,
  StartCycleRequest,
  UpdateCycleRequest,
  EndCycleRequest,
  CreateFPORequest,
  RegisterFPORequest,
  LinkFarmerRequest,
  UnlinkFarmerRequest,
  CreateKisanSathiRequest,
  AssignKisanSathiRequest,
  ReassignKisanSathiRequest,
  SeedRequest,
  PermissionCheckRequest,
  ValidateGeometryRequest,
  DetectOverlapsRequest,
  ReconcileAAALinksRequest,
  RebuildSpatialIndexesRequest,
  
  // Response types
  FarmerResponse,
  FarmerListResponse,
  FarmResponse,
  FarmListResponse,
  FarmActivityResponse,
  FarmActivityListResponse,
  CropCycleResponse,
  CropCycleListResponse,
  FPOResponse,
  FPOReferenceResponse,
  FarmerLinkageResponse,
  KisanSathiResponse,
  KisanSathiAssignmentResponse,
  HealthCheckResponse,
  SeedResponse,
  PermissionCheckResponse,
  AuditResponse,
  ValidateGeometryResponse,
  DetectOverlapsResponse,
  ReconcileAAALinksResponse,
  RebuildSpatialIndexesResponse,
  
  // Query parameter types
  FarmerListQueryParams,
  FarmListQueryParams,
  ActivityListQueryParams,
  CropCycleListQueryParams,
  AuditQueryParams,
  
  // Utility types
  BaseResponse,
  ErrorResponse,
  ApiConfig
} from './types';

// Main service class that combines all services
export class FarmerService {
  public readonly identity: IdentityService;
  public readonly farm: FarmService;
  public readonly activity: ActivityService;
  public readonly bulk: BulkService;
  public readonly reporting: ReportingService;
  public readonly crop: CropService;
  public readonly cropCycles: CropCyclesService;
  public readonly cropStages: CropStagesService;
  public readonly organization: OrganizationService;
  public readonly lookup: LookupService;
  public readonly fpo: FPOService;
  public readonly linkage: LinkageService;
  public readonly kisanSathi: KisanSathiService;
  public readonly admin: AdminService;
  public readonly dataQuality: DataQualityService;
  public readonly cropActivity: CropActivityService;

  constructor(config?: {
    baseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }) {
    // Initialize all services with the same configuration
    this.identity = new IdentityService();
    this.farm = new FarmService();
    this.activity = new ActivityService();
    this.bulk = new BulkService();
    this.reporting = new ReportingService();
    this.crop = new CropService();
    this.cropCycles = new CropCyclesService();
    this.cropStages = new CropStagesService();
    this.organization = new OrganizationService();
    this.lookup = new LookupService();
    this.fpo = new FPOService();
    this.linkage = new LinkageService();
    this.kisanSathi = new KisanSathiService();
    this.admin = new AdminService();
    this.dataQuality = new DataQualityService();
    this.cropActivity = new CropActivityService();
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    identity: boolean;
    farm: boolean;
    activity: boolean;
    bulk: boolean;
    reporting: boolean;
      crop: boolean;
      cropCycles: boolean;
    fpo: boolean;
    linkage: boolean;
    kisanSathi: boolean;
    admin: boolean;
    dataQuality: boolean;
    cropActivity: boolean;
  }> {
    const health = {
      identity: false,
      farm: false,
      activity: false,
      bulk: false,
      reporting: false,
      crop: false,
      cropCycles: false,
      fpo: false,
      linkage: false,
      kisanSathi: false,
      admin: false,
      dataQuality: false,
      cropActivity: false
    };

    try {
      // Test each service with a simple operation
      await this.identity.listFarmers({ page: 1, page_size: 1 });
      health.identity = true;
    } catch (error) {
      console.warn('Identity service health check failed:', error);
    }

    try {
      await this.farm.listFarms({ page: 1, page_size: 1 });
      health.farm = true;
    } catch (error) {
      console.warn('Farm service health check failed:', error);
    }

    try {
      await this.activity.listActivities({ page: 1, page_size: 1 });
      health.activity = true;
    } catch (error) {
      console.warn('Activity service health check failed:', error);
    }

    try {
      await this.bulk.downloadBulkTemplate();
      health.bulk = true;
    } catch (error) {
      console.warn('Bulk service health check failed:', error);
    }

    try {
      await this.reporting.getAvailableReportTypes();
      health.reporting = true;
    } catch (error) {
      console.warn('Reporting service health check failed:', error);
    }

    try {
      await this.crop.listCrops({ page: 1, page_size: 1 });
      health.crop = true;
    } catch (error) {
      console.warn('Crop service health check failed:', error);
    }

    try {
      await this.cropCycles.listCropCycles({ page: 1, page_size: 1 });
      health.cropCycles = true;
    } catch (error) {
      console.warn('Crop cycles service health check failed:', error);
    }

    try {
      await this.admin.getHealthStatus();
      health.admin = true;
    } catch (error) {
      console.warn('Admin service health check failed:', error);
    }

    // Note: FPO, Linkage, KisanSathi, DataQuality, and CropActivity services
    // don't have simple health check endpoints, so we'll mark them as healthy
    // if the admin service is healthy (indicating the API is accessible)
    if (health.admin) {
      health.fpo = true;
      health.linkage = true;
      health.kisanSathi = true;
      health.dataQuality = true;
      health.cropActivity = true;
    }

    return health;
  }

  /**
   * Get API configuration
   */
  getConfig(): {
    baseUrl: string;
    timeout: number;
    headers: Record<string, string>;
  } {
    return {
      baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
  }
}

// Export singleton instance
export const farmerService = new FarmerService();

// Default export
export default FarmerService;

// Utility functions for common operations
export const farmerServiceUtils = {
  /**
   * Create a farmer with a farm in one operation
   */
  async createFarmerWithFarm(
    farmerData: CreateFarmerRequest,
    farmData: CreateFarmRequest
  ): Promise<{
    farmer: FarmerResponse;
    farm: FarmResponse;
  }> {
    try {
      // Create farmer first
      const farmer = await farmerService.identity.createFarmer(farmerData);
      
      // Create farm with farmer's user ID
      const farm = await farmerService.farm.createFarm({
        ...farmData,
        aaa_user_id: farmer.data.aaa_user_id || ''
      });

      return { farmer, farm };
    } catch (error) {
      console.error('Error creating farmer with farm:', error);
      throw error;
    }
  },

  /**
   * Create a farmer with farm and crop cycle in one operation
   */
  async createFarmerWithFarmAndCropCycle(
    farmerData: CreateFarmerRequest,
    farmData: CreateFarmRequest,
    cropCycleData: StartCycleRequest
  ): Promise<{
    farmer: FarmerResponse;
    farm: FarmResponse;
    cropCycle: CropCycleResponse;
  }> {
    try {
      // Create farmer first
      const farmer = await farmerService.identity.createFarmer(farmerData);
      
      // Create farm with farmer's user ID
      const farm = await farmerService.farm.createFarm({
        ...farmData,
        aaa_user_id: farmer.data.aaa_user_id || ''
      });

      // Create crop cycle with farm ID
      const cropCycle = await farmerService.crop.startCropCycle({
        ...cropCycleData,
        farm_id: farm.data.id || ''
      });

      return { farmer, farm, cropCycle };
    } catch (error) {
      console.error('Error creating farmer with farm and crop cycle:', error);
      throw error;
    }
  },

  /**
   * Get complete farmer profile with farms and activities
   */
  async getCompleteFarmerProfile(farmerId: string): Promise<{
    farmer: FarmerResponse;
    farms: FarmListResponse;
    activities: FarmActivityListResponse;
  }> {
    try {
      const [farmer, farms, activities] = await Promise.all([
        farmerService.identity.getFarmerById(farmerId),
        farmerService.farm.getFarmsByFarmerId(farmerId),
        farmerService.activity.listActivities({ 
          // Note: This would need to be filtered by farmer's farms in a real implementation
        })
      ]);

      return { farmer, farms, activities };
    } catch (error) {
      console.error('Error getting complete farmer profile:', error);
      throw error;
    }
  },

  /**
   * Export farmer portfolio with all related data
   */
  async exportCompleteFarmerPortfolio(
    farmerId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<any> {
    try {
      return await farmerService.reporting.exportFarmerPortfolio(farmerId, { format });
    } catch (error) {
      console.error('Error exporting complete farmer portfolio:', error);
      throw error;
    }
  },

  /**
   * Validate and create multiple farmers with farms
   */
  async validateAndCreateMultipleFarmers(
    farmersData: Array<{
      farmer: CreateFarmerRequest;
      farms: CreateFarmRequest[];
    }>
  ): Promise<{
    successful: Array<{ farmer: FarmerResponse; farms: FarmResponse[] }>;
    failed: Array<{ data: any; error: string }>;
  }> {
    const successful: Array<{ farmer: FarmerResponse; farms: FarmResponse[] }> = [];
    const failed: Array<{ data: any; error: string }> = [];

    for (const data of farmersData) {
      try {
        // Create farmer
        const farmer = await farmerService.identity.createFarmer(data.farmer);
        
        // Create farms
        const farms: FarmResponse[] = [];
        for (const farmData of data.farms) {
          const farm = await farmerService.farm.createFarm({
            ...farmData,
            aaa_user_id: farmer.data.aaa_user_id || ''
          });
          farms.push(farm);
        }

        successful.push({ farmer, farms });
      } catch (error) {
        failed.push({
          data,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { successful, failed };
  },

  /**
   * Create FPO with farmer linkage in one operation
   */
  async createFPOWithFarmerLinkage(
    fpoData: CreateFPORequest,
    farmerId: string,
    linkageData: Omit<LinkFarmerRequest, 'farmer_id' | 'org_id'>
  ): Promise<{
    fpo: FPOResponse;
    linkage: FarmerLinkageResponse;
  }> {
    try {
      // Create FPO first
      const fpo = await farmerService.fpo.createFPO(fpoData);
      
      // Link farmer to FPO
      const linkage = await farmerService.linkage.linkFarmer({
        ...linkageData,
        farmer_id: farmerId,
        org_id: fpo.data.aaa_org_id || ''
      });

      return { fpo, linkage };
    } catch (error) {
      console.error('Error creating FPO with farmer linkage:', error);
      throw error;
    }
  },

  /**
   * Create KisanSathi and assign to farmer in one operation
   */
  async createAndAssignKisanSathi(
    kisanSathiData: CreateKisanSathiRequest,
    farmerId: string,
    assignmentData: Omit<AssignKisanSathiRequest, 'kisansathi_id' | 'farmer_id' | 'org_id'>
  ): Promise<{
    kisanSathi: KisanSathiResponse;
    assignment: KisanSathiAssignmentResponse;
  }> {
    try {
      // Create KisanSathi first
      const kisanSathi = await farmerService.kisanSathi.createKisanSathi(kisanSathiData);
      
      // Assign to farmer
      const assignment = await farmerService.kisanSathi.assignKisanSathi({
        ...assignmentData,
        kisansathi_id: kisanSathi.data.id,
        farmer_id: farmerId,
        org_id: kisanSathiData.org_id
      });

      return { kisanSathi, assignment };
    } catch (error) {
      console.error('Error creating and assigning KisanSathi:', error);
      throw error;
    }
  },

  /**
   * Complete farm setup with all components
   */
  async completeFarmSetup(
    farmerData: CreateFarmerRequest,
    farmData: CreateFarmRequest,
    cropCycleData: StartCycleRequest,
    fpoData?: CreateFPORequest,
    kisanSathiData?: CreateKisanSathiRequest
  ): Promise<{
    farmer: FarmerResponse;
    farm: FarmResponse;
    cropCycle: CropCycleResponse;
    fpo?: FPOResponse;
    kisanSathi?: KisanSathiResponse;
    linkage?: FarmerLinkageResponse;
    assignment?: KisanSathiAssignmentResponse;
  }> {
    try {
      // Create farmer
      const farmer = await farmerService.identity.createFarmer(farmerData);
      
      // Create farm
      const farm = await farmerService.farm.createFarm({
        ...farmData,
        aaa_user_id: farmer.data.aaa_user_id || ''
      });

      // Create crop cycle
      const cropCycle = await farmerService.crop.startCropCycle({
        ...cropCycleData,
        farm_id: farm.data.id || ''
      });

      const result: any = { farmer, farm, cropCycle };

      // Optionally create FPO and link farmer
      if (fpoData) {
        const fpo = await farmerService.fpo.createFPO(fpoData);
        const linkage = await farmerService.linkage.linkFarmer({
          farmer_id: farmer.data.id || '',
          org_id: fpo.data.aaa_org_id || '',
          linkage_type: 'MEMBER',
          linkage_date: new Date().toISOString()
        });
        result.fpo = fpo;
        result.linkage = linkage;
      }

      // Optionally create KisanSathi and assign
      if (kisanSathiData) {
        const kisanSathi = await farmerService.kisanSathi.createKisanSathi(kisanSathiData);
        const assignment = await farmerService.kisanSathi.assignKisanSathi({
          kisansathi_id: kisanSathi.data.id,
          farmer_id: farmer.data.id || '',
          org_id: kisanSathiData.org_id,
          assignment_date: new Date().toISOString()
        });
        result.kisanSathi = kisanSathi;
        result.assignment = assignment;
      }

      return result;
    } catch (error) {
      console.error('Error completing farm setup:', error);
      throw error;
    }
  }
};

// Export utility functions
export { farmerServiceUtils as utils };

// Export stages service
export { stagesService, StagesService } from './stagesService';

// Export crop and crop cycles types
export type {
  CropData,
  CropLookupData,
  CropVarietyData,
  CreateCropRequest,
  UpdateCropRequest,
  CreateVarietyRequest,
  UpdateVarietyRequest,
  CropResponse,
  CropListResponse,
  CropLookupResponse,
  VarietyResponse,
  VarietyListResponse,
  VarietyLookupResponse,
  LookupResponse,
} from './cropService';
export type {
  CropCycleData as CropCycleDataV2,
  CreateCropCycleRequest,
  UpdateCropCycleRequest,
  EndCropCycleRequest,
  CropCycleResponse as CropCycleResponseV2,
  CropCycleListResponse as CropCycleListResponseV2,
} from './cropCyclesService';
