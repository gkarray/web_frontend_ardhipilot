import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { verifyOtpUser, selectAuth, clearError } from '../authSlice';

export function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const [code, setCode] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!userId) {
      navigate('/signup');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!code || code.length !== 6) {
      return;
    }

    try {
      await dispatch(verifyOtpUser({ userId, code })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setCode(digitsOnly);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to your email or phone
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="otp-code" className="sr-only">
                OTP Code
              </label>
              <input
                id="otp-code"
                name="otp-code"
                type="text"
                inputMode="numeric"
                required
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 text-center text-2xl tracking-widest focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="000000"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={code.length !== 6 || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

