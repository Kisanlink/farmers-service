import axios, { AxiosInstance } from 'axios';

// Organization interfaces
export interface Organization {
  id: string;
  name: string;
  description?: string;
  type?: string;
  parent_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Organization[];
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  parent_id?: string;
  type?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
  type?: string;
}

export interface OrganizationResponse {
  success: boolean;
  message: string;
  data: Organization;
}

export interface OrganizationListResponse {
  success: boolean;
  message: string;
  data: Organization[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Group interfaces
export interface Group {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  organization_id: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Group[];
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
}

export interface GroupResponse {
  success: boolean;
  message: string;
  data: Group;
}

export interface GroupListResponse {
  success: boolean;
  message: string;
  data: Group[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Roles interfaces
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: Role[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface AssignGroupRoleRequest {
  role_id: string;
  starts_at?: string; // ISO date-time
  ends_at?: string;   // ISO date-time
}

export interface GroupRoleAssignment {
  role_id: string;
  group_id: string;
  organization_id: string;
  starts_at?: string;
  ends_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupRoleListResponse {
  success: boolean;
  message: string;
  data: GroupRoleAssignment[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export class OrganizationService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8080') {
    this.apiClient = axios.create({ baseURL });
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Organization CRUD operations

  /**
   * List organizations
   * GET /api/v2/organizations
   */
  async listOrganizations(params?: {
    limit?: number;
    offset?: number;
    include_inactive?: boolean;
    type?: string;
  }): Promise<OrganizationListResponse> {
    try {
      const response = await this.apiClient.get<OrganizationListResponse>('/api/v2/organizations', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error listing organizations:', error);
      throw error;
    }
  }

  /**
   * Get organization by ID
   * GET /api/v2/organizations/{id}
   */
  async getOrganizationById(id: string): Promise<OrganizationResponse> {
    try {
      const response = await this.apiClient.get<OrganizationResponse>(`/api/v2/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create organization
   * POST /api/v2/organizations
   */
  async createOrganization(data: CreateOrganizationRequest): Promise<OrganizationResponse> {
    try {
      const response = await this.apiClient.post<OrganizationResponse>('/api/v2/organizations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }

  /**
   * Update organization
   * PUT /api/v2/organizations/{id}
   */
  async updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<OrganizationResponse> {
    try {
      const response = await this.apiClient.put<OrganizationResponse>(`/api/v2/organizations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating organization ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete organization
   * DELETE /api/v2/organizations/{id}
   */
  async deleteOrganization(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiClient.delete(`/api/v2/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting organization ${id}:`, error);
      throw error;
    }
  }

  // Group CRUD operations

  /**
   * List groups for an organization
   * GET /api/v1/organizations/{orgId}/groups
   */
  async listGroups(orgId: string, params?: {
    limit?: number;
    offset?: number;
    include_inactive?: boolean;
  }): Promise<GroupListResponse> {
    try {
      const response = await this.apiClient.get<GroupListResponse>(`/api/v1/organizations/${orgId}/groups`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Error listing groups for organization ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Get group by ID
   * GET /api/v1/organizations/{orgId}/groups/{groupId}
   */
  async getGroupById(orgId: string, groupId: string): Promise<GroupResponse> {
    try {
      const response = await this.apiClient.get<GroupResponse>(`/api/v1/organizations/${orgId}/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${groupId} for organization ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Create group
   * POST /api/v1/organizations/{orgId}/groups
   */
  async createGroup(orgId: string, data: CreateGroupRequest): Promise<GroupResponse> {
    try {
      const response = await this.apiClient.post<GroupResponse>(`/api/v1/organizations/${orgId}/groups`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating group for organization ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Update group
   * PUT /api/v1/organizations/{orgId}/groups/{groupId}
   */
  async updateGroup(orgId: string, groupId: string, data: UpdateGroupRequest): Promise<GroupResponse> {
    try {
      const response = await this.apiClient.put<GroupResponse>(`/api/v1/organizations/${orgId}/groups/${groupId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating group ${groupId} for organization ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Delete group
   * DELETE /api/v1/organizations/{orgId}/groups/{groupId}
   */
  async deleteGroup(orgId: string, groupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiClient.delete(`/api/v1/organizations/${orgId}/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting group ${groupId} for organization ${orgId}:`, error);
      throw error;
    }
  }

  // Roles

  /**
   * List all roles
   * GET /api/v2/roles
   */
  async listRoles(params?: { limit?: number; offset?: number }): Promise<RoleListResponse> {
    try {
      const response = await this.apiClient.get<RoleListResponse>(`/api/v2/roles`, { params });
      return response.data;
    } catch (error) {
      console.error('Error listing roles:', error);
      throw error;
    }
  }

  /**
   * List roles assigned to a group within an organization
   * GET /api/v1/organizations/{orgId}/groups/{groupId}/roles
   */
  async listGroupRoles(orgId: string, groupId: string, params?: { limit?: number; offset?: number }): Promise<GroupRoleListResponse> {
    try {
      const response = await this.apiClient.get<GroupRoleListResponse>(`/api/v1/organizations/${orgId}/groups/${groupId}/roles`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error listing roles for group ${groupId} in organization ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Assign role to a group within an organization
   * POST /api/v1/organizations/{orgId}/groups/{groupId}/roles
   */
  async assignRoleToGroup(orgId: string, groupId: string, data: AssignGroupRoleRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiClient.post<{ success: boolean; message: string }>(`/api/v1/organizations/${orgId}/groups/${groupId}/roles`, data);
      return response.data;
    } catch (error) {
      console.error(`Error assigning role to group ${groupId} in organization ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Remove role from a group
   * DELETE /api/v1/organizations/{orgId}/groups/{groupId}/roles/{roleId}
   */
  async removeRoleFromGroup(orgId: string, groupId: string, roleId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiClient.delete<{ success: boolean; message: string }>(`/api/v1/organizations/${orgId}/groups/${groupId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing role ${roleId} from group ${groupId} in organization ${orgId}:`, error);
      throw error;
    }
  }

  // Utility methods

  /**
   * Build hierarchy from flat list of organizations
   */
  buildOrganizationHierarchy(organizations: Organization[]): Organization[] {
    const orgMap = new Map<string, Organization>();
    const rootOrgs: Organization[] = [];

    // Create a map of all organizations
    organizations.forEach(org => {
      orgMap.set(org.id, { ...org, children: [] });
    });

    // Build hierarchy
    organizations.forEach(org => {
      const orgWithChildren = orgMap.get(org.id)!;
      if (org.parent_id && orgMap.has(org.parent_id)) {
        const parent = orgMap.get(org.parent_id)!;
        parent.children!.push(orgWithChildren);
      } else {
        rootOrgs.push(orgWithChildren);
      }
    });

    return rootOrgs;
  }

  /**
   * Build hierarchy from flat list of groups
   */
  buildGroupHierarchy(groups: Group[]): Group[] {
    const groupMap = new Map<string, Group>();
    const rootGroups: Group[] = [];

    // Create a map of all groups
    groups.forEach(group => {
      groupMap.set(group.id, { ...group, children: [] });
    });

    // Build hierarchy
    groups.forEach(group => {
      const groupWithChildren = groupMap.get(group.id)!;
      if (group.parent_id && groupMap.has(group.parent_id)) {
        const parent = groupMap.get(group.parent_id)!;
        parent.children!.push(groupWithChildren);
      } else {
        rootGroups.push(groupWithChildren);
      }
    });

    return rootGroups;
  }
}

// Export service instance
export const organizationService = new OrganizationService();
export default organizationService;
