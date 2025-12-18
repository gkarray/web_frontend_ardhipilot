import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { fetchCurrentUser, selectUser, logoutUser } from '../../auth/authSlice';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
            {user && (
              <div className="mt-4">
                <p className="text-lg text-gray-700">
                  Welcome, {user.first_name} {user.last_name}!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {user.email && `Email: ${user.email}`}
                  {user.phone && `Phone: ${user.phone}`}
                </p>
              </div>
            )}
            <p className="text-gray-500 mt-4">This is a placeholder dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

