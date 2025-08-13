import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { GenderSelect } from '@/components/account/GenderSelect';
import { useEmailSystem } from '@/hooks/useEmailSystem';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  cargo: string;
  gender: 'male' | 'female' | 'neutral';
  refCode: string;
}

const SignupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    cargo: '',
    gender: 'male',
    refCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendWelcomeEmail, sendOnboardingEmail } = useEmailSystem();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          toast({ title: "❌ Nome obrigatório", description: "Por favor, preencha seu nome completo." });
          return false;
        }
        if (!formData.email.trim()) {
          toast({ title: "❌ Email obrigatório", description: "Por favor, preencha seu email." });
          return false;
        }
        if (formData.password.length < 8) {
          toast({ title: "❌ Senha muito fraca", description: "A senha deve ter pelo menos 8 caracteres." });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "❌ Senhas não coincidem", description: "Por favor, confirme sua senha corretamente." });
          return false;
        }
        return true;
      case 3:
        if (!acceptedTerms) {
          toast({ title: "❌ Aceite os termos", description: "Você deve aceitar os Termos de Uso." });
          return false;
        }
        if (!acceptedPrivacy) {
          toast({ title: "❌ Aceite a política", description: "Você deve aceitar a Política de Privacidade." });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);

    try {
      console.log('🔐 SIGNUP: Iniciando cadastro para:', formData.email);

      // Registrar usuário no Supabase Auth (SEM emailRedirectTo para usar apenas Resend)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company: formData.company,
            cargo: formData.cargo,
            gender: formData.gender,
            ref_code: formData.refCode || undefined,
          }
          // Removido emailRedirectTo para evitar email automático do Supabase
        }
      });

      if (authError) {
        console.error('❌ SIGNUP: Erro na criação:', authError);
        
        if (authError.message.includes('already registered')) {
          toast({
            title: "❌ Email já cadastrado",
            description: "Este email já possui uma conta. Tente fazer login ou usar outro email.",
          });
        } else {
          toast({
            title: "❌ Erro no cadastro",
            description: authError.message,
          });
        }
        return;
      }

      if (!authData.user) {
        throw new Error('Falha na criação do usuário');
      }

      console.log('✅ SIGNUP: Usuário criado:', authData.user.id);

      // Sequência de emails via Resend
      const emailPromises = [];

      // 1. Email de verificação personalizado
      try {
        console.log('📧 SIGNUP: Enviando email de verificação via Resend...');
        
        const verificationPromise = supabase.functions.invoke('send-verification-email', {
          body: {
            email: formData.email,
            user_data: {
              full_name: formData.fullName,
              user_id: authData.user.id
            }
          }
        });
        emailPromises.push(verificationPromise);

      } catch (emailError) {
        console.error('⚠️ SIGNUP: Erro na função de verificação:', emailError);
      }

      // 2. Email de boas-vindas
      try {
        console.log('📧 SIGNUP: Enviando email de boas-vindas...');
        const welcomePromise = sendWelcomeEmail(formData.email, formData.fullName);
        emailPromises.push(welcomePromise);
      } catch (emailError) {
        console.error('⚠️ SIGNUP: Erro no email de boas-vindas:', emailError);
      }

      // 3. Email de onboarding
      try {
        console.log('📧 SIGNUP: Enviando email de onboarding...');
        const onboardingPromise = sendOnboardingEmail(formData.email, formData.fullName);
        emailPromises.push(onboardingPromise);
      } catch (emailError) {
        console.error('⚠️ SIGNUP: Erro no email de onboarding:', emailError);
      }

      // Aguardar todos os emails (sem bloquear o processo se algum falhar)
      const emailResults = await Promise.allSettled(emailPromises);
      
      let emailErrors = 0;
      emailResults.forEach((result, index) => {
        const emailTypes = ['verificação', 'boas-vindas', 'onboarding'];
        if (result.status === 'rejected') {
          console.error(`❌ SIGNUP: Falha no email de ${emailTypes[index]}:`, result.reason);
          emailErrors++;
        } else {
          console.log(`✅ SIGNUP: Email de ${emailTypes[index]} enviado com sucesso`);
        }
      });

      if (emailErrors > 0) {
        toast({
          title: "⚠️ Aviso",
          description: `Cadastro realizado! ${emailErrors} email(s) podem ter falhado. Verifique sua caixa de entrada.`,
        });
      } else {
        console.log('✅ SIGNUP: Todos os emails enviados com sucesso');
      }

      // Mostrar tela de sucesso
      setUserEmail(formData.email);
      setShowSuccess(true);

      toast({
        title: "🎉 Cadastro realizado!",
        description: `Bem-vindo(a), ${formData.fullName}! Verifique seu email para ativar sua conta.`,
      });

    } catch (error: any) {
      console.error('❌ SIGNUP: Erro geral:', error);
      toast({
        title: "❌ Erro no cadastro",
        description: error.message || "Erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      console.log('📧 RESEND: Reenviando verificação para:', userEmail);

      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: userEmail,
          user_data: {
            full_name: formData.fullName
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "📧 Email reenviado!",
        description: "Verifique sua caixa de entrada (e spam) novamente.",
      });

    } catch (error: any) {
      console.error('❌ RESEND: Erro:', error);
      toast({
        title: "❌ Erro no reenvio",
        description: error.message || "Não foi possível reenviar o email.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Indicador de progresso
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step <= currentStep 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'bg-background text-muted-foreground border-muted-foreground'
          }`}>
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step < currentStep ? 'bg-primary' : 'bg-muted-foreground'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Tela de sucesso após cadastro
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UnifiedLogo />
            <CardTitle className="text-2xl text-green-600">✅ Cadastro Realizado!</CardTitle>
            <CardDescription>
              Verifique seu email para ativar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>📧 Email enviado para:</strong><br />
                {userEmail}
                <br /><br />
                Clique no link de verificação para ativar sua conta e fazer login.
                <br /><br />
                <strong>⚠️ Não esqueça de verificar a pasta de spam!</strong>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={handleResendVerification}
                disabled={loading}
                variant="outline" 
                className="w-full"
              >
                {loading ? "Reenviando..." : "📧 Reenviar Email"}
              </Button>
              
              <Button 
                onClick={() => navigate('/login')}
                variant="default" 
                className="w-full"
              >
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar conteúdo do passo atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Digite a senha novamente"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Nome da sua empresa (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                type="text"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                placeholder="Seu cargo (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <GenderSelect
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refCode">Código de Indicação (opcional)</Label>
              <Input
                id="refCode"
                type="text"
                value={formData.refCode}
                onChange={(e) => handleInputChange('refCode', e.target.value)}
                placeholder="REF_XXXXXXXX"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Aceito os <Link to="/terms" className="text-primary underline">Termos de Uso</Link> *
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                />
                <Label htmlFor="privacy" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Aceito a <Link to="/privacy" className="text-primary underline">Política de Privacidade</Link> *
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Informações Básicas";
      case 2: return "Informações Profissionais";
      case 3: return "Finalizar Cadastro";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Crie sua conta com segurança";
      case 2: return "Conte-nos sobre seu trabalho";
      case 3: return "Aceite os termos e finalize";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <UnifiedLogo />
          <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
          <ProgressIndicator />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary underline hover:no-underline">
                Fazer Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupWizard;