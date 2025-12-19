import { apiClient } from './client';

export interface LoginRequest {
  email_or_phone: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  password: string;
  main_connection_method: 'email' | 'phone';
}

export interface OTPVerifyRequest {
  user_id: string;
  code: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  is_active: boolean;
  is_superuser: boolean;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

// Login using OAuth2PasswordRequestForm format (form-urlencoded)
export async function login(username: string, password: string): Promise<TokenResponse> {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await apiClient.post<TokenResponse>('/auth/login', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
  return response.data;
}

export async function verifyOtp(userId: string, code: string): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/auth/verify-otp', {
    user_id: userId,
    code,
  });
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/users/me');
  return response.data;
}

