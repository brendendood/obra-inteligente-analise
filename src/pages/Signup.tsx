import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { validateEmail, validatePassword, formatAuthError } from '@/utils/authValidation';
import { SignUpPage, type Testimonial } from '@/components/ui/sign-up';

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
  const { signInWithGoogle } = useSocialAuth();

  // Check for referral code on component mount and validate it
  useEffect(() => {
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

  const validateStep1 = () => {
    if (!formData.name.trim()) {
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

    return true;
  };

  const validateStep2 = () => {
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

  const handleStepSubmit = (step: number, data: Record<string, any>) => {
    // Update form data with the data from the component
    setFormData(prev => ({ ...prev, ...data }));
    
    if (step === 1) {
      const updatedData = { ...formData, ...data };
      if (!updatedData.name.trim() || !validateEmail(updatedData.email)) {
        return;
      }
    }
    
    if (step === 2) {
      const updatedData = { ...formData, ...data };
      const passwordValidation = validatePassword(updatedData.password);
      if (!passwordValidation.isValid || updatedData.password !== updatedData.confirmPassword) {
        return;
      }
    }
    
    if (step === 3) {
      handleSubmit();
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

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);

    try {
      const userData: any = {
        full_name: formData.name,
        company: formData.company,
        cargo: formData.position,
        avatar_type: 'initials',
        gender: 'male'
      };

      // Add referral code if present
      if (referralCode) {
        userData.ref_code = referralCode;
      }

      // Signup com confirmação de email
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userData,
          emailRedirectTo: 'https://madeai.com.br/v'
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.message?.includes('already registered')) {
          toast({
            title: "❌ Email já cadastrado",
            description: "Este email já possui uma conta. Faça login ou use outro email.",
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
        description: "Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta.",
        duration: 6000
      });

      // Redirecionar para login após delay para dar tempo de ler
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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