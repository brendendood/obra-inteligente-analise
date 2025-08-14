
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building, Briefcase, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { validateEmail, validatePassword, formatAuthError } from '@/utils/authValidation';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

type SignupStep = 1 | 2 | 3;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  position: string;
  acceptTerms: boolean;
}

interface ReferralValidationResponse {
  valid: boolean;
  message: string;
  referrer?: {
    name: string;
    company: string;
    email: string;
  };
}

function Signup() {
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralValidating, setReferralValidating] = useState(false);
  const [referralInfo, setReferralInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: '',
    acceptTerms: false
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithApple, loading: socialLoading } = useSocialAuth();

  // Check for referral code on component mount and validate it
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
      validateReferralCode(refParam);
    }
  }, [searchParams]);

  const validateReferralCode = async (code: string) => {
    setReferralValidating(true);
    try {
      const { data, error } = await supabase.rpc('validate_referral_code', {
        p_ref_code: code
      });

      if (error) throw error;

      const response = data as unknown as ReferralValidationResponse;

      if (response.valid) {
        setReferralInfo(response.referrer);
        toast({
          title: "🎉 Indicação válida!",
          description: `Você foi indicado por ${response.referrer?.name}. Receberá 5 créditos gratuitos!`,
          duration: 5000,
        });
      } else {
        toast({
          title: "❌ Código inválido",
          description: response.message,
          variant: "destructive",
          duration: 5000,
        });
        setReferralCode(null);
      }
    } catch (error) {
      console.error('Erro validando referral:', error);
      toast({
        title: "❌ Erro na validação",
        description: "Não foi possível validar o código de indicação.",
        variant: "destructive",
      });
      setReferralCode(null);
    } finally {
      setReferralValidating(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "❌ Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return false;
    }


    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast({
        title: "❌ Senha inválida",
        description: passwordValidation.errors[0],
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "❌ Senhas não coincidem",
        description: "As senhas informadas não são iguais.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!formData.acceptTerms) {
      toast({
        title: "❌ Aceite necessário",
        description: "Você deve aceitar os Termos de Uso e Política de Privacidade.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as SignupStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SignupStep);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);

    try {
      const userData: any = {
        full_name: formData.fullName,
        company: formData.company,
        cargo: formData.position,
        avatar_type: 'initials',
        gender: 'male'
      };

      // Add referral code if present
      if (referralCode) {
        userData.ref_code = referralCode;
      }

      // Signup sem confirmação de email automática
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/painel`
        }
      });

      if (error) throw error;

      // Sempre enviar email customizado de verificação
      if (data.user) {
        try {
          const verificationResponse = await supabase.functions.invoke('send-verification-email', {
            body: {
              email: formData.email,
              user_data: {
                full_name: formData.fullName,
                user_id: data.user.id
              }
            }
          });

          if (verificationResponse.error) {
            console.warn('Erro ao enviar email de verificação:', verificationResponse.error);
            toast({
              title: "⚠️ Aviso",
              description: "Conta criada mas houve problema no envio do email. Tente reenviar na tela de login.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "✅ Email enviado!",
              description: "Verifique sua caixa de entrada para confirmar seu email.",
            });
          }
        } catch (emailError) {
          console.warn('Falha ao disparar email de verificação:', emailError);
          toast({
            title: "⚠️ Aviso",
            description: "Conta criada mas houve problema no envio do email. Tente reenviar na tela de login.",
            variant: "destructive"
          });
        }

        setSuccess(true);
        toast({
          title: "✅ Conta criada com sucesso!",
          description: "Verifique seu email para confirmar sua conta e acessar o MadeAI."
        });
      } else {
        toast({
          title: "✅ Conta criada com sucesso!",
          description: "Bem-vindo ao MadeAI!"
        });
        navigate('/painel');
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "❌ Erro no cadastro",
        description: formatAuthError(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Conta criada com sucesso!
          </h2>
          <p className="text-muted-foreground">
            Enviamos um email de verificação para <strong>{formData.email}</strong>.
            Clique no link "Confirmar Email" no email para ativar sua conta e ter acesso completo à plataforma.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>⚠️ Importante:</strong> Você só conseguirá fazer login após confirmar seu email.
          </p>
          <Button asChild className="w-full">
            <Link to="/login">Ir para Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <UnifiedLogo size="xl" clickable={false} theme="auto" className="mx-auto" />
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Titles */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {currentStep === 1 && "Dados pessoais"}
              {currentStep === 2 && "Dados profissionais"}
              {currentStep === 3 && "Finalizar cadastro"}
            </h2>
            <p className="text-muted-foreground">
              {currentStep === 1 && "Vamos começar com suas informações básicas"}
              {currentStep === 2 && "Conte-nos mais sobre seu trabalho (opcional)"}
              {currentStep === 3 && "Quase lá! Confirme os dados e aceite os termos"}
            </p>
          </div>

          {/* Referral Info */}
          {referralCode && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {referralValidating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                ) : (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {referralValidating ? "Validando código de indicação..." : "Código de indicação válido!"}
                  </p>
                  {referralInfo && (
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Indicado por: {referralInfo.name} • Você receberá 5 créditos gratuitos
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Steps */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                 {/* Social Login Buttons - Disabled */}
                <div className="space-y-3 flex flex-col items-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full max-w-sm h-12 flex items-center justify-center gap-3 text-base font-medium opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Em breve
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full max-w-sm h-12 flex items-center justify-center gap-3 text-base font-medium opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Em breve
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou cadastre-se com email
                    </span>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                 {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Crie uma senha segura"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <PasswordStrengthIndicator password={formData.password} />
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Company Field */}
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da empresa <span className="text-muted-foreground">(opcional)</span></Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nome da sua empresa"
                      value={formData.company}
                      onChange={(e) => updateFormData('company', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Position Field */}
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo <span className="text-muted-foreground">(opcional)</span></Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="position"
                      type="text"
                      placeholder="Seu cargo/função"
                      value={formData.position}
                      onChange={(e) => updateFormData('position', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Essas informações nos ajudam a personalizar sua experiência
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-foreground">Resumo dos dados:</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nome:</strong> {formData.fullName}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    {formData.company && <div><strong>Empresa:</strong> {formData.company}</div>}
                    {formData.position && <div><strong>Cargo:</strong> {formData.position}</div>}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => updateFormData('acceptTerms', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                    Aceito os{' '}
                    <Link to="/termos" className="text-primary hover:underline" target="_blank">
                      Termos de Uso
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                      Política de Privacidade
                    </Link>{' '}
                    do MadeAI
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !formData.acceptTerms}
                  className="flex-1"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              )}
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Marketing Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/5 to-purple-600/5 items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Junte-se aos profissionais que já transformaram seus projetos
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>IA avançada para análise de projetos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span>Orçamentos automáticos precisos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Cronogramas otimizados</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span>Dados seguros e criptografados</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Gratuito para começar • Sem cartão de crédito
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
