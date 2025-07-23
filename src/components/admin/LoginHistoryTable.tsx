import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Monitor, Smartphone, Tablet, Globe, Clock, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { exportLoginHistoryToExcel } from '@/utils/adminExportUtils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAdminLoginHistory } from '@/hooks/useAdminLoginHistory';

export const LoginHistoryTable = () => {
  const { loginHistory, loading, refreshHistory } = useAdminLoginHistory();
  const { toast } = useToast();

  const handleExportExcel = async () => {
    const result = exportLoginHistoryToExcel(loginHistory);
    if (result.success) {
      toast({
        title: "✅ Excel exportado",
        description: `Histórico de logins exportado: ${result.filename}`,
      });
    } else {
      toast({
        title: "❌ Erro na exportação",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getLocationString = (login: any) => {
    if (login.city && login.region && login.country) {
      return `${login.city}, ${login.region}, ${login.country}`;
    }
    if (login.city && login.country) {
      return `${login.city}, ${login.country}`;
    }
    if (login.country) {
      return login.country;
    }
    return 'Localização não disponível';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Logins Reais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Logins Reais ({loginHistory.length} registros)
          </CardTitle>
          <div className="flex gap-2">
            {loginHistory.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={refreshHistory} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loginHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum login registrado ainda.</p>
            <p className="text-sm">Os próximos logins serão capturados automaticamente.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Navegador</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Sistema</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((login) => (
                  <TableRow key={login.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(login.login_at)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm font-medium">
                        {login.user_id.substring(0, 8)}...
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div>{getLocationString(login)}</div>
                          {login.latitude && login.longitude && (
                            <div className="text-xs text-gray-500">
                              {login.latitude.toFixed(4)}, {login.longitude.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(login.device_type || '')}
                        <Badge variant="outline">
                          {login.device_type || 'Desconhecido'}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {login.browser || 'Desconhecido'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {login.ip_address || 'N/A'}
                      </code>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {login.os || 'Desconhecido'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};