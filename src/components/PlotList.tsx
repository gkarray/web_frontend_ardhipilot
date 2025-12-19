import { useAppDispatch, useAppSelector } from '../app/store';
import { selectPlots, selectSelectedPlot, selectPlot, deletePlot } from '../features/fieldPlots/fieldPlotSlice';
import type { FieldPlot } from '../api/fieldPlots';

interface PlotListProps {
  onPlotSelect?: (plot: FieldPlot) => void;
}

export function PlotList({ onPlotSelect }: PlotListProps) {
  const dispatch = useAppDispatch();
  const plots = useAppSelector(selectPlots);
  const selectedPlot = useAppSelector(selectSelectedPlot);

  const handlePlotClick = (plot: FieldPlot) => {
    dispatch(selectPlot(plot.id));
    if (onPlotSelect) {
      onPlotSelect(plot);
    }
  };

  const handleDelete = async (plotId: string, plotName: string) => {
    if (window.confirm(`Are you sure you want to delete "${plotName}"? This action cannot be undone.`)) {
      await dispatch(deletePlot(plotId)).unwrap();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (plots.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-[#6B7280]">
        No plots registered yet. Create your first plot to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plots.map((plot) => {
        const isSelected = selectedPlot?.id === plot.id;
        return (
          <div
            key={plot.id}
            className={`p-3 rounded-md border cursor-pointer transition-colors ${
              isSelected
                ? 'bg-[#10B981] text-white border-[#10B981]'
                : 'bg-white border-[#E5E7EB] hover:border-[#14B8A6] hover:bg-[#F5F5F5]'
            }`}
            onClick={() => handlePlotClick(plot)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-[#1F2937]'}`}>
                  {plot.name}
                </h3>
                <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
                  Created {formatDate(plot.created_at)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(plot.id, plot.name);
                }}
                className={`ml-2 p-1 rounded hover:bg-opacity-20 transition-colors ${
                  isSelected
                    ? 'text-white hover:bg-white'
                    : 'text-[#EF4444] hover:bg-[#EF4444]'
                }`}
                title="Delete plot"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

