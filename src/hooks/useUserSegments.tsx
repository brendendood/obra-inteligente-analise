
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSegment {
  id: string;
  user_id: string;
  segment_name: string;
  segment_data: any;
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

export function useUserSegments() {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSegment, setFilterSegment] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUserSegments();
  }, []);

  const loadUserSegments = async () => {
    try {
      setLoading(true);
      console.log('🔄 USER SEGMENTS: Carregando segmentos...');

      const { data: segmentsData, error } = await supabase
        .from('user_segments')
        .select(`
          *,
          user_profiles(full_name, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ USER SEGMENTS: Erro ao carregar:', error);
        toast({
          title: "Erro ao carregar segmentos",
          description: error.message,
          variant: "destructive",
        });
        setSegments([]);
        return;
      }

      // Buscar emails dos usuários - com tratamento de erro
      let authUsers: any[] = [];
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('❌ USER SEGMENTS: Erro ao buscar auth users:', authError);
        } else {
          authUsers = authData?.users || [];
        }
      } catch (authError) {
        console.error('❌ USER SEGMENTS: Erro crítico ao buscar auth users:', authError);
      }

      const mappedSegments: UserSegment[] = (segmentsData || []).map(segment => {
        const authUser = authUsers.find(u => u.id === segment.user_id);
        const userProfile = Array.isArray(segment.user_profiles) && segment.user_profiles.length > 0
          ? segment.user_profiles[0] 
          : null;

        return {
          id: segment.id || '',
          user_id: segment.user_id || '',
          segment_name: segment.segment_name || '',
          segment_data: segment.segment_data || {},
          auto_generated: Boolean(segment.auto_generated),
          created_at: segment.created_at || new Date().toISOString(),
          updated_at: segment.updated_at || new Date().toISOString(),
          user_email: authUser?.email || 'Email não encontrado',
          user_name: userProfile?.full_name || null,
        };
      });

      console.log('✅ USER SEGMENTS: Segmentos carregados:', mappedSegments.length);
      setSegments(mappedSegments);
    } catch (error) {
      console.error('💥 USER SEGMENTS: Erro crítico:', error);
      setSegments([]);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os segmentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSegmentsCSV = (segmentType?: string) => {
    try {
      const filteredSegments = segmentType 
        ? segments.filter(s => s.segment_name === segmentType)
        : segments;

      if (filteredSegments.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há segmentos para o filtro selecionado",
          variant: "destructive",
        });
        return;
      }

      const csv = [
        ['Email', 'Nome', 'Segmento', 'Dados', 'Criado em'].join(','),
        ...filteredSegments.map(segment => [
          segment.user_email || '',
          segment.user_name || '',
          segment.segment_name || '',
          JSON.stringify(segment.segment_data || {}).replace(/"/g, '""'),
          new Date(segment.created_at).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `segmentos-${segmentType || 'todos'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `${filteredSegments.length} registros exportados com sucesso`,
      });
    } catch (error) {
      console.error('❌ EXPORT: Erro ao exportar CSV:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo CSV",
        variant: "destructive",
      });
    }
  };

  // Estatísticas dos segmentos - com tratamento seguro
  const segmentStats = {
    total: segments.length,
    active_weekly: segments.filter(s => s.segment_name === 'active_weekly').length,
    high_potential: segments.filter(s => s.segment_name === 'high_potential').length,
    stagnant: segments.filter(s => s.segment_name === 'stagnant').length,
  };

  // Filtros aplicados
  const filteredSegments = segments.filter(segment => {
    const matchesFilter = !filterSegment || segment.segment_name === filterSegment;
    return matchesFilter;
  });

  return {
    segments: filteredSegments,
    segmentStats,
    loading,
    filterSegment,
    setFilterSegment,
    exportSegmentsCSV,
    refreshSegments: loadUserSegments,
  };
}
