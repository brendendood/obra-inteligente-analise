import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { GenderSelect } from '@/components/account/GenderSelect';
import { useEmailSystem } from '@/hooks/useEmailSystem';
import { ChevronLeft, ChevronRight, Check, User, Building, Shield, Mail, ArrowLeft } from 'lucide-react';

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

const EnhancedSignupWizard = () => {
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
          toast({ title: "Nome obrigatório", description: "Por favor, preencha seu nome completo." });
          return false;
        }
        if (!formData.email.trim()) {
          toast({ title: "Email obrigatório", description: "Por favor, preencha seu email." });
          return false;
        }
        return true;
      case 2:
        if (formData.password.length < 8) {
          toast({ title: "Senha muito fraca", description: "A senha deve ter pelo menos 8 caracteres." });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Senhas não coincidem", description: "Por favor, confirme sua senha corretamente." });
          return false;
        }
        return true;
      case 3:
        if (!acceptedTerms) {
          toast({ title: "Aceite os termos", description: "Você deve aceitar os Termos de Uso." });
          return false;
        }
        if (!acceptedPrivacy) {
          toast({ title: "Aceite a política", description: "Você deve aceitar a Política de Privacidade." });
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
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já possui uma conta. Tente fazer login ou usar outro email.",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: authError.message,
          });
        }
        return;
      }

      if (!authData.user) {
        throw new Error('Falha na criação do usuário');
      }

      // Emails complementares
      try {
        await sendWelcomeEmail(formData.email, formData.fullName);
        await sendOnboardingEmail(formData.email, formData.fullName);
      } catch (emailError) {
        console.error('Erro nos emails:', emailError);
      }

      setUserEmail(formData.email);
      setShowSuccess(true);

      toast({
        title: "Cadastro realizado!",
        description: `Bem-vindo(a), ${formData.fullName}! Verifique seu email para ativar sua conta.`,
      });

    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'verified_user',
          recipient_email: userEmail,
          user_data: {
            full_name: formData.fullName,
            verification_url: '#'
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada (e spam) novamente.",
      });

    } catch (error: any) {
      toast({
        title: "Erro no reenvio",
        description: error.message || "Não foi possível reenviar o email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepConfig = () => {
    const configs = [
      { icon: User, title: "Dados Pessoais", subtitle: "Nome e email" },
      { icon: Shield, title: "Segurança", subtitle: "Senha da conta" },
      { icon: Check, title: "Finalização", subtitle: "Termos e confirmação" }
    ];
    return configs[currentStep - 1];
  };

  // Tela de sucesso após cadastro
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center mb-4">
                <UnifiedLogo size="lg" />
              </div>
              
              <div className="space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Cadastro Realizado!
                </h1>
                <p className="text-slate-600">
                  Verifique seu email para ativar sua conta
                </p>
              </div>

              <Alert className="border-blue-200 bg-blue-50 text-left">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Email enviado para:</strong><br />
                  {userEmail}
                  <br /><br />
                  Clique no link de verificação para ativar sua conta.
                  <br /><br />
                  <strong>⚠️ Verifique também a pasta de spam!</strong>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleResendVerification}
                  disabled={loading}
                  variant="outline" 
                  className="w-full"
                >
                  {loading ? "Reenviando..." : "Reenviar Email"}
                </Button>
                
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Ir para Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stepConfig = getStepConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <UnifiedLogo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Criar Conta
          </h1>
          <p className="text-slate-600">
            Junte-se à MadenAI e transforme seus projetos
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ease-out ${
                step <= currentStep 
                  ? 'bg-primary text-white border-primary shadow-lg scale-110' 
                  : 'bg-white text-slate-400 border-slate-300'
              }`}>
                {step < currentStep ? (
                  <Check className="w-5 h-5 animate-scale-in" />
                ) : (
                  <span className="font-medium">{step}</span>
                )}
                {step <= currentStep && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 mx-2 transition-all duration-500 ease-out ${
                  step < currentStep ? 'bg-primary' : 'bg-slate-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-8">
            {/* Step Header */}
            <div className="flex items-center space-x-3 mb-6 animate-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stepConfig.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {stepConfig.title}
                </h2>
                <p className="text-sm text-slate-600">
                  {stepConfig.subtitle}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-5">
              {currentStep === 1 && (
                <div className="space-y-4 animate-slide-in-right">
                  <div>
                    <Label htmlFor="fullName" className="text-slate-700 font-medium">
                      Nome Completo *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Seu nome completo"
                      className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      required
                    />
                  </div>

                  {/* Dados profissionais opcionais no step 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label htmlFor="company" className="text-slate-700 font-medium">
                        Empresa
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Empresa (opcional)"
                        className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cargo" className="text-slate-700 font-medium">
                        Cargo
                      </Label>
                      <Input
                        id="cargo"
                        type="text"
                        value={formData.cargo}
                        onChange={(e) => handleInputChange('cargo', e.target.value)}
                        placeholder="Cargo (opcional)"
                        className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-slide-in-right">
                  <div>
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Senha *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      required
                    />
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                      Confirmar Senha *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      required
                    />
                  </div>

                  {/* Dados extras mais organizados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label htmlFor="gender" className="text-slate-700 font-medium">
                        Gênero
                      </Label>
                      <GenderSelect
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="refCode" className="text-slate-700 font-medium">
                        Código de Indicação
                      </Label>
                      <Input
                        id="refCode"
                        type="text"
                        value={formData.refCode}
                        onChange={(e) => handleInputChange('refCode', e.target.value)}
                        placeholder="REF_XXX (opcional)"
                        className="mt-1 bg-white/60 border-slate-200 focus:border-primary focus:ring-primary transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-slide-in-right">
                  {/* Review Section */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                      Revise seus dados
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Nome:</span>
                        <span className="text-slate-600">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Email:</span>
                        <span className="text-slate-600">{formData.email}</span>
                      </div>
                      {formData.company && (
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-700">Empresa:</span>
                          <span className="text-slate-600">{formData.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms and Privacy */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-slate-700 leading-5">
                        Concordo com os{' '}
                        <Link to="/termos" className="text-primary hover:underline font-medium">
                          Termos de Uso
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy"
                        checked={acceptedPrivacy}
                        onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                        className="mt-1"
                      />
                      <Label htmlFor="privacy" className="text-sm text-slate-700 leading-5">
                        Concordo com a{' '}
                        <Link to="/privacidade" className="text-primary hover:underline font-medium">
                          Política de Privacidade
                        </Link>
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center space-x-2 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </Button>
                )}
                
                <Link 
                  to="/login" 
                  className="text-primary hover:underline text-sm font-medium flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Já tem conta?</span>
                </Link>
              </div>

              <div>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 min-w-[120px] transition-all duration-200 hover:scale-105"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center space-x-2 min-w-[140px] transition-all duration-200 hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Criando...</span>
                      </>
                    ) : (
                      <>
                        <span>Criar Conta</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSignupWizard;