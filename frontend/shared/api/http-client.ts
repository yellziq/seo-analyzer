import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  Report,
  SeoAnalyzeRequest,
  SeoAnalyzeResponse,
  UpdateSettingsRequest,
  UserProfile,
} from "@shared/api/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

class HttpClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    const response = await this.client.get<TResponse>(url, config);
    return response.data;
  }

  async post<TRequest, TResponse>(url: string, data: TRequest): Promise<TResponse> {
    const response = await this.client.post<TResponse>(url, data);
    return response.data;
  }

  async put<TRequest, TResponse>(url: string, data: TRequest): Promise<TResponse> {
    const response = await this.client.put<TResponse>(url, data);
    return response.data;
  }

  async patch<TRequest, TResponse>(url: string, data: TRequest): Promise<TResponse> {
    const response = await this.client.patch<TResponse>(url, data);
    return response.data;
  }

  async delete<TResponse>(url: string): Promise<TResponse> {
    const response = await this.client.delete<TResponse>(url);
    return response.data;
  }
}

export const httpClient = new HttpClient();

export const api = {
  getProfile: (): Promise<UserProfile> => httpClient.get<UserProfile>("/profile"),
  analyzeSeo: (data: SeoAnalyzeRequest): Promise<SeoAnalyzeResponse> =>
    httpClient.post<SeoAnalyzeRequest, SeoAnalyzeResponse>("/seo/analyze", data),
  updateProfile: (data: UserProfile): Promise<UserProfile> =>
    httpClient.put<UserProfile, UserProfile>("/profile", data),
  updateSettings: (data: UpdateSettingsRequest): Promise<UpdateSettingsRequest> =>
    httpClient.patch<UpdateSettingsRequest, UpdateSettingsRequest>("/settings", data),
  deleteReport: (id: string): Promise<{ success: boolean }> =>
    httpClient.delete<{ success: boolean }>(`/reports/${id}`),
  getReports: (): Promise<Report[]> => httpClient.get<Report[]>("/reports"),
};
