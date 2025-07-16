import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';

export const useSuperAdmin = () => {
  const { user } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSuperAdminStatus = () => {
      // Check if user email matches super admin patterns
      // This can be expanded to use a database check
      const superAdminEmails = [
        'admin@VibeThink.co',
        'superadmin@VibeThink.co',
        'root@VibeThink.co'
      ];

      const isSuperAdminUser = user?.email && superAdminEmails.includes(user.email.toLowerCase());
      
      // Additional check: user must have OWNER role and company must be the main platform company
      const isPlatformOwner = user?.profile?.role === 'OWNER' && 
        user?.company?.slug === 'VibeThink-platform';

      setIsSuperAdmin(!!(isSuperAdminUser || isPlatformOwner));
      setLoading(false);
    };

    if (user !== undefined) {
      checkSuperAdminStatus();
    }
  }, [user]);

  return { isSuperAdmin, loading };
};
