import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onAudioRecorded, 
  disabled = false,
  isMobile = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        onAudioRecorded(audioBlob);
        
        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer para mostrar tempo de gravação
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) { // Limite de 2 minutos
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: "Erro no microfone",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive",
      });
    }
  }, [onAudioRecorded, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="destructive"
          size={isMobile ? "sm" : "icon"}
          onClick={stopRecording}
          className={cn(
            "animate-pulse",
            isMobile ? "h-9 px-3" : "h-10 w-10"
          )}
        >
          <Square className={cn(isMobile ? "w-4 h-4" : "w-4 h-4")} />
          {isMobile && <span className="ml-1 text-xs">Parar</span>}
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          {formatTime(recordingTime)}
        </span>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={isMobile ? "sm" : "icon"}
      onClick={startRecording}
      disabled={disabled}
      className={cn(
        "transition-colors",
        isMobile ? "h-9 px-3" : "h-10 w-10"
      )}
      title="Gravar mensagem de voz"
    >
      <Mic className={cn(isMobile ? "w-4 h-4" : "w-4 h-4")} />
      {isMobile && <span className="ml-1 text-xs">Voz</span>}
    </Button>
  );
};