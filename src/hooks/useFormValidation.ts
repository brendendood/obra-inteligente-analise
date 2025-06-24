
import { useState } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface FormField {
  value: string;
  error: string;
  rules: ValidationRule;
}

interface FormFields {
  [key: string]: FormField;
}

export function useFormValidation(initialFields: Record<string, { value: string; rules: ValidationRule }>) {
  const [fields, setFields] = useState<FormFields>(() => {
    const initialState: FormFields = {};
    Object.keys(initialFields).forEach(key => {
      initialState[key] = {
        ...initialFields[key],
        error: ''
      };
    });
    return initialState;
  });

  const validateField = (name: string, value: string): string => {
    const rules = fields[name]?.rules;
    if (!rules) return '';

    // Required validation
    if (rules.required && !value.trim()) {
      return 'Este campo é obrigatório';
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rules.required) {
      return '';
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Mínimo de ${rules.minLength} caracteres`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Máximo de ${rules.maxLength} caracteres`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      if (name === 'email') {
        return 'E-mail inválido';
      }
      return 'Formato inválido';
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  };

  const setFieldValue = (name: string, value: string) => {
    const error = validateField(name, value);
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error
      }
    }));
  };

  const validateAll = (): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach(name => {
      const error = validateField(name, fields[name].value);
      newFields[name] = {
        ...newFields[name],
        error
      };
      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  };

  const resetForm = () => {
    const resetFields: FormFields = {};
    Object.keys(initialFields).forEach(key => {
      resetFields[key] = {
        ...initialFields[key],
        error: ''
      };
    });
    setFields(resetFields);
  };

  return {
    fields,
    setFieldValue,
    validateAll,
    resetForm,
    isValid: Object.values(fields).every(field => !field.error)
  };
}
