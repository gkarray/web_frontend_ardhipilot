import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { fetchCurrentUser, selectUser, logoutUser } from '../../auth/authSlice';
import {
  fetchPlots,
  createPlot,
  selectPlots,
  selectSelectedPlot,
  selectHasPlots,
  selectPlot,
  selectIsLoading,
} from '../../fieldPlots/fieldPlotSlice';
import { Logo } from '../../../components/Logo';
import { MapboxMap } from '../../../components/MapboxMap';
import { PlotList } from '../../../components/PlotList';
import type { FieldPlot } from '../../../api/fieldPlots';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const plots = useAppSelector(selectPlots);
  const selectedPlot = useAppSelector(selectSelectedPlot);
  const hasPlots = useAppSelector(selectHasPlots);
  const isLoadingPlots = useAppSelector(selectIsLoading);

  // Drawing / Creation State
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [plotName, setPlotName] = useState('');
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [plotCreationError, setPlotCreationError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchPlots());
    }
  }, [dispatch, user]);

  // Enter drawing mode if user has no plots
  useEffect(() => {
    if (user && !isLoadingPlots && !hasPlots) {
      setIsDrawingMode(true);
    }
  }, [user, isLoadingPlots, hasPlots]);

  const handleSignOut = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate('/signin');
  };

  const handleMapClick = (lng: number, lat: number) => {
    if (!isDrawingMode) return;
    setDrawingPoints((prev) => [...prev, [lng, lat]]);
    setPlotCreationError(null);
  };

  const handleRemovePoint = (index: number) => {
    setDrawingPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearDrawing = () => {
    setDrawingPoints([]);
    setPlotCreationError(null);
  };

  const handleCancelDrawing = () => {
    // If it's the first plot (forced flow), we might arguably not want to allow cancel,
    // but allowing them to at least clear the state or see the empty map is fine.
    // If they have no plots, we essentially just reset the form but they are still technically "in need of a plot".
    // For now, if they cancel and have no plots, we can just clear points but stay in drawing mode?
    // Or just let them browse the empty map? The requirement says "prompted... before being able to do anything else".
    // So if !hasPlots, maybe hide Cancel?
    if (hasPlots) {
      setIsDrawingMode(false);
    }
    setPlotName('');
    setDrawingPoints([]);
    setPlotCreationError(null);
  };

  const handleSubmitPlot = async () => {
    if (!plotName.trim()) {
      setPlotCreationError('Please enter a plot name.');
      return;
    }

    // Check for duplicate name
    const isDuplicate = plots.some(p => p.name.toLowerCase() === plotName.trim().toLowerCase());
    if (isDuplicate) {
      setPlotCreationError(`A plot named "${plotName.trim()}" already exists. Please choose a different name.`);
      return;
    }

    if (drawingPoints.length < 3) {
      setPlotCreationError(`Need at least 3 points (currently ${drawingPoints.length}).`);
      return;
    }

    setIsCreating(true);
    try {
      await dispatch(createPlot({ name: plotName.trim(), coordinates: drawingPoints })).unwrap();
      setIsDrawingMode(false);
      setPlotName('');
      setDrawingPoints([]);
      setPlotCreationError(null);
    } catch (error: any) {
      console.error('Failed to create plot:', error);
      const message = error?.detail || error?.message || 'Failed to create plot. Please try again.';
      setPlotCreationError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlotSelect = (plot: FieldPlot) => {
    dispatch(selectPlot(plot.id));
  };

  const isFeatureDisabled = !hasPlots;

  return (
    <div className="h-screen w-screen bg-[#F5F5F5] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4">
          {/* Notifications icon placeholder */}
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5] rounded-md transition-colors">
            <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Welcome message */}
          <div className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-1.5 rounded-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Welcome {user?.first_name || 'User'}</span>
          </div>
        </div>

        {/* Coordinates placeholder */}
        <div className="text-sm text-[#6B7280]">
          <span>46.0635° N • 2.4587° E</span>
          <span className="ml-4">50 m</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Control Panel */}
        <div className="absolute left-4 top-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs w-full hidden md:block">
          <div className="space-y-4">
            {/* Vegetation Index */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#1F2937]">VEGETATION INDEX</h3>
                <button className="w-4 h-4 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className={`relative inline-flex items-center ${isFeatureDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input type="checkbox" className="sr-only peer" disabled={isFeatureDisabled} />
                  <div className={`w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6] ${isFeatureDisabled ? 'opacity-50' : ''}`}></div>
                </label>
                <div className="flex gap-1">
                  <button
                    disabled={isFeatureDisabled}
                    className={`px-2 py-1 text-xs rounded ${isFeatureDisabled ? 'bg-[#F5F5F5] text-[#6B7280] opacity-50 cursor-not-allowed' : 'bg-[#F5F5F5] text-[#6B7280]'}`}
                    title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
                  >
                    R
                  </button>
                  <button
                    disabled={isFeatureDisabled}
                    className={`px-2 py-1 text-xs rounded ${isFeatureDisabled ? 'bg-[#F5F5F5] text-[#6B7280] opacity-50 cursor-not-allowed' : 'bg-[#F5F5F5] text-[#6B7280]'}`}
                    title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
                  >
                    NIR
                  </button>
                </div>
              </div>
            </div>

            {/* Irrigation Index */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#1F2937]">IRRIGATION INDEX</h3>
                <button className="w-4 h-4 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6]"></div>
                </label>
                <div className="flex gap-1">
                  <button
                    disabled={isFeatureDisabled}
                    className={`px-2 py-1 text-xs rounded ${isFeatureDisabled ? 'bg-[#14B8A6] text-white opacity-50 cursor-not-allowed' : 'bg-[#14B8A6] text-white'}`}
                    title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
                  >
                    NIR
                  </button>
                  <button
                    disabled={isFeatureDisabled}
                    className={`px-2 py-1 text-xs rounded ${isFeatureDisabled ? 'bg-[#F5F5F5] text-[#6B7280] opacity-50 cursor-not-allowed' : 'bg-[#F5F5F5] text-[#6B7280]'}`}
                    title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
                  >
                    SWIR 1
                  </button>
                </div>
              </div>
            </div>

            {/* Plant Health */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#1F2937]">PLANT HEALTH</h3>
                <button className="w-4 h-4 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6]"></div>
                </label>
                <div className="flex gap-1">
                  <button
                    disabled={isFeatureDisabled}
                    className={`px-2 py-1 text-xs rounded ${isFeatureDisabled ? 'bg-[#F5F5F5] text-[#6B7280] opacity-50 cursor-not-allowed' : 'bg-[#F5F5F5] text-[#6B7280]'}`}
                    title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
                  >
                    NIR
                  </button>
                  <button
                    disabled={isFeatureDisabled}
                    className={`px-2 py-1 text-xs rounded ${isFeatureDisabled ? 'bg-[#F5F5F5] text-[#6B7280] opacity-50 cursor-not-allowed' : 'bg-[#F5F5F5] text-[#6B7280]'}`}
                    title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
                  >
                    RE
                  </button>
                </div>
              </div>
            </div>

            {/* Yield Forecast */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#1F2937]">YIELD FORECAST</h3>
                <button className="w-4 h-4 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <label className={`relative inline-flex items-center ${isFeatureDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" className="sr-only peer" disabled={isFeatureDisabled} />
                <div className={`w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6] ${isFeatureDisabled ? 'opacity-50' : ''}`}></div>
              </label>
            </div>

            {/* Water Saved */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#1F2937]">WATER SAVED</h3>
                <button className="w-4 h-4 flex items-center justify-center text-[#6B7280] hover:text-[#1F2937]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <label className={`relative inline-flex items-center ${isFeatureDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" className="sr-only peer" disabled={isFeatureDisabled} />
                <div className={`w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6] ${isFeatureDisabled ? 'opacity-50' : ''}`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative bg-[#E5E7EB]">
          <MapboxMap
            plots={plots}
            selectedPlotId={selectedPlot?.id || null}
            drawingMode={isDrawingMode}
            drawingPoints={drawingPoints}
            onMapClick={handleMapClick}
            onDrawingPointRemove={handleRemovePoint}
          />

          {/* Plot Creation Overlay (Visible only in drawing mode) */}
          {isDrawingMode && (
            <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-xl p-4 w-80 animate-fade-in border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  Create New Plot
                </h3>
                {hasPlots && (
                  <button onClick={handleCancelDrawing} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                    Plot Name
                  </label>
                  <input
                    type="text"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    placeholder="e.g. North Field"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-shadow"
                    autoFocus
                  />
                </div>

                <div className="bg-[#F9FAFB] p-3 rounded-md border border-[#F3F4F6]">
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Click on the map to mark the corners of your field.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#374151]">
                      Points: <span className="text-[#10B981]">{drawingPoints.length}</span>
                    </span>
                    {drawingPoints.length > 0 && (
                      <button
                        onClick={handleClearDrawing}
                        className="text-xs text-[#EF4444] hover:text-[#DC2626] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {plotCreationError && (
                  <div className="p-2 bg-[#FEF2F2] border border-[#FCA5A5] rounded text-xs text-[#B91C1C]">
                    {plotCreationError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {hasPlots && (
                    <button
                      onClick={handleCancelDrawing}
                      className="flex-1 px-3 py-2 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-md hover:bg-[#F3F4F6] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSubmitPlot}
                    disabled={isCreating}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#10B981] rounded-md hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isCreating ? 'Creating...' : 'Create Plot'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Index legend button (bottom right of map) */}
          <button
            disabled={isFeatureDisabled && !isDrawingMode}
            className={`absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md text-sm text-[#1F2937] shadow-md ${(isFeatureDisabled && !isDrawingMode)
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#F5F5F5]'
              }`}
            title={isFeatureDisabled ? 'Register a field plot to use this feature' : ''}
          >
            Index legend
          </button>
        </div>

        {/* Right Navigation Panel */}
        <div className="hidden lg:flex w-64 bg-white border-l border-[#E5E7EB] flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <Logo size="small" />
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Plot Management */}
            <div>
              <button className="w-full text-left text-sm font-semibold text-[#1F2937] py-2 flex items-center justify-between">
                <span>Plot Management</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="pl-4 mt-1 space-y-1">
                {hasPlots && (
                  <div className="mt-2">
                    <PlotList onPlotSelect={handlePlotSelect} />
                  </div>
                )}
                <button
                  onClick={() => setIsDrawingMode(true)}
                  disabled={isDrawingMode}
                  className={`block text-sm py-1 w-full text-left ${isDrawingMode ? 'text-[#10B981] font-medium cursor-default' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
                >
                  {isDrawingMode ? 'Creating Plot...' : 'Add a Plot'}
                </button>
              </div>
            </div>

            {/* Weather Forecast */}
            <div>
              <button className="w-full text-left text-sm font-semibold text-[#1F2937] py-2 flex items-center justify-between">
                <span>Weather Forecast</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Notifications */}
            <div>
              <button className="w-full text-left text-sm font-semibold text-[#1F2937] py-2 flex items-center justify-between">
                <span>Notifications</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Settings */}
            <div>
              <button className="w-full text-left text-sm font-semibold text-[#1F2937] py-2 flex items-center justify-between">
                <span>Settings</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* My Account */}
            <div>
              <button className="w-full text-left text-sm font-semibold text-[#1F2937] py-2 flex items-center justify-between">
                <span>My Account</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleSignOut}
                className="w-full text-left text-sm font-semibold text-[#EF4444] py-2 hover:bg-[#F5F5F5] rounded-md px-2 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Date Selector */}
      <div className="bg-white border-t border-[#E5E7EB] px-4 py-3 flex items-center gap-2 overflow-x-auto">
        <button className="p-2 hover:bg-[#F5F5F5] rounded-md transition-colors">
          <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {['16 Feb', '17 Feb', '18 Feb', '19 Feb', '20 Feb', '21 Feb'].map((date, index) => (
          <button
            key={date}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${index === 2
                ? 'bg-[#10B981] text-white'
                : 'bg-white text-[#1F2937] hover:bg-[#F5F5F5]'
              }`}
          >
            {date} '25
          </button>
        ))}

        <button className="p-2 hover:bg-[#F5F5F5] rounded-md transition-colors">
          <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button className="p-2 hover:bg-[#F5F5F5] rounded-md transition-colors ml-auto">
          <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Bottom Feature Cards */}
      <div className="bg-[#F5F5F5] px-4 py-4 border-t border-[#E5E7EB] overflow-x-auto hidden lg:block">
        <div className="flex gap-4">
          {/* Crop Type */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-1">Crop Type</h3>
            <p className="text-xs text-[#6B7280] mb-2">Choose your main crop</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>

          {/* Crop Cycle */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-1">Crop Cycle</h3>
            <p className="text-xs text-[#6B7280] mb-2">Check the stage of your crop</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>

          {/* Fertigation */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-1">Fertigation</h3>
            <p className="text-xs text-[#6B7280] mb-2">Optimize your fertilizer and nutrient needs</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>

          {/* Irrigation */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-1">Irrigation</h3>
            <p className="text-xs text-[#6B7280] mb-2">Optimize your water needs</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>

          {/* Diseases (Premium) */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border-2 border-dashed border-[#F59E0B]">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-[#1F2937]">Diseases</h3>
              <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-xs text-[#6B7280] mb-2">Try full access to features</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>

          {/* Profitability (Premium) */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border-2 border-dashed border-[#F59E0B]">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-[#1F2937]">Profitability</h3>
              <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-xs text-[#6B7280] mb-2">Try full access to features</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>

          {/* Crop Management Guide */}
          <div className="bg-white rounded-lg p-4 min-w-[200px] border-2 border-[#10B981]">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-1">Crop Management Guide</h3>
            <p className="text-xs text-[#6B7280] mb-2">Discover the ArdhiPilot crop management guide</p>
            <button className="text-[#14B8A6] text-xs hover:text-[#0D9488]">Learn more →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
