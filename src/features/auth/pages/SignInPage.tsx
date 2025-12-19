import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loginUser, selectAuth, clearError } from '../authSlice';
import { Logo } from '../../../components/Logo';

export function SignInPage() {
  const [connectionMethod, setConnectionMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(selectAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!emailOrPhone || !password) {
      return;
    }

    try {
      await dispatch(loginUser({ emailOrPhone, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
  };

  const isFormValid = () => {
    if (!emailOrPhone || !password) return false;
    if (connectionMethod === 'email') {
      return validateEmail(emailOrPhone);
    }
    return validatePhone(emailOrPhone);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#F5F5F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <Logo size="large" />
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-[#1F2937]">Sign In</h1>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Connection method selector */}
              <div>
                <div className="flex rounded-md border border-[#E5E7EB] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setConnectionMethod('email');
                      setEmailOrPhone('');
                    }}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                      connectionMethod === 'email'
                        ? 'bg-[#14B8A6] text-white'
                        : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConnectionMethod('phone');
                      setEmailOrPhone('');
                    }}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-l border-[#E5E7EB] ${
                      connectionMethod === 'phone'
                        ? 'bg-[#14B8A6] text-white'
                        : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    Phone
                  </button>
                </div>
              </div>

              {/* Email/Phone input */}
              <div>
                <label htmlFor="email-or-phone" className="block text-sm font-medium text-[#1F2937] mb-1">
                  {connectionMethod === 'email' ? 'Email' : 'Phone'}
                </label>
                <input
                  id="email-or-phone"
                  name="email-or-phone"
                  type={connectionMethod === 'email' ? 'email' : 'tel'}
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm"
                  placeholder={connectionMethod === 'email' ? 'Email address' : 'Phone number'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full py-3 px-4 bg-[#14B8A6] text-white font-medium rounded-md hover:bg-[#0D9488] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14B8A6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* Link to sign up */}
        <div className="text-center">
          <Link
            to="/signup"
            className="text-sm font-medium text-[#14B8A6] hover:text-[#0D9488] transition-colors"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
