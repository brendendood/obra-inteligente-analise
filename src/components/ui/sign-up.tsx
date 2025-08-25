"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// --- TYPE DEFINITIONS ---
export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export interface SignUpPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSubmitStep?: (step: number, data: Record<string, any>) => void;
  onGoogleSignUp?: () => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  formData?: Record<string, any>;
  onFormDataChange?: (data: Record<string, any>) => void;
  showPassword?: boolean;
  onShowPasswordChange?: (show: boolean) => void;
  loading?: boolean;
  onBack?: () => void;
}

// --- SUB-COMPONENTS ---
const GlassInputWrapper = ({ children, error }: { children: React.ReactNode; error?: boolean }) => (
  <div className={`rounded-2xl border backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10 ${error ? 'border-red-400 bg-red-500/10' : 'border-border bg-foreground/5'}`}>
    {children}
  </div>
);

const ValidationMessage = ({ type, message }: { type: 'error' | 'success' | 'info'; message: string }) => {
  const icons = {
    error: <XCircle className="w-4 h-4 text-red-500" />,
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    info: <AlertCircle className="w-4 h-4 text-blue-500" />
  };

  const colors = {
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    info: 'text-blue-600 dark:text-blue-400'
  };

  return (
    <div className={`flex items-center gap-2 text-xs mt-1 ${colors[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div
    className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}
  >
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const requirements = [
    { test: (p: string) => p.length >= 8, text: "Pelo menos 8 caracteres" },
    { test: (p: string) => /[A-Z]/.test(p), text: "1 letra maiúscula" },
    { test: (p: string) => /[a-z]/.test(p), text: "1 letra minúscula" },
    { test: (p: string) => /[0-9]/.test(p), text: "1 número" },
    { test: (p: string) => /[^A-Za-z0-9]/.test(p), text: "1 caractere especial" },
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => {
        const isValid = req.test(password);
        return (
          <div key={index} className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
            {isValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            <span>{req.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// --- MAIN SIGN UP COMPONENT ---
export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Crie sua conta MadeAI</span>,
  description = "Comece agora sua jornada com a MadeAI em apenas 3 passos.",
  heroImageSrc,
  testimonials = [],
  onSubmitStep,
  onGoogleSignUp,
  currentStep = 1,
  onStepChange,
  formData = {},
  onFormDataChange,
  showPassword = false,
  onShowPasswordChange,
  loading = false,
  onBack
}) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Step progress indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            step <= currentStep 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-8 h-0.5 transition-colors ${
              step < currentStep ? 'bg-primary' : 'bg-muted'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // Email validation
  const checkEmailExists = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return;
    
    setEmailChecking(true);
    try {
      const response = await fetch(`${window.location.origin}/functions/v1/check-email-exists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail })
      });
      
      const result = await response.json();
      setEmailExists(result.exists);
      
      if (result.exists) {
        setValidationErrors(prev => ({ 
          ...prev, 
          email: "Este e-mail já está em uso. Tente acessar com sua conta existente ou recupere sua senha." 
        }));
      } else {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  // Password validation
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("A senha deve ter pelo menos 8 caracteres.");
    if (!/[A-Z]/.test(password)) errors.push("A senha deve ter pelo menos 1 letra maiúscula.");
    if (!/[a-z]/.test(password)) errors.push("A senha deve ter pelo menos 1 letra minúscula.");
    if (!/[0-9]/.test(password)) errors.push("A senha deve ter pelo menos 1 número.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("A senha deve ter pelo menos 1 caractere especial.");
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    const updatedData = { ...localFormData, [name]: newValue };
    setLocalFormData(updatedData);
    onFormDataChange?.(updatedData);

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      checkEmailExists(email);
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!localFormData.email) {
        errors.email = "E-mail é obrigatório.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
        errors.email = "Informe um e-mail válido.";
      } else if (emailExists) {
        errors.email = "Este e-mail já está em uso. Tente acessar com sua conta existente ou recupere sua senha.";
      }

      if (!localFormData.password) {
        errors.password = "Senha é obrigatória.";
      } else {
        const passwordErrors = validatePassword(localFormData.password);
        if (passwordErrors.length > 0) {
          errors.password = passwordErrors[0];
        }
      }

      if (!localFormData.confirmPassword) {
        errors.confirmPassword = "Confirmação de senha é obrigatória.";
      } else if (localFormData.password && localFormData.password !== localFormData.confirmPassword) {
        errors.confirmPassword = "As senhas não conferem.";
      }
    }

    if (currentStep === 2) {
      if (!localFormData.name || localFormData.name.trim().length < 2) {
        errors.name = "Nome deve ter pelo menos 2 caracteres.";
      }
    }

    if (currentStep === 3) {
      if (!localFormData.acceptTerms) {
        errors.acceptTerms = "Você deve aceitar os Termos de Uso e Política de Privacidade.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    if (emailChecking) {
      return;
    }

    onSubmitStep?.(currentStep, localFormData);
  };

  const handleBack = () => {
    onBack?.();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Dados de Acesso";
      case 2: return "Informações Pessoais";
      case 3: return "Revisão e Confirmação";
      default: return "";
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row font-geist w-full bg-background">
      {/* Left column: multi-step form */}
      <section className="flex-1 flex items-center justify-center p-4 px-6 md:p-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-3xl md:text-5xl font-bold leading-tight text-balance text-center lg:text-left">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground text-sm md:text-base mb-4 md:mb-6 text-center lg:text-left">{description}</p>

            <StepIndicator />
            
            <div className="text-center">
              <h2 className="text-xl font-medium text-foreground">{getStepTitle()}</h2>
            </div>

            <form className="space-y-5" onSubmit={handleNext}>
              {currentStep === 1 && (
                <>
                  <div className="animate-element animate-delay-300">
                    <label className="text-sm font-medium text-muted-foreground">E-mail *</label>
                    <GlassInputWrapper error={!!validationErrors.email}>
                      <input
                        name="email"
                        type="email"
                        value={localFormData.email || ''}
                        onChange={handleChange}
                        onBlur={handleEmailBlur}
                        placeholder="seu@email.com"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                    {emailChecking && <ValidationMessage type="info" message="Verificando e-mail..." />}
                    {validationErrors.email && <ValidationMessage type="error" message={validationErrors.email} />}
                  </div>

                  <div className="animate-element animate-delay-400">
                    <label className="text-sm font-medium text-muted-foreground">Senha *</label>
                    <GlassInputWrapper error={!!validationErrors.password}>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={localFormData.password || ''}
                          onChange={handleChange}
                          placeholder="Crie sua senha"
                          className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => onShowPasswordChange?.(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                          )}
                        </button>
                      </div>
                    </GlassInputWrapper>
                    {localFormData.password && (
                      <PasswordStrengthIndicator password={localFormData.password} />
                    )}
                    {validationErrors.password && <ValidationMessage type="error" message={validationErrors.password} />}
                  </div>

                  <div className="animate-element animate-delay-500">
                    <label className="text-sm font-medium text-muted-foreground">Confirmar Senha *</label>
                    <GlassInputWrapper error={!!validationErrors.confirmPassword}>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={localFormData.confirmPassword || ''}
                        onChange={handleChange}
                        placeholder="Repita sua senha"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                    {validationErrors.confirmPassword && <ValidationMessage type="error" message={validationErrors.confirmPassword} />}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="animate-element animate-delay-300">
                    <label className="text-sm font-medium text-muted-foreground">Nome Completo *</label>
                    <GlassInputWrapper error={!!validationErrors.name}>
                      <input
                        name="name"
                        type="text"
                        value={localFormData.name || ''}
                        onChange={handleChange}
                        placeholder="Digite seu nome completo"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                    {validationErrors.name && <ValidationMessage type="error" message={validationErrors.name} />}
                  </div>

                  <div className="animate-element animate-delay-400">
                    <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                    <GlassInputWrapper>
                      <input
                        name="company"
                        type="text"
                        value={localFormData.company || ''}
                        onChange={handleChange}
                        placeholder="Nome da sua empresa (opcional)"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div className="animate-element animate-delay-500">
                    <label className="text-sm font-medium text-muted-foreground">Cargo</label>
                    <GlassInputWrapper>
                      <input
                        name="position"
                        type="text"
                        value={localFormData.position || ''}
                        onChange={handleChange}
                        placeholder="Seu cargo/função (opcional)"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="animate-element animate-delay-300">
                    <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
                      <h3 className="font-medium text-foreground mb-4">Revise seus dados:</h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">E-mail:</span>
                          <span className="font-medium">{localFormData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nome:</span>
                          <span className="font-medium">{localFormData.name}</span>
                        </div>
                        {localFormData.company && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Empresa:</span>
                            <span className="font-medium">{localFormData.company}</span>
                          </div>
                        )}
                        {localFormData.position && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cargo:</span>
                            <span className="font-medium">{localFormData.position}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="animate-element animate-delay-400">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={localFormData.acceptTerms || false}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-primary bg-transparent border-2 border-border rounded focus:ring-primary focus:ring-2 cursor-pointer"
                        required
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-muted-foreground cursor-pointer">
                        Li e aceito os{' '}
                        <Link 
                          to="/terms" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Termos de Uso
                        </Link>
                        {' '}e a{' '}
                        <Link 
                          to="/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Política de Privacidade
                        </Link>
                        .
                      </label>
                    </div>
                    {validationErrors.acceptTerms && <ValidationMessage type="error" message={validationErrors.acceptTerms} />}
                  </div>
                </>
              )}

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="animate-element animate-delay-600 flex-1 rounded-2xl border border-border py-3 md:py-4 text-base font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || emailChecking || Object.keys(validationErrors).length > 0}
                  className="animate-element animate-delay-600 flex-1 rounded-2xl bg-primary py-3 md:py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : (
                    currentStep < 3 ? "Próximo" : "Finalizar Cadastro"
                  )}
                </button>
              </div>
            </form>

            {currentStep === 1 && (
              <>
                <div className="animate-element animate-delay-700 relative flex items-center justify-center">
                  <span className="w-full border-t border-border"></span>
                  <span className="px-4 text-sm text-muted-foreground bg-background absolute">Ou continue com</span>
                </div>
                <button
                  onClick={onGoogleSignUp}
                  className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-3 md:py-4 text-base font-medium hover:bg-secondary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
                  </svg>
                  Continuar com Google
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden lg:block flex-1 relative p-4">
          <div className="relative h-full flex flex-col items-center justify-center">
            <div
              className="animate-slide-right animate-delay-300 absolute inset-0 rounded-3xl bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImageSrc})` }}
            ></div>
            {testimonials.length > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 px-4 w-full justify-center max-w-4xl">
                <div className="w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
                  <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
                </div>
                {testimonials[1] && (
                  <div className="hidden xl:flex w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
                    <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
                  </div>
                )}
                {testimonials[2] && (
                  <div className="hidden 2xl:flex w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
                    <TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};