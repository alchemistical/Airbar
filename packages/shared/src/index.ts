// Export schemas first (preferred)
export * from './schemas'
// Re-export types with explicit naming to avoid conflicts
export type { User as UserInterface } from './types/user'
export type { UserRole as UserRoleType } from './types/user'
export type * from './types/auth'
export type * from './types/trip'  
export type * from './types/parcel'
export type * from './types/booking'
export * from './utils'

// Also export schemas as a namespace for easier imports
import * as schemas from './schemas'
export { schemas }