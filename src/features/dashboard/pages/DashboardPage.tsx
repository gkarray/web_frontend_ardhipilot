import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { fetchCurrentUser, selectUser, logoutUser } from '../../auth/authSlice';
import { Logo } from '../../../components/Logo';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  const handleSignOut = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate('/signin');
  };

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
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6]"></div>
                </label>
                <div className="flex gap-1">
                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#6B7280] rounded">R</button>
                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#6B7280] rounded">NIR</button>
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
                  <button className="px-2 py-1 text-xs bg-[#14B8A6] text-white rounded">NIR</button>
                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#6B7280] rounded">SWIR 1</button>
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
                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#6B7280] rounded">NIR</button>
                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#6B7280] rounded">RE</button>
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6]"></div>
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#14B8A6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14B8A6]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative bg-[#E5E7EB]">
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#6B7280] text-lg">Map View (Placeholder)</div>
          </div>

          {/* Index legend button (bottom right of map) */}
          <button className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md text-sm text-[#1F2937] hover:bg-[#F5F5F5] shadow-md">
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
                <button className="block text-sm text-[#6B7280] hover:text-[#1F2937] py-1">My Plots</button>
                <button className="block text-sm text-[#6B7280] hover:text-[#1F2937] py-1">Add a Plot</button>
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              index === 2
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
