import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

interface ResendStatusProps {
  status: 'success' | 'error' | 'pending' | 'loading';
  title: string;
  description: string;
  details?: string;
}

export function ResendStatus({ status, title, description, details }: ResendStatusProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500" />;
      case 'loading':
        return <Mail className="h-12 w-12 text-blue-500 animate-pulse" />;
      default:
        return <Mail className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'pending':
        return 'text-yellow-700';
      case 'loading':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Erro</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>;
      case 'loading':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">🔄 Processando</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex flex-col items-center space-y-2">
          {getIcon()}
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <CardTitle className={getStatusColor()}>{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
        {details && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{details}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}