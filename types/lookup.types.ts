/**
 * Type Definitions for Lookup Service
 *
 * Types for irrigation sources, soil types, and other lookup data.
 */

import { BaseResponse, LookupItem } from './index';

/**
 * Irrigation source item
 */
export interface IrrigationSource extends LookupItem {
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Soil type item
 */
export interface SoilType extends LookupItem {
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Response type for irrigation sources
 */
export type IrrigationSourcesResponse = BaseResponse<IrrigationSource[]>;

/**
 * Response type for soil types
 */
export type SoilTypesResponse = BaseResponse<SoilType[]>;
