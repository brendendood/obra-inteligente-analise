import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { SignUpPage, type Testimonial } from '@/components/ui/sign-up';
import { passo1Schema, passo2Schema, passo3Schema } from '@/schemas/cadastro';

type SignupStep = 1 | 2 | 3;

interface FormData {
  name: string;
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
  
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralInfo, setReferralInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: '',
    acceptTerms: false
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { signInWithGoogle } = useSocialAuth();

  // Check for success/error params
  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      const errorMessages = {
        'token-ausente': 'Link de verificação inválido.',
        'token-invalido': 'Link de verificação expirado ou inválido.',
        'erro-interno': 'Ocorreu um erro interno. Tente novamente.'
      };
      
      toast({
        title: "❌ Erro na verificação",
        description: errorMessages[error as keyof typeof errorMessages] || 'Erro desconhecido.',
        variant: "destructive",
        duration: 8000
      });
    }

    if (success === 'verificado') {
      toast({
        title: "✅ Email verificado!",
        description: "Sua conta foi ativada com sucesso. Você pode fazer login agora.",
        duration: 8000
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }

    // Check for referral code
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
      validateReferralCode(refParam);
    }
  }, [searchParams]);

  const validateReferralCode = async (code: string) => {
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
    }
  };

  const validateStep = (step: number, data: FormData) => {
    try {
      if (step === 1) {
        passo1Schema.parse(data);
        return true;
      }
      if (step === 2) {
        passo2Schema.parse(data);
        return true;
      }
      if (step === 3) {
        passo3Schema.parse(data);
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Dados inválidos';
      toast({
        title: "❌ Erro de validação",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  const handleStepSubmit = async (step: number, data: Record<string, any>) => {
    const updatedData = { ...formData, ...data } as FormData;
    setFormData(updatedData);

    // Validate current step
    if (!validateStep(step, updatedData)) {
      return;
    }

    if (step === 3) {
      await handleSubmit(updatedData);
      return;
    }
    
    if (step < 3) {
      setCurrentStep((prev) => (prev + 1) as SignupStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SignupStep);
    }
  };

  const handleSubmit = async (finalData: FormData = formData) => {
    setLoading(true);

    try {
      const userData: any = {
        full_name: finalData.name,
        company: finalData.company,
        cargo: finalData.position,
        avatar_type: 'initials',
        gender: 'male'
      };

      // Add referral code if present
      if (referralCode) {
        userData.ref_code = referralCode;
      }

      // Enhanced signup with integrated email verification
      const { error } = await signUp(finalData.email, finalData.password, userData);

      if (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
          toast({
            title: "❌ E-mail já em uso",
            description: "Este e-mail já está em uso. Tente acessar com sua conta existente ou recupere sua senha.",
            variant: "destructive"
          });
        } else if (error.message?.includes('Password should be')) {
          toast({
            title: "❌ Senha muito fraca",
            description: "A senha deve ter pelo menos 8 caracteres.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Erro no cadastro",
            description: error.message || "Não foi possível criar sua conta. Tente novamente.",
            variant: "destructive"
          });
        }
        return;
      }

      // Cadastro realizado com sucesso - aguardando confirmação
      toast({
        title: "📧 Confirme seu email",
        description: "Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta e receber o email de boas-vindas automaticamente!",
        duration: 8000
      });

      // Show success message and redirect to onboarding
      setTimeout(() => {
        toast({
          title: "✨ Cadastro concluído!",
          description: "Agora responda algumas perguntas para conhecermos você melhor.",
          duration: 6000
        });
        navigate('/onboarding');
      }, 4000);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "❌ Erro no cadastro",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testimonials: Testimonial[] = [
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
      name: "Ana Souza",
      handle: "@ana.dev",
      text: "O cadastro foi super rápido e fácil, já comecei a usar a plataforma na mesma hora."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
      name: "Carlos Lima",
      handle: "@carlos.tech",
      text: "Adorei a experiência de cadastro em passos. Simples e intuitivo!"
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Bruno Ferreira",
      handle: "@bruno.design",
      text: "Nunca vi um signup tão bonito e funcional como o da MadeAI."
    },
  ];

  return (
    <div className="bg-background text-foreground relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        aria-label="Voltar à página anterior"
      >
        <ArrowLeft size={16} />
        Voltar
      </Button>
      <SignUpPage
        title={<span className="font-light tracking-tighter">Crie sua conta MadeAI</span>}
        description="Comece agora sua jornada com a MadeAI em apenas 3 passos."
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={testimonials}
        onSubmitStep={handleStepSubmit}
        onGoogleSignUp={signInWithGoogle}
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step as SignupStep)}
        formData={formData}
        onFormDataChange={setFormData}
        showPassword={showPassword}
        onShowPasswordChange={setShowPassword}
        loading={loading}
        onBack={handleBack}
      />
    </div>
  );
}

export default Signup;