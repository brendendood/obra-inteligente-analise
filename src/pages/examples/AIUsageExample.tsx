"use client";

import React, { useRef, useState } from "react";
import AIMessageGuard from "@/components/ai/AIMessageGuard";
import AiUsageMeter from "@/components/ai/AiUsageMeter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

/**
 * Página de exemplo do chat de IA com:
 * - Medidor de uso (AiUsageMeter)
 * - Gate de envio por mensagem (AIMessageGuard)
 * - Integração com edge function de tracking
 */
export default function AIUsageExamplePage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const onSubmit = async (
    ev: React.FormEvent<HTMLFormElement>,
    canSendAiMessage: () => Promise<boolean>
  ) => {
    ev.preventDefault();
    setStatus(null);

    const messageText = message.trim();
    if (!messageText) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem primeiro",
        variant: "destructive"
      });
      return;
    }

    // Verificar se pode enviar mensagem (usa o tracking server-side)
    const allowed = await canSendAiMessage();
    if (!allowed) {
      // Bloqueio é mostrado pelo AIMessageGuard (PremiumBlocker)
      return;
    }

    // Simular envio da mensagem para IA
    setStatus("Processando mensagem...");
    
    // Aqui você conectaria com sua API real de IA
    setTimeout(() => {
      setStatus("Mensagem enviada com sucesso para a IA!");
      setMessage("");
      
      toast({
        title: "Sucesso",
        description: "Mensagem enviada para o assistente de IA",
      });
    }, 1000);
  };

  return (
    <main className="container mx-auto p-6 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Chat IA com Controle de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AiUsageMeter />
            
            <AIMessageGuard>
              {({ canSend, nearLimit, remaining }) => (
                <form
                  ref={formRef}
                  onSubmit={(e) => onSubmit(e, async () => {
                    // Função que chama o tracking server-side
                    const { trackAIMessage } = await import("@/lib/api/ai-tracking");
                    const result = await trackAIMessage();
                    
                    if (!result.allowed) {
                      toast({
                        title: "Limite atingido",
                        description: result.reason === "limit_reached" 
                          ? "Você atingiu o limite de mensagens do seu plano" 
                          : "Não foi possível enviar a mensagem",
                        variant: "destructive"
                      });
                      return false;
                    }
                    
                    return true;
                  })}
                  className="space-y-4"
                >
                  <div>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Digite sua mensagem para o assistente de IA..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {nearLimit && remaining !== undefined && remaining <= 20 ? (
                        <span className="text-yellow-600">
                          Atenção: você está próximo do limite. Restam{" "}
                          <strong>{remaining}</strong> mensagens.
                        </span>
                      ) : (
                        <span>Envie sua mensagem para o Assistente de IA.</span>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={!canSend || !message.trim()}
                      className="bg-blue-600 hover:bg-blue-500"
                    >
                      Enviar
                    </Button>
                  </div>

                  {status && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                      {status}
                    </div>
                  )}
                </form>
              )}
            </AIMessageGuard>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona o controle de mensagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• <strong>Plano FREE:</strong> 50 mensagens por mês</p>
          <p>• <strong>Plano BASIC:</strong> 500 mensagens por mês</p>
          <p>• <strong>Plano PRO:</strong> 2.000 mensagens por mês</p>
          <p>• <strong>Plano ENTERPRISE:</strong> Mensagens ilimitadas</p>
          <p>• O contador é reiniciado a cada mês</p>
          <p>• O tracking é feito de forma segura no servidor</p>
        </CardContent>
      </Card>
    </main>
  );
}