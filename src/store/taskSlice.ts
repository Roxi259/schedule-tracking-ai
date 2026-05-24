/**
 * Task Redux Slice
 * Manages task state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, CreateTaskRequest, UpdateTaskRequest, TasksQueryParams } from '@/types';
import apiService from '@/services/api';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: TasksQueryParams;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (params?: TasksQueryParams, { rejectWithValue }) => {
    try {
      const response = await apiService.getTasks(params);
      return response.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },
);

export const fetchTasksByDateAsync = createAsyncThunk(
  'tasks/fetchTasksByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const tasks = await apiService.getTasksByDate(date);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks for date',
      );
    }
  },
);

export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (data: CreateTaskRequest, { rejectWithValue }) => {
    try {
      const task = await apiService.createTask(data);
      return task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task',
      );
    }
  },
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }, { rejectWithValue }) => {
    try {
      const task = await apiService.updateTask(taskId, data);
      return task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task',
      );
    }
  },
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteTask(taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task',
      );
    }
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch tasks by date
    builder
      .addCase(fetchTasksByDateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByDateAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByDateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create task
    builder
      .addCase(createTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.selectedTask = action.payload;
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.selectedTask = null;
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTask, clearError, setFilters } = taskSlice.actions;
export default taskSlice.reducer;