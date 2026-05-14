import { apiClient } from './api';
import { Project } from '@/types';

export const projectApi = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/project/');
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  },

  async createProject(name: string, description?: string): Promise<Project> {
    const params = new URLSearchParams();
    params.append('name', name);
    if (description) {
      params.append('description', description);
    }
    const response = await apiClient.post(`/project/?${params.toString()}`);
    return response.data;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await apiClient.put(`/project/${id}`, updates);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/project/${id}`);
  },
};
