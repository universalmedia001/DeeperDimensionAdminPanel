import { useContext } from 'react';
import { AdminProfileContext } from '@/context/AdminProfileContext';

export function useAdminProfile() {
  const context = useContext(AdminProfileContext);
  if (!context) throw new Error('useAdminProfile must be used within AdminProfileProvider');
  return context;
}
