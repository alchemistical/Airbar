import { useState, useEffect } from 'react';

export type UserRole = 'sender' | 'traveler';

interface UseUserRoleReturn {
  role: UserRole;
  userRole: UserRole;
  toggleRole: () => void;
  setRole: (role: UserRole) => void;
}

export function useUserRole(): UseUserRoleReturn {
  const [role, setRole] = useState<UserRole>(() => {
    // Get role from localStorage or default to 'sender'
    const stored = localStorage.getItem('userRole');
    return (stored as UserRole) || 'sender';
  });

  useEffect(() => {
    // Save role to localStorage when it changes
    localStorage.setItem('userRole', role);
  }, [role]);

  const toggleRole = () => {
    setRole(prevRole => prevRole === 'sender' ? 'traveler' : 'sender');
  };

  return {
    role,
    userRole: role, // Alias for compatibility
    toggleRole,
    setRole,
  };
}