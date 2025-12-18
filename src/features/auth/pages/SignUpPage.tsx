import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { registerUser, selectAuth, clearError } from '../authSlice';

export function SignUpPage() {
  const [connectionMethod, setConnectionMethod] = useState<'email' | 'phone'>('email');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(selectAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!firstName || !lastName || !password) {
      return;
    }

    if (connectionMethod === 'email' && !email) {
      return;
    }

    if (connectionMethod === 'phone' && !phone) {
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          first_name: firstName,
          last_name: lastName,
          email: connectionMethod === 'email' ? email : undefined,
          phone: connectionMethod === 'phone' ? phone : undefined,
          password,
        })
      ).unwrap();

      navigate(`/verify-otp?userId=${result.user_id}`);
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
    if (!firstName || !lastName || !password) return false;
    if (connectionMethod === 'email') {
      return email ? validateEmail(email) : false;
    }
    return phone ? validatePhone(phone) : false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* First name */}
            <div>
              <label htmlFor="first-name" className="sr-only">
                First name
              </label>
              <input
                id="first-name"
                name="first-name"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last name */}
            <div>
              <label htmlFor="last-name" className="sr-only">
                Last name
              </label>
              <input
                id="last-name"
                name="last-name"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Connection method selector */}
            <div>
              <div className="flex rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    setConnectionMethod('email');
                    setEmail('');
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
                    setPhone('');
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

            {/* Email input (required if email selected, optional if phone selected) */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address {connectionMethod === 'email' ? '(required)' : '(optional)'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required={connectionMethod === 'email'}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Email address ${connectionMethod === 'email' ? '(required)' : '(optional)'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone input (required if phone selected, optional if email selected) */}
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone number {connectionMethod === 'phone' ? '(required)' : '(optional)'}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required={connectionMethod === 'phone'}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Phone number ${connectionMethod === 'phone' ? '(required)' : '(optional)'}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

