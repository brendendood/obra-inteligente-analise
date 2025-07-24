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

  if (password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  } else {
    strength += 1;
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra');
  } else {
    strength += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  } else {
    strength += 1;
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
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