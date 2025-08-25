export type TelemetryEvent =
  | 'email_verification_start'
  | 'email_verification_success'
  | 'email_verification_timeout'
  | 'email_verification_error'
  | 'email_verification_invalid_token'
  | 'email_verification_resend_requested'
  | 'email_verification_resend_success'
  | 'email_verification_resend_error';

export type AuthEvent = 
  | 'auth_check_start'
  | 'auth_check_success'
  | 'auth_check_timeout'
  | 'auth_check_error';

export type AllTelemetryEvents = TelemetryEvent | AuthEvent;

interface TelemetryData {
  event: AllTelemetryEvents;
  timestamp: string;
  route?: string;
  context: string;
  details?: Record<string, unknown>;
}

export function logConfirmationEvent(
  event: TelemetryEvent,
  data?: Record<string, unknown>
): void {
  try {
    const telemetryData: TelemetryData = {
      event,
      timestamp: new Date().toISOString(),
      route: '/cadastro/confirmado',
      context: 'email_verification',
      details: data
    };

    // Estruturado para consistência com login
    console.log(`📊 EMAIL_VERIFICATION_EVENT: ${event}`, telemetryData.details || {});
    
    // Para análise estruturada (JSON)
    console.log('TELEMETRY:', JSON.stringify(telemetryData));
  } catch (error) {
    // Best-effort: nunca quebrar por causa de telemetria
    console.warn('Telemetry logging failed:', error);
  }
}

export function logAuthEvent(
  event: AuthEvent,
  data?: Record<string, unknown>
): void {
  try {
    const telemetryData: TelemetryData = {
      event,
      timestamp: new Date().toISOString(),
      context: 'auth',
      details: data
    };

    console.log(`📊 AUTH_EVENT: ${event}`, telemetryData.details || {});
    console.log('TELEMETRY:', JSON.stringify(telemetryData));
  } catch (error) {
    console.warn('Telemetry logging failed:', error);
  }
}