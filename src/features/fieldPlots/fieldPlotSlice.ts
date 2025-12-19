import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import * as fieldPlotApi from '../../api/fieldPlots';
import type { FieldPlot, FieldPlotCreate, FieldPlotUpdate } from '../../api/fieldPlots';

interface FieldPlotState {
  plots: FieldPlot[];
  selectedPlotId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FieldPlotState = {
  plots: [],
  selectedPlotId: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPlots = createAsyncThunk('fieldPlots/fetchPlots', async () => {
  return await fieldPlotApi.getPlots();
});

export const createPlot = createAsyncThunk(
  'fieldPlots/createPlot',
  async (plotData: FieldPlotCreate) => {
    return await fieldPlotApi.createPlot(plotData);
  }
);

export const updatePlot = createAsyncThunk(
  'fieldPlots/updatePlot',
  async ({ id, data }: { id: string; data: FieldPlotUpdate }) => {
    return await fieldPlotApi.updatePlot(id, data);
  }
);

export const deletePlot = createAsyncThunk(
  'fieldPlots/deletePlot',
  async (id: string) => {
    await fieldPlotApi.deletePlot(id);
    return id;
  }
);

const fieldPlotSlice = createSlice({
  name: 'fieldPlots',
  initialState,
  reducers: {
    selectPlot: (state, action) => {
      state.selectedPlotId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedPlotId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch plots
    builder
      .addCase(fetchPlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plots = action.payload;
        state.error = null;
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch plots';
      });

    // Create plot
    builder
      .addCase(createPlot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plots.unshift(action.payload); // Add to beginning
        state.selectedPlotId = action.payload.id;
        state.error = null;
      })
      .addCase(createPlot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create plot';
      });

    // Update plot
    builder
      .addCase(updatePlot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePlot.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.plots.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.plots[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePlot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update plot';
      });

    // Delete plot
    builder
      .addCase(deletePlot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePlot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plots = state.plots.filter((p) => p.id !== action.payload);
        if (state.selectedPlotId === action.payload) {
          state.selectedPlotId = null;
        }
        state.error = null;
      })
      .addCase(deletePlot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete plot';
      });
  },
});

export const { selectPlot, clearSelection, clearError } = fieldPlotSlice.actions;
export default fieldPlotSlice.reducer;

// Selectors
export const selectPlots = (state: RootState) => state.fieldPlots.plots;
export const selectSelectedPlot = (state: RootState) => {
  if (!state.fieldPlots.selectedPlotId) return null;
  return state.fieldPlots.plots.find((p) => p.id === state.fieldPlots.selectedPlotId) || null;
};
export const selectIsLoading = (state: RootState) => state.fieldPlots.isLoading;
export const selectError = (state: RootState) => state.fieldPlots.error;
export const selectHasPlots = (state: RootState) => state.fieldPlots.plots.length > 0;

