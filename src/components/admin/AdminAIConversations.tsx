import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, User, Calendar, Eye, Download, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  message_count: number;
  user_profile?: {
    full_name: string;
    email: string;
    company: string;
  };
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export const AdminAIConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm, statusFilter]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Buscar conversas básicas
      const { data: conversationsData, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Buscar contagem de mensagens e dados do usuário para cada conversa
      const conversationsWithData = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Contar mensagens
          const { count } = await supabase
            .from('ai_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          // Buscar perfil do usuário
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('full_name, company')
            .eq('user_id', conv.user_id)
            .single();

          return {
            id: conv.id,
            title: conv.title,
            user_id: conv.user_id,
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            status: conv.status,
            message_count: count || 0,
            user_profile: {
              full_name: userProfile?.full_name || 'N/A',
              company: userProfile?.company || 'N/A',
              email: 'N/A' // Será preenchido abaixo
            }
          };
        })
      );

      // Por agora usar apenas os dados básicos, sem emails de auth
      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterConversations = () => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user_profile?.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(conv => conv.status === statusFilter);
    }

    setFilteredConversations(filtered);
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('id, content, role, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'assistant'
      })));
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive"
      });
    }
  };

  const exportConversation = async (conversation: Conversation) => {
    try {
      await loadConversationMessages(conversation.id);
      
      const exportData = {
        conversation,
        messages: messages
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversa-${conversation.user_profile?.full_name || 'usuario'}-${new Date(conversation.created_at).toLocaleDateString()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sucesso",
        description: "Conversa exportada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao exportar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar a conversa",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Conversas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {conversations.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.reduce((total, conv) => total + conv.message_count, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Média Mensagens/Conversa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.length > 0 
                ? Math.round(conversations.reduce((total, conv) => total + conv.message_count, 0) / conversations.length)
                : 0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por usuário, email ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="archived">Arquivadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle>Conversas de IA ({filteredConversations.length})</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as conversas dos usuários com o assistente IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{conversation.title}</h3>
                      <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                        {conversation.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {conversation.user_profile?.full_name || 'N/A'} ({conversation.user_profile?.email})
                        </span>
                        {conversation.user_profile?.company && (
                          <span>• {conversation.user_profile.company}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(conversation.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span>• {conversation.message_count} mensagens</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog onOpenChange={(open) => {
                    if (open) {
                      setSelectedConversation(conversation);
                      loadConversationMessages(conversation.id);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Conversa: {selectedConversation?.title}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded">
                          <h4 className="font-medium mb-2">Informações do Usuário</h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Nome:</strong> {selectedConversation?.user_profile?.full_name}</p>
                            <p><strong>Email:</strong> {selectedConversation?.user_profile?.email}</p>
                            <p><strong>Empresa:</strong> {selectedConversation?.user_profile?.company || 'N/A'}</p>
                            <p><strong>Data:</strong> {selectedConversation && new Date(selectedConversation.created_at).toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <div className="text-sm whitespace-pre-wrap">
                                  {message.content}
                                </div>
                                <div className={`text-xs mt-2 ${
                                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {new Date(message.created_at).toLocaleString('pt-BR')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportConversation(conversation)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};