import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReferralLinkGenerator } from '@/components/referral/ReferralLinkGenerator';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Users, TrendingUp } from 'lucide-react';

const ReferralPage = () => {
  return (
    <AppLayout>
      <div className="min-h-screen space-y-8 p-6">
        {/* Breadcrumb */}
        <EnhancedBreadcrumb />
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            Sistema de Indicações
          </h1>
          <p className="text-muted-foreground">
            Indique amigos e ganhe projetos extras permanentes
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Link Generator */}
          <div className="lg:col-span-2">
            <ReferralLinkGenerator />
          </div>

          {/* Benefícios */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Benefícios
                </CardTitle>
                <CardDescription>
                  Vantagens do sistema de indicações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">1 Projeto Extra</p>
                      <p className="text-sm text-muted-foreground">
                        Para cada pessoa que se cadastrar
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Permanente</p>
                      <p className="text-sm text-muted-foreground">
                        Os projetos extras nunca expiram
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Sem Limite</p>
                      <p className="text-sm text-muted-foreground">
                        Indique quantas pessoas quiser
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Fácil e Rápido</p>
                      <p className="text-sm text-muted-foreground">
                        Basta compartilhar seu link único
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Como Indicar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Copie seu link de indicação único</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Compartilhe com amigos, colegas ou nas redes sociais</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Quando alguém se cadastrar, você ganha automaticamente 1 projeto extra</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReferralPage;