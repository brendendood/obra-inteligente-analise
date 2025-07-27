import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator = ({ password, className = '' }: PasswordStrengthIndicatorProps) => {
  const checks = [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Contém letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Contém letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Contém número', valid: /\d/.test(password) },
    { label: 'Contém caractere especial', valid: /[!@#$%^&*(),.?":{}|<>\-_.]/.test(password) },
  ];

  const strength = checks.filter(check => check.valid).length;
  const strengthColors = ['bg-destructive', 'bg-destructive', 'bg-yellow-500', 'bg-orange-500', 'bg-green-500'];
  const strengthLabels = ['Muito fraca', 'Fraca', 'Boa', 'Forte', 'Muito forte'];

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Força da senha:</span>
        <span className="text-xs font-medium">{strengthLabels[strength]}</span>
      </div>
      
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded ${
              index < strength ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2">
            {check.valid ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={`text-xs ${check.valid ? 'text-green-500' : 'text-muted-foreground'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};