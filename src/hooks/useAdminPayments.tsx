
import { useState, useEffect, useRef } from 'react';
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
  const mountedRef = useRef(true);
  const hasInitialized = useRef(false);
  const { toast } = useToast();

  const loadPayments = async () => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!mountedRef.current) return;

      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
        throw paymentsError;
      }

      if (paymentsData) {
        const processedPayments = paymentsData.map(payment => ({
          ...payment,
          user_email: payment.user_id || 'N/A',
          plan: 'free'
        }));
        
        setPayments(processedPayments);
        
        // Calcular estatísticas básicas
        const totalRevenue = processedPayments
          .filter(p => p.status === 'succeeded')
          .reduce((sum, p) => sum + Number(p.amount), 0);
        
        const monthlyRevenue = processedPayments
          .filter(p => {
            const paymentDate = new Date(p.created_at);
            const now = new Date();
            return p.status === 'succeeded' &&
                   paymentDate.getMonth() === now.getMonth() &&
                   paymentDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + Number(p.amount), 0);

        const averageTicket = processedPayments.length > 0 ? totalRevenue / processedPayments.length : 0;

        if (mountedRef.current) {
          setStats({
            totalRevenue,
            monthlyRevenue,
            totalTransactions: processedPayments.length,
            activeSubscriptions: 0,
            averageTicket
          });
        }
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      if (mountedRef.current) {
        toast({
          title: "❌ Erro ao carregar pagamentos",
          description: "Não foi possível carregar os dados de pagamento.",
          variant: "destructive"
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Carregar dados apenas uma vez na montagem
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    loadPayments();

    return () => {
      mountedRef.current = false;
    };
  }, []); // Dependência vazia para carregar apenas uma vez

  const exportPayments = () => {
    if (payments.length === 0) {
      toast({
        title: "⚠️ Nenhum dado para exportar",
        description: "Não há pagamentos para exportar.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Usuário,Valor,Moeda,Status,Método,Data,Plano\n" +
      payments.map(p => 
        `${p.id},${p.user_email},${p.amount},${p.currency},${p.status},${p.payment_method || 'N/A'},${p.created_at},${p.plan}`
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
    setDateRange('30d');
  };

  // Filtrar dados localmente para evitar re-consultas
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === '' || 
      payment.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return {
    payments: filteredPayments,
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
