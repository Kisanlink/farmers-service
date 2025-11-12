/**
 * Organization Service
 *
 * Service for organization, group, and role management.
 * Uses factory pattern for dependency injection and testability.
 * Note: This service uses a different API base URL (AAA service).
 */

import { ApiClient } from '../utils/apiClient';
import {
  Organization,
  OrganizationResponse,
  OrganizationListResponse,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  Group,
  GroupResponse,
  GroupListResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  RoleListResponse,
  GroupRoleListResponse,
  AssignGroupRoleRequest,
} from '../types/organization.types';

/**
 * Build hierarchy from flat list of organizations
 */
const buildOrganizationHierarchy = (organizations: Organization[]): Organization[] => {
  const orgMap = new Map<string, Organization>();
  const rootOrgs: Organization[] = [];

  organizations.forEach((org) => {
    orgMap.set(org.id, { ...org, children: [] });
  });

  organizations.forEach((org) => {
    const orgWithChildren = orgMap.get(org.id)!;
    if (org.parent_id && orgMap.has(org.parent_id)) {
      const parent = orgMap.get(org.parent_id)!;
      parent.children!.push(orgWithChildren);
    } else {
      rootOrgs.push(orgWithChildren);
    }
  });

  return rootOrgs;
};

/**
 * Build hierarchy from flat list of groups
 */
const buildGroupHierarchy = (groups: Group[]): Group[] => {
  const groupMap = new Map<string, Group>();
  const rootGroups: Group[] = [];

  groups.forEach((group) => {
    groupMap.set(group.id, { ...group, children: [] });
  });

  groups.forEach((group) => {
    const groupWithChildren = groupMap.get(group.id)!;
    if (group.parent_id && groupMap.has(group.parent_id)) {
      const parent = groupMap.get(group.parent_id)!;
      parent.children!.push(groupWithChildren);
    } else {
      rootGroups.push(groupWithChildren);
    }
  });

  return rootGroups;
};

/**
 * Create organization service with injected API client
 *
 * @param apiClient - Injected API client instance
 * @returns Organization service methods
 */
const createOrganizationService = (apiClient: ApiClient) => {
  return {
    // === Organization CRUD ===

    /**
     * List organizations
     */
    listOrganizations: (params?: {
      limit?: number;
      offset?: number;
      include_inactive?: boolean;
      type?: string;
    }): Promise<OrganizationListResponse> => {
      return apiClient.get<OrganizationListResponse>('/api/v2/organizations', { params });
    },

    /**
     * Get organization by ID
     */
    getOrganizationById: (id: string): Promise<OrganizationResponse> => {
      return apiClient.get<OrganizationResponse>(`/api/v2/organizations/${id}`);
    },

    /**
     * Create organization
     */
    createOrganization: (data: CreateOrganizationRequest): Promise<OrganizationResponse> => {
      return apiClient.post<OrganizationResponse>('/api/v2/organizations', data);
    },

    /**
     * Update organization
     */
    updateOrganization: (
      id: string,
      data: UpdateOrganizationRequest
    ): Promise<OrganizationResponse> => {
      return apiClient.put<OrganizationResponse>(`/api/v2/organizations/${id}`, data);
    },

    /**
     * Delete organization
     */
    deleteOrganization: (id: string): Promise<{ success: boolean; message: string }> => {
      return apiClient.delete<{ success: boolean; message: string }>(
        `/api/v2/organizations/${id}`
      );
    },

    // === Group CRUD ===

    /**
     * List groups for an organization
     */
    listGroups: (
      orgId: string,
      params?: {
        limit?: number;
        offset?: number;
        include_inactive?: boolean;
      }
    ): Promise<GroupListResponse> => {
      return apiClient.get<GroupListResponse>(`/api/v1/organizations/${orgId}/groups`, { params });
    },

    /**
     * Get group by ID
     */
    getGroupById: (orgId: string, groupId: string): Promise<GroupResponse> => {
      return apiClient.get<GroupResponse>(`/api/v1/organizations/${orgId}/groups/${groupId}`);
    },

    /**
     * Create group
     */
    createGroup: (orgId: string, data: CreateGroupRequest): Promise<GroupResponse> => {
      return apiClient.post<GroupResponse>(`/api/v1/organizations/${orgId}/groups`, data);
    },

    /**
     * Update group
     */
    updateGroup: (
      orgId: string,
      groupId: string,
      data: UpdateGroupRequest
    ): Promise<GroupResponse> => {
      return apiClient.put<GroupResponse>(`/api/v1/organizations/${orgId}/groups/${groupId}`, data);
    },

    /**
     * Delete group
     */
    deleteGroup: (
      orgId: string,
      groupId: string
    ): Promise<{ success: boolean; message: string }> => {
      return apiClient.delete<{ success: boolean; message: string }>(
        `/api/v1/organizations/${orgId}/groups/${groupId}`
      );
    },

    // === Roles ===

    /**
     * List all roles
     */
    listRoles: (params?: { limit?: number; offset?: number }): Promise<RoleListResponse> => {
      return apiClient.get<RoleListResponse>(`/api/v2/roles`, { params });
    },

    /**
     * List roles assigned to a group within an organization
     */
    listGroupRoles: (
      orgId: string,
      groupId: string,
      params?: { limit?: number; offset?: number }
    ): Promise<GroupRoleListResponse> => {
      return apiClient.get<GroupRoleListResponse>(
        `/api/v1/organizations/${orgId}/groups/${groupId}/roles`,
        { params }
      );
    },

    /**
     * Assign role to a group within an organization
     */
    assignRoleToGroup: (
      orgId: string,
      groupId: string,
      data: AssignGroupRoleRequest
    ): Promise<{ success: boolean; message: string }> => {
      return apiClient.post<{ success: boolean; message: string }>(
        `/api/v1/organizations/${orgId}/groups/${groupId}/roles`,
        data
      );
    },

    /**
     * Remove role from a group
     */
    removeRoleFromGroup: (
      orgId: string,
      groupId: string,
      roleId: string
    ): Promise<{ success: boolean; message: string }> => {
      return apiClient.delete<{ success: boolean; message: string }>(
        `/api/v1/organizations/${orgId}/groups/${groupId}/roles/${roleId}`
      );
    },

    // === Utility Methods ===

    /**
     * Build hierarchy from flat list of organizations
     */
    buildOrganizationHierarchy,

    /**
     * Build hierarchy from flat list of groups
     */
    buildGroupHierarchy,
  };
};

export default createOrganizationService;
