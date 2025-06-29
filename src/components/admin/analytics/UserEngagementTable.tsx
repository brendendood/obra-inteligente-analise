
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, MousePointer, Calendar } from 'lucide-react';

interface UserEngagement {
  user_id: string;
  total_sessions: number;
  avg_session_duration: number;
  total_events: number;
  last_activity: string;
  engagement_score: number;
}

interface UserEngagementTableProps {
  userEngagement: UserEngagement[];
}

export const UserEngagementTable = ({ userEngagement }: UserEngagementTableProps) => {
  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Alto', color: 'bg-green-100 text-green-800' };
    if (score >= 50) return { label: 'Médio', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Baixo', color: 'bg-red-100 text-red-800' };
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  if (userEngagement.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de engajamento</h3>
          <p className="text-gray-500">
            Os dados de engajamento aparecerão quando houver atividade dos usuários.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engajamento dos Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Sessões</TableHead>
              <TableHead>Duração Média</TableHead>
              <TableHead>Eventos</TableHead>
              <TableHead>Última Atividade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userEngagement.map((user) => {
              const engagement = getEngagementLevel(user.engagement_score);
              return (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {user.user_id.slice(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={engagement.color}>
                          {engagement.label}
                        </Badge>
                        <span className="text-sm font-medium">
                          {Math.round(user.engagement_score)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(user.engagement_score, 100)} 
                        className="h-2 w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MousePointer className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {user.total_sessions}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {formatDuration(user.avg_session_duration)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {user.total_events}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(user.last_activity).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
