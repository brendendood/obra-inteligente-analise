/**
 * 📊 Logger Adapter para Observabilidade
 * 
 * Adapter compatível com as interfaces de logging já existentes no sistema.
 * Não altera comportamentos existentes - apenas fornece estrutura para observabilidade.
 * 
 * Compatível com:
 * - console.log/error/warn (usado amplamente no sistema)
 * - toast notifications (useToast + sonner)
 * - Supabase logging via pg_notify
 */

import { toast } from '@/components/ui/sonner';

// Tipos de log levels suportados
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

// Contexto adicional para logs
export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  correlationId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

// Interface do logger
export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  critical(message: string, error?: Error, context?: LogContext): void;
}

/**
 * Implementação do Logger Adapter
 * 
 * Mantém compatibilidade total com console.* existente
 * Adiciona capacidades de observabilidade quando necessário
 */
class LoggerAdapter implements Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private enableToasts = false; // Desabilitado por padrão
  private enableSupabaseLogging = false; // Desabilitado por padrão
  
  /**
   * Configurar o adapter (usado apenas quando observabilidade for ativada)
   */
  configure(options: {
    enableToasts?: boolean;
    enableSupabaseLogging?: boolean;
  }) {
    this.enableToasts = options.enableToasts ?? false;
    this.enableSupabaseLogging = options.enableSupabaseLogging ?? false;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = this.getLevelPrefix(level);
    
    if (!context) {
      return `${prefix} ${message}`;
    }

    const contextStr = Object.entries(context)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    return contextStr 
      ? `${prefix} [${contextStr}] ${message}`
      : `${prefix} ${message}`;
  }

  private getLevelPrefix(level: LogLevel): string {
    const prefixes = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      critical: '🔴'
    };
    return prefixes[level];
  }

  private shouldShowToast(level: LogLevel): boolean {
    return this.enableToasts && ['warn', 'error', 'critical'].includes(level);
  }

  private getToastVariant(level: LogLevel): 'default' | 'destructive' {
    return level === 'error' || level === 'critical' ? 'destructive' : 'default';
  }

  debug(message: string, context?: LogContext): void {
    if (!this.isProduction) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
    
    if (this.shouldShowToast('info')) {
      toast(message);
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
    
    if (this.shouldShowToast('warn')) {
      toast(message, { description: 'Verifique se está tudo correto' });
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorDetails = error ? ` - ${error.message}` : '';
    const fullMessage = `${message}${errorDetails}`;
    
    console.error(this.formatMessage('error', fullMessage, context));
    
    if (error) {
      console.error('Error details:', error);
    }
    
    if (this.shouldShowToast('error')) {
      toast.error(message, { 
        description: error?.message || 'Ocorreu um erro inesperado'
      });
    }

    // Opcional: Enviar para Supabase quando ativado
    if (this.enableSupabaseLogging) {
      this.logToSupabase('error', fullMessage, context, error);
    }
  }

  critical(message: string, error?: Error, context?: LogContext): void {
    const errorDetails = error ? ` - ${error.message}` : '';
    const fullMessage = `CRITICAL: ${message}${errorDetails}`;
    
    console.error(this.formatMessage('critical', fullMessage, context));
    
    if (error) {
      console.error('Critical error details:', error);
    }
    
    if (this.shouldShowToast('critical')) {
      toast.error(`Erro Crítico: ${message}`, { 
        description: error?.message || 'Sistema pode estar instável',
        duration: 10000 // Toast mais longo para erros críticos
      });
    }

    // Sempre enviar erros críticos para monitoramento
    if (this.enableSupabaseLogging) {
      this.logToSupabase('critical', fullMessage, context, error);
    }
  }

  private async logToSupabase(
    level: LogLevel, 
    message: string, 
    context?: LogContext,
    error?: Error
  ): Promise<void> {
    try {
      // Usar pg_notify para logging remoto (quando ativado)
      const logPayload = {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined,
        environment: process.env.NODE_ENV,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Este seria o payload para uma edge function de logging
      // Por enquanto apenas estrutura - não implementado
      console.debug('Would log to Supabase:', logPayload);
      
    } catch (err) {
      console.warn('Failed to log to Supabase:', err);
    }
  }
}

// Instância singleton do logger
export const logger = new LoggerAdapter();

/**
 * Factory function para criar loggers com contexto específico
 * 
 * Exemplo de uso:
 * const componentLogger = createLogger({ component: 'UserProfile', action: 'update' });
 * componentLogger.info('Profile updated successfully');
 */
export function createLogger(baseContext: LogContext): Logger {
  return {
    debug: (message: string, context?: LogContext) => 
      logger.debug(message, { ...baseContext, ...context }),
    info: (message: string, context?: LogContext) => 
      logger.info(message, { ...baseContext, ...context }),
    warn: (message: string, context?: LogContext) => 
      logger.warn(message, { ...baseContext, ...context }),
    error: (message: string, error?: Error, context?: LogContext) => 
      logger.error(message, error, { ...baseContext, ...context }),
    critical: (message: string, error?: Error, context?: LogContext) => 
      logger.critical(message, error, { ...baseContext, ...context }),
  };
}

/**
 * Wrapper functions compatíveis com uso atual
 * 
 * Permitem migração gradual do código existente:
 * console.log() -> logInfo()
 * console.error() -> logError()
 */
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context);
export const logCritical = (message: string, error?: Error, context?: LogContext) => logger.critical(message, error, context);

/**
 * Performance logging helper
 */
export function withPerformanceLogging<T>(
  operation: string,
  fn: () => T | Promise<T>,
  context?: LogContext
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(data => {
        const duration = performance.now() - start;
        logger.debug(`${operation} completed`, { 
          ...context, 
          duration: `${duration.toFixed(2)}ms` 
        });
        return data;
      });
    } else {
      const duration = performance.now() - start;
      logger.debug(`${operation} completed`, { 
        ...context, 
        duration: `${duration.toFixed(2)}ms` 
      });
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${operation} failed`, error as Error, { 
      ...context, 
      duration: `${duration.toFixed(2)}ms` 
    });
    throw error;
  }
}

/**
 * Request correlation helper
 * Gera e mantém correlation IDs para rastreamento de requests
 */
export function generateCorrelationId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getRequestContext(): LogContext {
  const correlationId = generateCorrelationId();
  
  return {
    requestId: correlationId,
    correlationId,
    sessionId: sessionStorage.getItem('session_id') || undefined,
    userId: localStorage.getItem('user_id') || undefined,
  };
}

// Export para compatibilidade
export default logger;