import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Download, 
  Building,
  FileText,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  User,
  Briefcase
} from 'lucide-react';

interface CRMClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  created_at: string;
}

interface CRMProject {
  id: string;
  name: string;
  client_id: string;
  value: number;
  status: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

interface CRMStats {
  client_id: string;
  client_name: string;
  projects_count: number;
  total_value: number;
  last_project_date: string;
}

export default function AdminUserCRMView() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [projects, setProjects] = useState<CRMProject[]>([]);
  const [stats, setStats] = useState<CRMStats[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userEmail = searchParams.get('email') || 'Usuário';

  useEffect(() => {
    if (userId) {
      loadUserCRMData();
    }
  }, [userId]);

  const loadUserCRMData = async () => {
    try {
      setLoading(true);
      
      // Buscar clientes do usuário
      const { data: clientsData, error: clientsError } = await supabase
        .from('crm_clients')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Buscar projetos do usuário
      const { data: projectsData, error: projectsError } = await supabase
        .from('crm_projects')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Buscar estatísticas do usuário
      const { data: statsData, error: statsError } = await supabase
        .from('v_crm_client_stats')
        .select('*')
        .eq('owner_id', userId);

      if (statsError) throw statsError;

      setClients(clientsData || []);
      setProjects(projectsData || []);
      setStats(statsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do CRM:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do CRM do usuário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCRM = async () => {
    try {
      const response = await fetch(`/api/admin/crm/export-user/${userId}`);
      
      if (!response.ok) throw new Error('Falha no download');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `crm_${userEmail}_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download iniciado",
        description: `CRM de ${userEmail} baixado com sucesso`
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro",
        description: "Falha ao baixar dados do CRM",
        variant: "destructive"
      });
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin-panel')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <h1 className="text-xl font-bold text-gray-900">
                  CRM - {userEmail}
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalClients = clients.length;
  const totalProjects = projects.length;
  const totalValue = projects.reduce((sum, p) => sum + (p.value || 0), 0);
  const activeClients = clients.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin-panel')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Admin
              </Button>
              <div className="border-l border-gray-300 h-6"></div>
              <User className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                CRM - {userEmail}
              </h1>
            </div>
            
            <Button
              onClick={handleDownloadCRM}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CRM
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-2xl font-semibold">{totalClients}</p>
                  <p className="text-xs text-muted-foreground">{activeClients} ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Projetos</p>
                  <p className="text-2xl font-semibold">{totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-semibold">R$ {totalValue.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Último Projeto</p>
                  <p className="text-sm font-semibold">
                    {projects.length > 0 
                      ? new Date(projects[0].created_at).toLocaleDateString('pt-BR')
                      : '—'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Clientes ({clients.length})
            </CardTitle>
            <CardDescription>
              Lista de clientes cadastrados pelo usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum cliente cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.company || '—'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {client.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={client.status === 'active' ? 'default' : 'secondary'}
                          >
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Projetos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projetos ({projects.length})
            </CardTitle>
            <CardDescription>
              Lista de projetos cadastrados pelo usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Projeto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum projeto cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{getClientName(project.client_id)}</TableCell>
                        <TableCell className="font-medium">
                          R$ {(project.value || 0).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{project.start_date}</div>
                            {project.end_date && (
                              <div className="text-muted-foreground">até {project.end_date}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(project.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}