import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loginUser, selectAuth, clearError } from '../authSlice';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Connection method selector */}
            <div className="mb-4">
              <div className="flex rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    setConnectionMethod('email');
                    setEmailOrPhone('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-l-md border ${
                    connectionMethod === 'email'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
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
                  className={`flex-1 py-2 px-4 rounded-r-md border ${
                    connectionMethod === 'phone'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Phone
                </button>
              </div>
            </div>

            {/* Email/Phone input */}
            <div>
              <label htmlFor="email-or-phone" className="sr-only">
                {connectionMethod === 'email' ? 'Email address' : 'Phone number'}
              </label>
              <input
                id="email-or-phone"
                name="email-or-phone"
                type={connectionMethod === 'email' ? 'email' : 'tel'}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={connectionMethod === 'email' ? 'Email address' : 'Phone number'}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>

            {/* Password input */}
            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={!isFormValid() || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

