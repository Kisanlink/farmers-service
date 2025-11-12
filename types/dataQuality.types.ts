/**
 * Data Quality Service Types
 * Types for data quality and validation operations
 */

export interface ValidateGeometryRequest {
  wkt: string;
  check_bounds?: boolean;
}

export interface ValidateGeometryData {
  is_valid: boolean;
  errors?: string[];
  area_ha?: number;
}

export interface DetectOverlapsRequest {
  limit?: number;
  min_overlap_area_ha?: number;
  org_id?: string;
}

export interface DetectOverlapsData {
  overlaps: Array<{
    farm_id_1: string;
    farm_id_2: string;
    overlap_area_ha: number;
  }>;
  total_overlaps: number;
}

export interface ReconcileAAALinksRequest {
  org_id: string;
  dry_run?: boolean;
}

export interface ReconcileAAALinksData {
  reconciled_count: number;
  errors: number;
  message: string;
}

export interface RebuildSpatialIndexesRequest {
  force?: boolean;
}

export interface RebuildSpatialIndexesData {
  indexes_rebuilt: number;
  message: string;
}

export interface ValidateGeometryResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: ValidateGeometryData;
}

export interface DetectOverlapsResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: DetectOverlapsData;
}

export interface ReconcileAAALinksResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: ReconcileAAALinksData;
}

export interface RebuildSpatialIndexesResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: RebuildSpatialIndexesData;
}
