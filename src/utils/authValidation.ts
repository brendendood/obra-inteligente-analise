import { supabase } from '@/integrations/supabase/client';

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    console.log('❌ Email validation failed: empty or invalid type', { email });
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();
  console.log('🔍 Validating email:', { original: email, trimmed: trimmedEmail });

  // More robust email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(trimmedEmail) && trimmedEmail.length <= 254;
  
  console.log('✅ Email validation result:', { email: trimmedEmail, isValid });
  return isValid;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: number;
} => {
  const errors: string[] = [];
  let strength = 0;

  // Minimum 8 characters (strengthened from 6)
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  } else {
    strength += 1;
  }

  // Require uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  } else {
    strength += 1;
  }

  // Require lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  } else {
    strength += 1;
  }

  // Require number
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  } else {
    strength += 1;
  }

  // Require special character (incluindo hífen e ponto)
  if (!/[!@#$%^&*(),.?":{}|<>\-_.]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>-_.)');
  } else {
    strength += 1;
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Senha não pode ter caracteres repetidos consecutivos');
  }

  // Check minimum strength for validity
  const isValid = errors.length === 0 && strength >= 4;

  return {
    isValid,
    errors,
    strength: Math.min(strength, 5)
  };
};


export const formatAuthError = (error: any): string => {
  if (error.message.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos.';
  }
  
  if (error.message.includes('Email not confirmed')) {
    return 'Verifique sua caixa de entrada e confirme seu email antes de acessar.';
  }
  
  if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
    return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
  }
  
  if (error.message.includes('Signup requires a valid password')) {
    return 'Senha inválida. Deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.';
  }
  
  if (error.message.includes('Unable to validate email address')) {
    return 'Email inválido. Verifique o formato (exemplo@dominio.com).';
  }
  
  if (error.message.includes('Password should be at least')) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }

  if (error.message.includes('Email rate limit exceeded')) {
    return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
  }
  
  return error.message || 'Erro inesperado. Tente novamente.';
};