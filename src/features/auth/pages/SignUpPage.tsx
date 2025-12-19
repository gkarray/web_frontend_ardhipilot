import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { registerUser, selectAuth, clearError } from '../authSlice';
import { Logo } from '../../../components/Logo';

export function SignUpPage() {
  const [connectionMethod, setConnectionMethod] = useState<'email' | 'phone'>('email');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    repeatPassword: false,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(selectAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      repeatPassword: true,
    });

    // Validate form
    if (!isFormValid()) {
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          first_name: firstName,
          last_name: lastName,
          email: email || undefined,
          phone: phone || undefined,
          password,
          main_connection_method: connectionMethod,
        })
      ).unwrap();

      navigate(`/verify-otp?userId=${result.user_id}`);
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const validateEmail = (email: string) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return false;
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (touched.firstName || value) {
      if (!value.trim()) {
        setFirstNameError('First name is required');
      } else {
        setFirstNameError('');
      }
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    if (touched.lastName || value) {
      if (!value.trim()) {
        setLastNameError('Last name is required');
      } else {
        setLastNameError('');
      }
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email || value) {
      if (connectionMethod === 'email' && !value) {
        setEmailError('Email is required');
      } else if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (touched.phone || value) {
      if (connectionMethod === 'phone' && !value) {
        setPhoneError('Phone number is required');
      } else if (value && !validatePhone(value)) {
        setPhoneError('Please enter a valid phone number');
      } else {
        setPhoneError('');
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.repeatPassword && repeatPassword && value !== repeatPassword) {
      setPasswordMatchError('Passwords do not match');
    } else if (touched.repeatPassword && repeatPassword && value === repeatPassword) {
      setPasswordMatchError('');
    }
  };

  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    if (touched.repeatPassword || value) {
      if (value !== password) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const isFormValid = () => {
    if (!firstName || !lastName || !password || !repeatPassword) return false;
    if (password !== repeatPassword) return false;
    if (connectionMethod === 'email') {
      return email ? validateEmail(email) : false;
    }
    return phone ? validatePhone(phone) : false;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#F5F5F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <Logo size="large" />
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-[#1F2937]">Registration</h1>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* First name and Last name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-[#1F2937] mb-1">
                    First Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    required
                    className={`w-full px-3 py-2 border rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm ${
                      firstNameError ? 'border-red-300' : 'border-[#E5E7EB]'
                    }`}
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    onBlur={() => setTouched({ ...touched, firstName: true })}
                  />
                  {firstNameError && (
                    <p className="mt-1 text-sm text-red-600">{firstNameError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-[#1F2937] mb-1">
                    Last Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    required
                    className={`w-full px-3 py-2 border rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm ${
                      lastNameError ? 'border-red-300' : 'border-[#E5E7EB]'
                    }`}
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    onBlur={() => setTouched({ ...touched, lastName: true })}
                  />
                  {lastNameError && (
                    <p className="mt-1 text-sm text-red-600">{lastNameError}</p>
                  )}
                </div>
              </div>

              {/* Connection method selector */}
              <div>
                <div className="flex rounded-md border border-[#E5E7EB] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setConnectionMethod('email');
                      setEmail('');
                      setEmailError('');
                      setTouched({ ...touched, email: false });
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
                      setPhone('');
                      setPhoneError('');
                      setTouched({ ...touched, phone: false });
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

              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Email
                  {connectionMethod === 'email' && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required={connectionMethod === 'email'}
                  className={`w-full px-3 py-2 border rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm ${
                    emailError ? 'border-red-300' : 'border-[#E5E7EB]'
                  }`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              {/* Phone input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Phone
                  {connectionMethod === 'phone' && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required={connectionMethod === 'phone'}
                  className={`w-full px-3 py-2 border rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm ${
                    phoneError ? 'border-red-300' : 'border-[#E5E7EB]'
                  }`}
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Password <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                />
              </div>

              {/* Repeat Password input */}
              <div>
                <label htmlFor="repeat-password" className="block text-sm font-medium text-[#1F2937] mb-1">
                  Repeat Password <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="repeat-password"
                  name="repeat-password"
                  type="password"
                  required
                  className={`w-full px-3 py-2 border rounded-md text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent text-sm ${
                    passwordMatchError ? 'border-red-300' : 'border-[#E5E7EB]'
                  }`}
                  placeholder="Repeat Password"
                  value={repeatPassword}
                  onChange={(e) => handleRepeatPasswordChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, repeatPassword: true })}
                />
                {passwordMatchError && (
                  <p className="mt-1 text-sm text-red-600">{passwordMatchError}</p>
                )}
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
              {isLoading ? 'Creating account...' : 'REGISTRATION'}
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-[#6B7280]">
          By registering, you accept our General Terms of Use.
        </p>
      </div>
    </div>
  );
}
