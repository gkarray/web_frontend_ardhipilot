import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { FieldPlot } from '../api/fieldPlots';

interface MapboxMapProps {
  plots?: FieldPlot[];
  selectedPlotId?: string | null;
  onMapClick?: (lng: number, lat: number) => void;
  drawingMode?: boolean;
  drawingPoints?: [number, number][];
  onDrawingPointAdd?: (point: [number, number]) => void;
  onDrawingPointRemove?: (index: number) => void;
}

// Tunisia center coordinates
const TUNISIA_CENTER: [number, number] = [9.0, 34.0]; // [lng, lat]

export function MapboxMap({
  plots = [],
  selectedPlotId = null,
  onMapClick,
  drawingMode = false,
  drawingPoints = [],
  onDrawingPointRemove,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.error('VITE_MAPBOX_ACCESS_TOKEN is not set');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: TUNISIA_CENTER,
      zoom: 6,
    });

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add drawing source and layer
      if (map.current) {
        map.current.addSource('drawing', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.current.addLayer({
          id: 'drawing-line',
          type: 'line',
          source: 'drawing',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#10B981',
            'line-width': 3,
            'line-dasharray': [2, 2],
          },
        });

        map.current.addLayer({
          id: 'drawing-fill',
          type: 'fill',
          source: 'drawing',
          paint: {
            'fill-color': '#10B981',
            'fill-opacity': 0.2,
          },
        });

        // Add plots source and layer
        map.current.addSource('plots', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.current.addLayer({
          id: 'plots-outline',
          type: 'line',
          source: 'plots',
          paint: {
            'line-color': '#14B8A6',
            'line-width': 2,
          },
        });

        map.current.addLayer({
          id: 'plots-fill',
          type: 'fill',
          source: 'plots',
          paint: {
            'fill-color': '#14B8A6',
            'fill-opacity': 0.1,
          },
        });

        // Add selected plot layer
        map.current.addSource('selected-plot', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.current.addLayer({
          id: 'selected-plot-outline',
          type: 'line',
          source: 'selected-plot',
          paint: {
            'line-color': '#EF4444',
            'line-width': 4,
          },
        });

        map.current.addLayer({
          id: 'selected-plot-fill',
          type: 'fill',
          source: 'selected-plot',
          paint: {
            'fill-color': '#EF4444',
            'fill-opacity': 0.3,
          },
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Handle map clicks for drawing mode
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (onMapClick && drawingMode) {
        onMapClick(e.lngLat.lng, e.lngLat.lat);
      }
    };

    if (drawingMode && onMapClick) {
      map.current.on('click', handleClick);
    }

    return () => {
      if (map.current) {
        map.current.off('click', handleClick);
      }
    };
  }, [mapLoaded, drawingMode, onMapClick]);

  // Update drawing points
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const source = map.current.getSource('drawing') as mapboxgl.GeoJSONSource;
    if (!source) return;

    if (drawingPoints.length === 0) {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
      return;
    }

    // Create closed polygon
    const coordinates = [...drawingPoints];
    if (coordinates.length > 0 && coordinates[0] !== coordinates[coordinates.length - 1]) {
      coordinates.push(coordinates[0]);
    }

    source.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: {},
        },
      ],
    });
  }, [drawingPoints, mapLoaded]);

  // Update plots
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const source = map.current.getSource('plots') as mapboxgl.GeoJSONSource;
    if (!source) return;

    const features = plots
      .filter((plot) => plot.id !== selectedPlotId)
      .map((plot) => ({
        type: 'Feature' as const,
        geometry: plot.geometry,
        properties: {
          id: plot.id,
          name: plot.name,
        },
      }));

    source.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [plots, selectedPlotId, mapLoaded]);

  // Update selected plot
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const source = map.current.getSource('selected-plot') as mapboxgl.GeoJSONSource;
    if (!source) return;

    const selectedPlot = plots.find((p) => p.id === selectedPlotId);
    if (!selectedPlot) {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
      return;
    }

    source.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature' as const,
          geometry: selectedPlot.geometry,
          properties: {
            id: selectedPlot.id,
            name: selectedPlot.name,
          },
        },
      ],
    });

    // Center map on selected plot

    const coordinates = selectedPlot.geometry.coordinates[0];
    if (coordinates && coordinates.length > 0) {
      // Create bounds from coordinates
      const bounds = new mapboxgl.LngLatBounds(
        coordinates[0] as [number, number],
        coordinates[0] as [number, number]
      );

      for (const coord of coordinates) {
        bounds.extend(coord as [number, number]);
      }

      // Calculate camera settings that would fit the bounds
      const camera = map.current.cameraForBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      if (camera) {
        const currentZoom = map.current.getZoom();

        // If the calculated zoom (where bounds fit) is less than current zoom,
        // it means the plot is too big for current view -> we must zoom out (use camera.zoom).
        // If the calculated zoom is greater/equal, it fits -> we keep current zoom.
        const targetZoom = (camera.zoom !== undefined && camera.zoom < currentZoom)
          ? camera.zoom
          : currentZoom;

        map.current.flyTo({
          center: camera.center,
          zoom: targetZoom,
          duration: 1000,
        });
      }
    }
  }, [selectedPlotId, plots, mapLoaded]);

  // Update drawing markers
  useEffect(() => {
    if (!mapLoaded || !map.current || !drawingMode) {
      // Clear markers if not in drawing mode
      if (!drawingMode) {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
      }
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    // Add markers for all drawing points
    drawingPoints.forEach((point, index) => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-[#10B981] rounded-full border-2 border-white shadow-lg cursor-pointer';
      el.style.zIndex = '1000';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onDrawingPointRemove) {
          onDrawingPointRemove(index);
        }
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(point)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [drawingPoints, mapLoaded, drawingMode, onDrawingPointRemove]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}

