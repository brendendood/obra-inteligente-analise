import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  errors: string[];
  strength: number;
}

export const PasswordStrengthMeter = ({ password, errors, strength }: PasswordStrengthMeterProps) => {
  if (!password) return null;

  const strengthColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500', 
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
    5: 'bg-green-500'
  };

  const strengthLabels = {
    1: 'Muito Fraca',
    2: 'Fraca',
    3: 'Regular',
    4: 'Forte',
    5: 'Muito Forte'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Força da senha:</span>
        <span className="text-sm font-medium">{strengthLabels[strength as keyof typeof strengthLabels]}</span>
      </div>
      
      <Progress 
        value={(strength / 5) * 100} 
        className="h-2"
      />
      
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center text-xs text-red-600">
              <XCircle className="h-3 w-3 mr-1" />
              {error}
            </div>
          ))}
        </div>
      )}
      
      {errors.length === 0 && strength >= 4 && (
        <div className="flex items-center text-xs text-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Senha forte
        </div>
      )}
    </div>
  );
};