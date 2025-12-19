import { apiClient } from './client';

export interface Coordinate {
  lng: number;
  lat: number;
}

export interface FieldPlotGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface FieldPlot {
  id: string;
  user_id: string;
  name: string;
  geometry: FieldPlotGeometry;
  created_at: string;
  updated_at: string;
}

export interface FieldPlotCreate {
  name: string;
  coordinates: [number, number][]; // [lng, lat] tuples
}

export interface FieldPlotUpdate {
  name?: string;
  coordinates?: [number, number][];
}

export const getPlots = async (): Promise<FieldPlot[]> => {
  const response = await apiClient.get<FieldPlot[]>('/api/field-plots');
  return response.data;
};

export const createPlot = async (plot: FieldPlotCreate): Promise<FieldPlot> => {
  const response = await apiClient.post<FieldPlot>('/api/field-plots', plot);
  return response.data;
};

export const getPlot = async (id: string): Promise<FieldPlot> => {
  const response = await apiClient.get<FieldPlot>(`/api/field-plots/${id}`);
  return response.data;
};

export const updatePlot = async (id: string, plot: FieldPlotUpdate): Promise<FieldPlot> => {
  const response = await apiClient.put<FieldPlot>(`/api/field-plots/${id}`, plot);
  return response.data;
};

export const deletePlot = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/field-plots/${id}`);
};

