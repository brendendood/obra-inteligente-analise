"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignUpPageProps {
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
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/70 focus-within:bg-primary/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div
    className={`animate-fade-in ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}
  >
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

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
  onBack,
}) => {
  const [internalStep, setInternalStep] = useState(currentStep);
  const [internalShowPassword, setInternalShowPassword] = useState(showPassword);
  const [internalFormData, setInternalFormData] = useState<Record<string, any>>(formData);

  const step = currentStep || internalStep;
  const currentShowPassword = onShowPasswordChange ? showPassword : internalShowPassword;
  const currentFormData = onFormDataChange ? formData : internalFormData;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitStep?.(step, currentFormData);
    if (step < 3) {
      const nextStep = step + 1;
      if (onStepChange) {
        onStepChange(nextStep);
      } else {
        setInternalStep(nextStep);
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (step > 1) {
      const prevStep = step - 1;
      if (onStepChange) {
        onStepChange(prevStep);
      } else {
        setInternalStep(prevStep);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...currentFormData, [e.target.name]: e.target.value };
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    } else {
      setInternalFormData(newFormData);
    }
  };

  const togglePasswordVisibility = () => {
    if (onShowPasswordChange) {
      onShowPasswordChange(!currentShowPassword);
    } else {
      setInternalShowPassword(!currentShowPassword);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Left column: multi-step form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                {title}
              </h1>
              <p className="mt-2 text-muted-foreground">{description}</p>
              
              {/* Progress indicator */}
              <div className="mt-6 flex items-center space-x-2">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        stepNumber === step
                          ? 'bg-primary text-primary-foreground'
                          : stepNumber < step
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`w-8 h-0.5 mx-1 transition-colors ${
                          stepNumber < step ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form className="space-y-5 animate-fade-in" onSubmit={handleNext}>
              {step === 1 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                    <GlassInputWrapper>
                      <input
                        name="name"
                        type="text"
                        value={currentFormData.name || ''}
                        onChange={handleChange}
                        placeholder="Digite seu nome completo"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                    <GlassInputWrapper>
                      <input
                        name="email"
                        type="email"
                        value={currentFormData.email || ''}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Senha</label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <input
                          name="password"
                          type={currentShowPassword ? "text" : "password"}
                          value={currentFormData.password || ''}
                          onChange={handleChange}
                          placeholder="Crie sua senha"
                          className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          {currentShowPassword ? (
                            <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                          )}
                        </button>
                      </div>
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Confirmar Senha</label>
                    <GlassInputWrapper>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={currentFormData.confirmPassword || ''}
                        onChange={handleChange}
                        placeholder="Repita sua senha"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                    <GlassInputWrapper>
                      <input
                        name="company"
                        type="text"
                        value={currentFormData.company || ''}
                        onChange={handleChange}
                        placeholder="Nome da sua empresa"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cargo</label>
                    <GlassInputWrapper>
                      <input
                        name="position"
                        type="text"
                        value={currentFormData.position || ''}
                        onChange={handleChange}
                        placeholder="Seu cargo/função"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      id="acceptTerms"
                      checked={currentFormData.acceptTerms || false}
                      onChange={(e) => {
                        const newFormData = { ...currentFormData, acceptTerms: e.target.checked };
                        if (onFormDataChange) {
                          onFormDataChange(newFormData);
                        } else {
                          setInternalFormData(newFormData);
                        }
                      }}
                      className="rounded border-border"
                      required
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                      Aceito os{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Termos de Uso
                      </a>{' '}
                      e{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
                    </label>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 rounded-2xl border border-border py-4 font-medium text-foreground hover:bg-secondary transition-colors"
                    disabled={loading}
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : step < 3 ? "Próximo" : "Concluir Cadastro"}
                </button>
              </div>
            </form>

            {step === 1 && (
              <>
                <div className="animate-fade-in relative flex items-center justify-center">
                  <span className="w-full border-t border-border"></span>
                  <span className="px-4 text-sm text-muted-foreground bg-background absolute">Ou continue com</span>
                </div>
                <button
                  onClick={onGoogleSignUp}
                  className="animate-fade-in w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
                  disabled={loading}
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

            <div className="text-center text-sm text-muted-foreground animate-fade-in">
              Já tem uma conta?{' '}
              <a href="/login" className="text-primary hover:underline">
                Fazer login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="animate-slide-in-right absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          ></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="" />
              {testimonials[1] && (
                <div className="hidden xl:flex">
                  <TestimonialCard testimonial={testimonials[1]} delay="" />
                </div>
              )}
              {testimonials[2] && (
                <div className="hidden 2xl:flex">
                  <TestimonialCard testimonial={testimonials[2]} delay="" />
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export type { Testimonial };