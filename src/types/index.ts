/**
 * Core API Types
 */

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledTime?: string;
  dueDate?: string;
  dueTime?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  reminders?: Reminder[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledTime?: string;
  dueDate?: string;
  dueTime?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface Reminder {
  id: string;
  taskId: string;
  type: 'NOTIFICATION' | 'EMAIL' | 'SMS';
  scheduleTime: string;
  isTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  taskId: string;
  type: 'NOTIFICATION' | 'EMAIL' | 'SMS';
  scheduleTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TasksQueryParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  page?: number;
  size?: number;
}

export interface NotificationPayload {
  title: string;
  body: string;
  taskId?: string;
  data?: Record<string, any>;
}