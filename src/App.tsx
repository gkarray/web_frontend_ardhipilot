import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/store';
import { ProtectedRoute } from './app/ProtectedRoute';
import { fetchCurrentUser, selectIsAuthenticated } from './features/auth/authSlice';
import { SignInPage } from './features/auth/pages/SignInPage';
import { SignUpPage } from './features/auth/pages/SignUpPage';
import { VerifyOtpPage } from './features/auth/pages/VerifyOtpPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = localStorage.getItem('auth_token');

  // Fetch current user on mount if token exists
  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignInPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUpPage />}
        />
        <Route
          path="/verify-otp"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyOtpPage />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
