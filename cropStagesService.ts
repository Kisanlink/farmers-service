import axios, { AxiosInstance } from 'axios';

export interface CropStageData {
  id: string;
  crop_id: string;
  stage_id: string;
  stage_name: string;
  stage_order: number;
  description?: string;
  duration_days?: number;
  duration_unit?: 'DAYS' | 'WEEKS' | 'MONTHS';
  is_active: boolean;
  properties?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface AssignStageRequest {
  stage_id: string;
  stage_order: number;
  duration_days?: number;
  duration_unit?: 'DAYS' | 'WEEKS' | 'MONTHS';
  metadata?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

export interface ReorderStagesRequest {
  stage_orders: Record<string, number>; // map of stage_id -> order
  metadata?: Record<string, unknown>;
}

export interface UpdateCropStageRequest {
  stage_order?: number;
  duration_days?: number;
  duration_unit?: 'DAYS' | 'WEEKS' | 'MONTHS';
  is_active?: boolean;
  metadata?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

export interface CropStagesResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: CropStageData[];
}

export interface CropStageResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: CropStageData;
}

export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  request_id?: string;
  data: T;
}

export class CropStagesService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8000') {
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

  async listCropStages(cropId: string): Promise<CropStagesResponse> {
    const res = await this.apiClient.get<CropStagesResponse>(`/api/v1/crops/${cropId}/stages`);
    return res.data;
  }

  async assignStageToCrop(cropId: string, req: AssignStageRequest): Promise<CropStageResponse> {
    const res = await this.apiClient.post<CropStageResponse>(`/api/v1/crops/${cropId}/stages`, req);
    return res.data;
  }

  async reorderCropStages(cropId: string, req: ReorderStagesRequest): Promise<BaseResponse<null>> {
    const res = await this.apiClient.post<BaseResponse<null>>(`/api/v1/crops/${cropId}/stages/reorder`, req);
    return res.data;
  }

  async updateCropStage(cropId: string, stageId: string, req: UpdateCropStageRequest): Promise<CropStageResponse> {
    const res = await this.apiClient.put<CropStageResponse>(`/api/v1/crops/${cropId}/stages/${stageId}`, req);
    return res.data;
  }

  async removeCropStage(cropId: string, stageId: string): Promise<BaseResponse<null>> {
    const res = await this.apiClient.delete<BaseResponse<null>>(`/api/v1/crops/${cropId}/stages/${stageId}`);
    return res.data;
  }
}

export const cropStagesService = new CropStagesService();



