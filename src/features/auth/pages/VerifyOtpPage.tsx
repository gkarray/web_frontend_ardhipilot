import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { verifyOtpUser, selectAuth, clearError } from '../authSlice';
import { Logo } from '../../../components/Logo';

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
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#F5F5F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <Logo size="large" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1F2937]">Verify your account</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Enter the 6-digit code sent to your email or phone
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[#1F2937] placeholder-[#9CA3AF] text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
                placeholder="000000"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={code.length !== 6 || isLoading}
              className="w-full py-3 px-4 bg-[#14B8A6] text-white font-medium rounded-md hover:bg-[#0D9488] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14B8A6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verifying...' : 'VERIFY'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
