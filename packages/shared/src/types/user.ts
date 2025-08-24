export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'TRAVELER' | 'SENDER'