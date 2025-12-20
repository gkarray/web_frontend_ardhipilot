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
  crop_type?: string;
  created_at: string;
  updated_at: string;
}

export interface FieldPlotCreate {
  name: string;
  coordinates: [number, number][]; // [lng, lat] tuples
  crop_type?: string;
}

export interface FieldPlotUpdate {
  name?: string;
  coordinates?: [number, number][];
  crop_type?: string;
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

export interface FertigationEvent {
  id: string;
  field_plot_id: string;
  date: string;
  fertilizer_name: string;
  quantity: number;
  unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FertigationEventCreate {
  date: string;
  fertilizer_name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface FertigationEventUpdate {
  date?: string;
  fertilizer_name?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export const getFertigationEvents = async (plotId: string): Promise<FertigationEvent[]> => {
  const response = await apiClient.get<FertigationEvent[]>(`/api/field-plots/${plotId}/fertigation`);
  return response.data;
};

export const createFertigationEvent = async (plotId: string, event: FertigationEventCreate): Promise<FertigationEvent> => {
  const response = await apiClient.post<FertigationEvent>(`/api/field-plots/${plotId}/fertigation`, event);
  return response.data;
};

export const updateFertigationEvent = async (eventId: string, event: FertigationEventUpdate): Promise<FertigationEvent> => {
  const response = await apiClient.put<FertigationEvent>(`/api/fertigation/${eventId}`, event);
  return response.data;
};

export const deleteFertigationEvent = async (eventId: string): Promise<void> => {
  await apiClient.delete(`/api/fertigation/${eventId}`);
};



