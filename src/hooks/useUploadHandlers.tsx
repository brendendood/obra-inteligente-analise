
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateCompleteUpload } from '@/utils/uploadValidator';

interface UseUploadHandlersProps {
  file: File | null;
  projectName: string;
  stateUF: string;
  cityName: string;
  user: any;
  validatedProject: any;
  setUploading: (uploading: boolean) => void;
  setProgress: (progress: number) => void;
  setUploadComplete: (complete: boolean) => void;
  setValidatedProject: (project: any) => void;
  startProcessing: () => void;
  stopProcessing: () => void;
  loadUserProjects: () => Promise<any[]>;
}

export const useUploadHandlers = ({
  file,
  projectName,
  stateUF,
  cityName,
  user,
  validatedProject,
  setUploading,
  setProgress,
  setUploadComplete,
  setValidatedProject,
  startProcessing,
  stopProcessing,
  loadUserProjects
}: UseUploadHandlersProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpload = async () => {
    console.log('🔍 UPLOAD: Iniciando processo de upload...');
    console.log('📊 UPLOAD: Dados do usuário:', { userId: user?.id, email: user?.email });
    console.log('📄 UPLOAD: Dados do projeto:', { projectName, file: file?.name, stateUF, cityName });

    // Verificar autenticação robusta
    if (!user?.id) {
      console.error('❌ UPLOAD: Usuário não autenticado ou sem ID');
      toast({ 
        title: '❌ Erro de autenticação', 
        description: 'Faça login novamente para continuar.', 
        variant: 'destructive' 
      });
      return;
    }

    // Verificar sessão Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('❌ UPLOAD: Sessão inválida:', sessionError);
      toast({ 
        title: '❌ Sessão expirada', 
        description: 'Sua sessão expirou. Faça login novamente.', 
        variant: 'destructive' 
      });
      return;
    }
    console.log('✅ UPLOAD: Sessão válida confirmada');

    const validation = await validateCompleteUpload(file, projectName);
    if (!validation.isValid) {
      console.error('❌ UPLOAD: Validação falhou:', validation.combinedError);
      toast({
        title: '❌ Validação falhou',
        description: validation.combinedError || 'Arquivo ou nome inválido',
        variant: 'destructive',
      });
      return;
    }

    if (!stateUF || !cityName) {
      console.error('❌ UPLOAD: Campos obrigatórios faltando:', { stateUF, cityName });
      toast({ title: '❌ Campos obrigatórios', description: 'Selecione Estado e Cidade.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setProgress(5);
    startProcessing();

    try {
      // 1) Upload do arquivo primeiro (para respeitar NOT NULL de file_path)
      const storagePath = `${user.id}/${Date.now()}-${file!.name}`;
      console.log('📤 UPLOAD: Iniciando upload para storage:', storagePath);
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(storagePath, file!);

      if (uploadError) {
        console.error('❌ UPLOAD: Erro no storage:', uploadError);
        throw new Error(`Erro no upload para storage: ${uploadError.message}`);
      }
      console.log('✅ UPLOAD: Arquivo enviado para storage com sucesso');

      setProgress(25);

      // 2) Criar projeto no banco com caminho do arquivo
      console.log('💾 UPLOAD: Criando projeto no banco de dados...');
      const projectData = {
        user_id: user.id,
        name: projectName.trim(),
        state: stateUF,
        city: cityName,
        country: 'Brasil',
        project_status: 'draft',
        file_path: storagePath,
        file_size: file!.size,
      };
      console.log('📊 UPLOAD: Dados do projeto para inserção:', projectData);

      const { data: createdProject, error: insertError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ UPLOAD: Erro detalhado ao criar projeto:', {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw new Error(`Falha ao criar projeto: ${insertError.message}`);
      }

      if (!createdProject) {
        console.error('❌ UPLOAD: Projeto não foi criado (dados null)');
        throw new Error('Falha ao criar o projeto no banco de dados.');
      }

      console.log('✅ UPLOAD: Projeto criado com sucesso:', createdProject.id);
      setProgress(45);

      // 4) Enviar webhook ao N8N com ID do projeto, UF e user_id (sem cidade)
      try {
        const webhookUrl = 'https://madeai-br.app.n8n.cloud/webhook-test/upload-projeto';
        const payload = {
          project_id: createdProject.id,
          user_id: user.id,
          state: stateUF,
          document_type: 'pdf',
          file_name: file!.name,
        };
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) {
          console.warn('⚠️ Webhook N8N retornou status não OK:', resp.status);
        }
      } catch (whErr) {
        console.warn('⚠️ Falha ao enviar webhook N8N:', whErr);
      }

      setProgress(65);

      // 5) Chamar edge function para processar e ATUALIZAR projeto existente
      console.log('🔄 UPLOAD: Chamando edge function para processamento...');
      const edgeFunctionPayload = {
        fileName: storagePath,
        originalName: file!.name,
        projectName: projectName.trim(),
        fileSize: file!.size,
        projectId: createdProject.id,
        state: stateUF,
        city: cityName,
      };
      console.log('📤 UPLOAD: Payload para edge function:', edgeFunctionPayload);

      const { data, error: processError } = await supabase.functions.invoke('upload-project', {
        body: edgeFunctionPayload,
      });

      if (processError) {
        console.error('❌ UPLOAD: Erro na edge function:', {
          error: processError,
          message: processError.message,
          context: processError.context
        });
        throw new Error(`Erro no processamento: ${processError.message}`);
      }

      console.log('📊 UPLOAD: Resposta da edge function:', data);

      if (!data?.success) {
        console.error('❌ UPLOAD: Edge function retornou falha:', data);
        throw new Error(data?.error || 'Erro no processamento da edge function');
      }

      console.log('✅ UPLOAD: Edge function processada com sucesso');
      setProgress(100);
      setUploadComplete(true);
      stopProcessing();

      // Recarregar lista de projetos para garantir que apareça no painel
      try {
        await loadUserProjects();
        console.log('✅ UPLOAD: Lista de projetos recarregada');
      } catch (reloadError) {
        console.warn('⚠️ UPLOAD: Erro ao recarregar projetos:', reloadError);
      }

      toast({ title: '🎉 Projeto enviado!', description: data.message || 'Seu projeto foi analisado com sucesso.' });

      // Redirecionar para o projeto criado
      const pid = data.project?.id || createdProject.id;
      console.log('🔄 UPLOAD: Redirecionando para projeto:', pid);
      setTimeout(() => navigate(`/projeto/${pid}`, { replace: true }), 1200);
    } catch (error: any) {
      console.error('💥 UPLOAD: Erro crítico:', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      stopProcessing();
      
      // Mensagem de erro mais específica
      let errorMessage = 'Erro desconhecido';
      if (error?.message?.includes('autenticação') || error?.message?.includes('Unauthorized')) {
        errorMessage = 'Erro de autenticação. Faça login novamente.';
      } else if (error?.message?.includes('storage')) {
        errorMessage = 'Erro no envio do arquivo. Tente novamente.';
      } else if (error?.message?.includes('banco de dados')) {
        errorMessage = 'Erro ao salvar projeto. Verifique sua conexão.';
      } else if (error?.message?.includes('processamento')) {
        errorMessage = 'Erro no processamento. O arquivo pode estar corrompido.';
      } else {
        errorMessage = error?.message || 'Erro inesperado durante o upload';
      }
      
      toast({ 
        title: '❌ Erro no upload', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeExisting = () => {
    if (validatedProject) {
      navigate(`/projeto/${validatedProject.id}`);
    } else {
      toast({
        title: "ℹ️ Nenhum projeto encontrado",
        description: "Faça upload de um projeto primeiro.",
        variant: "default",
      });
    }
  };

  return {
    handleUpload,
    handleAnalyzeExisting
  };
};
