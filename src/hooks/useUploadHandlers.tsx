
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
    console.log('🔍 UPLOAD (popup): validação inicial...');

    const validation = await validateCompleteUpload(file, projectName);
    if (!validation.isValid) {
      toast({
        title: '❌ Validação falhou',
        description: validation.combinedError || 'Arquivo ou nome inválido',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({ title: '❌ Usuário não autenticado', description: 'Faça login novamente.', variant: 'destructive' });
      return;
    }

    if (!stateUF || !cityName) {
      toast({ title: '❌ Campos obrigatórios', description: 'Selecione Estado e Cidade.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setProgress(5);
    startProcessing();

    try {
      // 1) Upload do arquivo primeiro (para respeitar NOT NULL de file_path)
      const storagePath = `${user.id}/${Date.now()}-${file!.name}`;
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(storagePath, file!);

      if (uploadError) {
        console.error('❌ Erro no storage:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      setProgress(25);

      // 2) Criar projeto no banco com caminho do arquivo
      const { data: createdProject, error: insertError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectName.trim(),
          state: stateUF,
          city: cityName,
          country: 'Brasil',
          project_status: 'draft',
          file_path: storagePath,
          file_size: file!.size,
        })
        .select()
        .single();

      if (insertError || !createdProject) {
        console.error('❌ Erro ao criar projeto:', insertError);
        throw new Error('Falha ao criar o projeto no banco de dados.');
      }

      setProgress(45);

      // 4) Webhook N8N temporariamente desabilitado para versão demo
      console.log('🔄 Webhook N8N desabilitado para demo - projeto processado apenas via edge function');
      
      // WEBHOOK DESABILITADO TEMPORARIAMENTE PARA DEMO
      // try {
      //   const webhookUrl = 'https://madeai-br.app.n8n.cloud/webhook-test/upload-projeto';
      //   const payload = {
      //     project_id: createdProject.id,
      //     user_id: user.id,
      //     state: stateUF,
      //     document_type: 'pdf',
      //     file_name: file!.name,
      //   };
      //   const resp = await fetch(webhookUrl, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(payload),
      //   });
      //   if (!resp.ok) {
      //     console.warn('⚠️ Webhook N8N retornou status não OK:', resp.status);
      //   }
      // } catch (whErr) {
      //   console.warn('⚠️ Falha ao enviar webhook N8N:', whErr);
      // }

      setProgress(65);

      // 5) Chamar edge function para processar e ATUALIZAR projeto existente
      const { data, error: processError } = await supabase.functions.invoke('upload-project', {
        body: {
          fileName: storagePath,
          originalName: file!.name,
          projectName: projectName.trim(),
          fileSize: file!.size,
          projectId: createdProject.id,
          state: stateUF,
          city: cityName,
        },
      });

      if (processError) {
        console.error('❌ Erro no processamento:', processError);
        throw new Error(`Erro no processamento: ${processError.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro no processamento');
      }

      setProgress(100);
      setUploadComplete(true);
      stopProcessing();

      toast({ title: '🎉 Projeto enviado!', description: data.message || 'Seu projeto foi analisado com sucesso.' });

      // Redirecionar para o projeto criado
      const pid = data.project?.id || createdProject.id;
      setTimeout(() => navigate(`/projeto/${pid}`, { replace: true }), 1200);
    } catch (error: any) {
      console.error('💥 Erro no upload:', error);
      stopProcessing();
      toast({ title: '❌ Erro no upload', description: error?.message || 'Erro desconhecido', variant: 'destructive' });
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
