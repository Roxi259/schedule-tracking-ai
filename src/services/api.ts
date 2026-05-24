/**
 * API Service - HTTP Client for Spring Backend
 * Handles all communication with the backend API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateReminderRequest,
  Reminder,
  ApiResponse,
  PaginatedResponse,
  TasksQueryParams,
} from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080/api';

class ApiService {
  private axiosInstance: AxiosInstance;
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken();
            const token = await this.getToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            await this.clearTokens();
            throw refreshError;
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // Authentication
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data,
    );
    if (response.data.data) {
      await this.saveTokens(response.data.data);
    }
    return response.data.data!;
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data,
    );
    if (response.data.data) {
      await this.saveTokens(response.data.data);
    }
    return response.data.data!;
  }

  async logout(): Promise<void> {
    await this.clearTokens();
  }

  async refreshAccessToken(): Promise<void> {
    const refreshToken = await AsyncStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken },
    );
    if (response.data.data) {
      await this.saveTokens(response.data.data);
    }
  }

  // User endpoints
  async getUserProfile(userId: string): Promise<User> {
    const response = await this.axiosInstance.get<ApiResponse<User>>(
      `/users/${userId}`,
    );
    return response.data.data!;
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await this.axiosInstance.put<ApiResponse<User>>(
      `/users/${userId}`,
      data,
    );
    return response.data.data!;
  }

  // Task endpoints
  async getTasks(params?: TasksQueryParams): Promise<PaginatedResponse<Task>> {
    const response = await this.axiosInstance.get<
      ApiResponse<PaginatedResponse<Task>>
    >('/tasks', { params });
    return response.data.data!;
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    const response = await this.axiosInstance.get<ApiResponse<Task[]>>(
      '/tasks',
      { params: { date } },
    );
    return response.data.data || [];
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await this.axiosInstance.post<ApiResponse<Task>>(
      '/tasks',
      data,
    );
    return response.data.data!;
  }

  async updateTask(taskId: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await this.axiosInstance.put<ApiResponse<Task>>(
      `/tasks/${taskId}`,
      data,
    );
    return response.data.data!;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.axiosInstance.delete(`/tasks/${taskId}`);
  }

  // Reminder endpoints
  async createReminder(data: CreateReminderRequest): Promise<Reminder> {
    const response = await this.axiosInstance.post<ApiResponse<Reminder>>(
      '/reminders',
      data,
    );
    return response.data.data!;
  }

  async getTaskReminders(taskId: string): Promise<Reminder[]> {
    const response = await this.axiosInstance.get<ApiResponse<Reminder[]>>(
      `/reminders/task/${taskId}`,
    );
    return response.data.data || [];
  }

  async deleteReminder(reminderId: string): Promise<void> {
    await this.axiosInstance.delete(`/reminders/${reminderId}`);
  }

  // Token management
  private async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.tokenKey);
  }

  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await AsyncStorage.setItem(this.tokenKey, authResponse.token);
    if (authResponse.refreshToken) {
      await AsyncStorage.setItem(this.refreshTokenKey, authResponse.refreshToken);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.tokenKey);
      await AsyncStorage.removeItem(this.refreshTokenKey);
    } catch (error) {
      console.warn('Error clearing tokens:', error);
    }
  }

  setApiBaseUrl(url: string): void {
    this.axiosInstance.defaults.baseURL = url;
  }
}

export default new ApiService();