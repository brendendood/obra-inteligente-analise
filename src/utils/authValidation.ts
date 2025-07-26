export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
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

  // Require special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
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
    return 'Verifique sua caixa de entrada e confirme seu email.';
  }
  
  if (error.message.includes('User already registered')) {
    return 'Este email já está em uso. Tente fazer login.';
  }
  
  if (error.message.includes('Signup requires a valid password')) {
    return 'Senha inválida. Verifique os requisitos.';
  }
  
  if (error.message.includes('Unable to validate email address')) {
    return 'Email inválido. Verifique o formato.';
  }
  
  if (error.message.includes('Password should be at least 6 characters')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  
  return error.message || 'Erro inesperado. Tente novamente.';
};