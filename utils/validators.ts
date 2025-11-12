/**
 * Response Schema Validators using Zod
 *
 * This module provides runtime validation for API responses to ensure type safety
 * and catch malformed data early. Implements validation schemas for all API response types.
 */

import { z } from 'zod';

/**
 * Base response schema - validates common response structure
 */
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  timestamp: z.string().optional(),
  request_id: z.string().optional(),
});

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string(),
  details: z.record(z.unknown()).optional(),
  correlation_id: z.string().optional(),
  timestamp: z.string().optional(),
});

/**
 * Lookup item schema - validates individual lookup items
 */
export const LookupItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Irrigation source schema
 */
export const IrrigationSourceSchema = LookupItemSchema;

/**
 * Soil type schema
 */
export const SoilTypeSchema = LookupItemSchema;

/**
 * Lookup data response schema - validates array of lookup items
 */
export const LookupDataResponseSchema = BaseResponseSchema.extend({
  data: z.array(LookupItemSchema),
});

/**
 * Irrigation sources response schema
 */
export const IrrigationSourcesResponseSchema = BaseResponseSchema.extend({
  data: z.array(IrrigationSourceSchema),
});

/**
 * Soil types response schema
 */
export const SoilTypesResponseSchema = BaseResponseSchema.extend({
  data: z.array(SoilTypeSchema),
});

/**
 * Paginated response schema - validates paginated API responses
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseResponseSchema.extend({
    data: z.array(dataSchema),
    page: z.number(),
    page_size: z.number(),
    total: z.number(),
    total_pages: z.number().optional(),
  });

/**
 * Address schema
 */
export const AddressSchema = z.object({
  street: z.string().optional(),
  village: z.string().optional(),
  block: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * Geometry schema (GeoJSON)
 */
export const GeometrySchema = z.object({
  type: z.enum(['Point', 'Polygon', 'MultiPolygon', 'LineString']),
  coordinates: z.union([
    z.array(z.number()),
    z.array(z.array(z.number())),
    z.array(z.array(z.array(z.number()))),
  ]),
});

/**
 * Farmer schema
 */
export const FarmerSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email().optional(),
  aaa_user_id: z.string().optional(),
  aaa_org_id: z.string().optional(),
  address: AddressSchema.optional(),
  fpo_id: z.string().optional(),
  fpo_linkage_status: z.string().optional(),
  kisan_sathi_id: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Farm schema
 */
export const FarmSchema = z.object({
  id: z.string(),
  farmer_id: z.string(),
  name: z.string(),
  area: z.number(),
  geometry: GeometrySchema.optional(),
  soil_type_id: z.string().optional(),
  irrigation_source_ids: z.array(z.string()).optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Crop schema
 */
export const CropSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  season: z.string().optional(),
  is_perennial: z.boolean(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Crop variety schema
 */
export const CropVarietySchema = z.object({
  id: z.string(),
  crop_id: z.string(),
  name: z.string(),
  properties: z.record(z.any()).optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Crop cycle schema
 */
export const CropCycleSchema = z.object({
  id: z.string(),
  farm_id: z.string(),
  crop_id: z.string(),
  variety_id: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  expected_harvest_date: z.string().optional(),
  season: z.string().optional(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Activity schema
 */
export const ActivitySchema = z.object({
  id: z.string(),
  crop_cycle_id: z.string(),
  activity_type: z.string(),
  scheduled_date: z.string(),
  completed_date: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Farmer response schemas
 */
export const FarmerResponseSchema = BaseResponseSchema.extend({
  data: FarmerSchema,
});

export const FarmersListResponseSchema = PaginatedResponseSchema(FarmerSchema);

/**
 * Farm response schemas
 */
export const FarmResponseSchema = BaseResponseSchema.extend({
  data: FarmSchema,
});

export const FarmsListResponseSchema = PaginatedResponseSchema(FarmSchema);

/**
 * Crop response schemas
 */
export const CropResponseSchema = BaseResponseSchema.extend({
  data: CropSchema,
});

export const CropsListResponseSchema = BaseResponseSchema.extend({
  data: z.array(CropSchema),
});

/**
 * Crop variety response schemas
 */
export const CropVarietyResponseSchema = BaseResponseSchema.extend({
  data: CropVarietySchema,
});

export const CropVarietiesListResponseSchema = BaseResponseSchema.extend({
  data: z.array(CropVarietySchema),
});

/**
 * Crop cycle response schemas
 */
export const CropCycleResponseSchema = BaseResponseSchema.extend({
  data: CropCycleSchema,
});

export const CropCyclesListResponseSchema = BaseResponseSchema.extend({
  data: z.array(CropCycleSchema),
});

/**
 * Activity response schemas
 */
export const ActivityResponseSchema = BaseResponseSchema.extend({
  data: ActivitySchema,
});

export const ActivitiesListResponseSchema = BaseResponseSchema.extend({
  data: z.array(ActivitySchema),
});

/**
 * Validation helper function
 * Validates response data against a Zod schema and throws detailed error if validation fails
 */
export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      throw new Error(`Response validation failed: ${issues}`);
    }
    throw error;
  }
}

/**
 * Safe validation helper - returns result with success flag instead of throwing
 */
export function safeValidateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const issues = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    return { success: false, error: `Response validation failed: ${issues}` };
  }
}

/**
 * Type exports for use in application code
 */
export type ValidatedLookupItem = z.infer<typeof LookupItemSchema>;
export type ValidatedIrrigationSource = z.infer<typeof IrrigationSourceSchema>;
export type ValidatedSoilType = z.infer<typeof SoilTypeSchema>;
export type ValidatedFarmer = z.infer<typeof FarmerSchema>;
export type ValidatedFarm = z.infer<typeof FarmSchema>;
export type ValidatedCrop = z.infer<typeof CropSchema>;
export type ValidatedCropVariety = z.infer<typeof CropVarietySchema>;
export type ValidatedCropCycle = z.infer<typeof CropCycleSchema>;
export type ValidatedActivity = z.infer<typeof ActivitySchema>;
