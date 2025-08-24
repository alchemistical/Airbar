// User type is defined in ./user.ts to avoid conflicts

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role: 'TRAVELER' | 'SENDER'
}