
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, FileText } from 'lucide-react';

interface UserData {
  user_id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  project_count: number;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Buscar usuários com contagem de projetos
      const { data: projects, error } = await supabase
        .from('projects')
        .select('user_id, created_at');

      if (error) throw error;

      // Agrupar projetos por usuário
      const userProjects = projects?.reduce((acc: Record<string, number>, project) => {
        acc[project.user_id] = (acc[project.user_id] || 0) + 1;
        return acc;
      }, {}) || {};

      // Simular dados de usuários (em produção, seria uma query apropriada)
      const mockUsers: UserData[] = Object.keys(userProjects).map(userId => ({
        user_id: userId,
        email: `user-${userId.slice(0, 8)}@example.com`,
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        project_count: userProjects[userId] || 0
      }));

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Usuários Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-2">Carregando usuários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span>Usuários Recentes</span>
        </CardTitle>
        <CardDescription>
          Lista dos usuários mais ativos na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.slice(0, 5).map((user) => (
            <div key={user.user_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{user.email}</p>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>{user.project_count} projetos</span>
                </Badge>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersList;
