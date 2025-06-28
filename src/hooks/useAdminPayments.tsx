
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  user_email?: string;
  plan?: string;
}

interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  activeSubscriptions: number;
  averageTicket: number;
}

export const useAdminPayments = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data: paymentsData, error: paymentsError } = await query;

      if (paymentsError) throw paymentsError;

      if (paymentsData) {
        const userIds = [...new Set(paymentsData.map(p => p.user_id))];
        
        const { data: usersData, error: usersError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        if (usersError) {
          console.error('Error loading user profiles:', usersError);
        }

        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_subscriptions')
          .select('user_id, plan')
          .in('user_id', userIds);

        if (subscriptionsError) {
          console.error('Error loading subscriptions:', subscriptionsError);
        }

        const paymentsWithUserInfo = paymentsData.map(payment => {
          const userProfile = usersData?.find(u => u.user_id === payment.user_id);
          const subscription = subscriptionsData?.find(s => s.user_id === payment.user_id);
          
          return {
            ...payment,
            user_email: userProfile?.full_name || 'N/A',
            plan: subscription?.plan || 'free'
          };
        });
        
        setPayments(paymentsWithUserInfo);
        
        // Calculate stats
        const totalRevenue = paymentsWithUserInfo
          .filter(p => p.status === 'succeeded')
          .reduce((sum, p) => sum + Number(p.amount), 0);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = paymentsWithUserInfo
          .filter(p => {
            const paymentDate = new Date(p.created_at);
            return p.status === 'succeeded' &&
                   paymentDate.getMonth() === currentMonth &&
                   paymentDate.getFullYear() === currentYear;
          })
          .reduce((sum, p) => sum + Number(p.amount), 0);

        const { data: activeSubscriptions, error: subsError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('status', 'active');

        if (subsError) {
          console.error('Error loading active subscriptions:', subsError);
        }

        const activeSubsCount = activeSubscriptions?.length || 0;
        const averageTicket = totalRevenue / (paymentsWithUserInfo.length || 1);

        setStats({
          totalRevenue,
          monthlyRevenue,
          totalTransactions: paymentsWithUserInfo.length,
          activeSubscriptions: activeSubsCount,
          averageTicket
        });
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "❌ Erro ao carregar pagamentos",
        description: "Não foi possível carregar os dados de pagamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportPayments = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Usuário,Valor,Moeda,Status,Método,Data,Plano\n" +
      payments.map(p => 
        `${p.id},${p.user_email},${p.amount},${p.currency},${p.status},${p.payment_method},${p.created_at},${p.plan}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pagamentos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
  };

  useEffect(() => {
    loadPayments();
  }, [searchTerm, filterStatus, dateRange]);

  return {
    payments,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    dateRange,
    setDateRange,
    exportPayments,
    clearFilters
  };
};
