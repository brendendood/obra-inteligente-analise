import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'failed_authentication' | 'admin_action' | 'rate_limit_exceeded';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
}

export const useSecurityMonitoring = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Track failed login attempts
  const trackFailedLogin = async (email: string, ip?: string) => {
    try {
      // Log failed authentication attempt
      console.warn('Failed login attempt:', { email, ip, timestamp: new Date().toISOString() });
      
      // You could integrate with your analytics service here
      // or store in a security events table
    } catch (error) {
      console.error('Error tracking failed login:', error);
    }
  };

  // Track suspicious activity
  const trackSuspiciousActivity = async (activityType: string, details: any) => {
    try {
      console.warn('Suspicious activity detected:', { 
        type: activityType, 
        details, 
        timestamp: new Date().toISOString() 
      });

      // Show security warning to user if necessary
      if (activityType === 'multiple_failed_logins') {
        toast({
          title: "🔒 Atividade Suspeita Detectada",
          description: "Múltiplas tentativas de login falharam. Sua conta pode estar sendo atacada.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error tracking suspicious activity:', error);
    }
  };

  // Monitor admin actions
  const trackAdminAction = async (action: string, targetUserId?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      console.info('Admin action logged:', {
        admin_id: user.user.id,
        action,
        target_user_id: targetUserId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking admin action:', error);
    }
  };

  // Load security alerts (if you implement a security alerts system)
  const loadSecurityAlerts = async () => {
    try {
      setLoading(true);
      
      // This would connect to your security monitoring system
      // For now, we'll just return empty array
      setAlerts([]);
    } catch (error) {
      console.error('Error loading security alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-cleanup function for expired sessions
  const cleanupExpiredSessions = async () => {
    try {
      // Call the cleanup function for impersonation sessions
      await supabase.rpc('cleanup_expired_impersonation_sessions');
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  };

  useEffect(() => {
    // Run cleanup every hour
    const cleanupInterval = setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    alerts,
    loading,
    trackFailedLogin,
    trackSuspiciousActivity,
    trackAdminAction,
    loadSecurityAlerts,
    cleanupExpiredSessions
  };
};