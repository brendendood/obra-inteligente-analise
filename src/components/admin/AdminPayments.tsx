import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, DollarSign, CreditCard, TrendingUp, Calendar, Users, Download } from 'lucide-react';
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

export const AdminPayments = () => {
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
      
      // Carregar pagamentos básicos primeiro
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
        // Buscar informações dos usuários separadamente
        const userIds = [...new Set(paymentsData.map(p => p.user_id))];
        
        const { data: usersData, error: usersError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        if (usersError) {
          console.error('Error loading user profiles:', usersError);
        }

        // Buscar assinaturas dos usuários
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_subscriptions')
          .select('user_id, plan')
          .in('user_id', userIds);

        if (subscriptionsError) {
          console.error('Error loading subscriptions:', subscriptionsError);
        }

        // Combinar os dados
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
        
        // Calcular estatísticas
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

        // Carregar assinaturas ativas
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

  useEffect(() => {
    loadPayments();
  }, [searchTerm, filterStatus, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pagamentos</h1>
          <p className="text-gray-600 mt-1">Análise financeira e transações</p>
        </div>
        <Button onClick={exportPayments} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.monthlyRevenue)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transações</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalTransactions}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assinaturas Ativas</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.activeSubscriptions}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(stats.averageTicket)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="succeeded">Sucesso</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">
                    {payment.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{payment.user_email}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(Number(payment.amount))}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {payment.payment_method || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(payment.plan || 'free')}>
                      {payment.plan || 'free'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {payments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pagamento encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
