import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator = ({ password, className = '' }: PasswordStrengthIndicatorProps) => {
  const checks = [
    { label: 'Mínimo 6 caracteres', valid: password.length >= 6 },
    { label: 'Contém letra', valid: /[a-zA-Z]/.test(password) },
    { label: 'Contém número', valid: /\d/.test(password) },
  ];

  const strength = checks.filter(check => check.valid).length;
  const strengthColors = ['bg-destructive', 'bg-yellow-500', 'bg-orange-500', 'bg-green-500'];
  const strengthLabels = ['Muito fraca', 'Fraca', 'Boa', 'Forte'];

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Força da senha:</span>
        <span className="text-xs font-medium">{strengthLabels[strength]}</span>
      </div>
      
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((index) => (
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