/**
 * Custom Hook for Tasks
 */

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchTasksAsync,
  fetchTasksByDateAsync,
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  setSelectedTask,
  clearError,
  setFilters,
} from '@/store/taskSlice';
import { CreateTaskRequest, UpdateTaskRequest, TasksQueryParams } from '@/types';

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks);

  const fetchTasks = (params?: TasksQueryParams) => {
    return dispatch(fetchTasksAsync(params));
  };

  const fetchTasksByDate = (date: string) => {
    return dispatch(fetchTasksByDateAsync(date));
  };

  const createTask = (data: CreateTaskRequest) => {
    return dispatch(createTaskAsync(data));
  };

  const updateTask = (taskId: string, data: UpdateTaskRequest) => {
    return dispatch(updateTaskAsync({ taskId, data }));
  };

  const deleteTask = (taskId: string) => {
    return dispatch(deleteTaskAsync(taskId));
  };

  const selectTask = (task: any) => {
    dispatch(setSelectedTask(task));
  };

  const clearTaskError = () => {
    dispatch(clearError());
  };

  const updateFilters = (filters: TasksQueryParams) => {
    dispatch(setFilters(filters));
  };

  return {
    tasks: tasks.tasks,
    selectedTask: tasks.selectedTask,
    loading: tasks.loading,
    error: tasks.error,
    filters: tasks.filters,
    fetchTasks,
    fetchTasksByDate,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
    clearTaskError,
    updateFilters,
  };
};