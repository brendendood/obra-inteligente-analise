"use client";

import React, { useState } from "react";
import AIMessageGuard from "@/components/ai/AIMessageGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIExampleUsagePage() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ user: string; ai: string }[]>([]);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Chat com IA - Controle de Limites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIMessageGuard>
            {({ canSend, nearLimit, remaining }) => (
              <>
                {/* Status do limite */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">
                    <strong>Status:</strong> {canSend ? "✅ Pode enviar" : "❌ Limite atingido"}
                  </p>
                  <p className="text-sm">
                    <strong>Restantes:</strong> {remaining === undefined ? "Carregando..." : 
                      remaining === Infinity ? "Ilimitadas" : `${remaining} mensagens`}
                  </p>
                  {nearLimit && (
                    <p className="text-sm text-amber-600">⚠️ Próximo do limite (80%)</p>
                  )}
                </div>

                {/* Histórico da conversa */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {conversation.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                        <strong>Você:</strong> {item.user}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <strong>IA:</strong> {item.ai}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input para nova mensagem */}
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={!canSend}
                  />
                  <Button
                    onClick={async () => {
                      if (!message.trim() || !canSend) return;
                      
                      // Simular envio de mensagem à IA
                      const userMsg = message;
                      setMessage("");
                      
                      // Adicionar à conversa
                      const aiResponse = `Resposta simulada para: "${userMsg}"`;
                      setConversation(prev => [...prev, { user: userMsg, ai: aiResponse }]);
                    }}
                    disabled={!canSend || !message.trim()}
                  >
                    Enviar
                  </Button>
                </div>

                {!canSend && (
                  <p className="text-red-600 text-sm">
                    Limite de mensagens atingido. Faça upgrade do seu plano para continuar.
                  </p>
                )}
              </>
            )}
          </AIMessageGuard>
        </CardContent>
      </Card>
    </main>
  );
}