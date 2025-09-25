// /lib/time.ts
// Utilitários de período mensal com fuso da aplicação.
// Não altere o TZ sem revisar billing/reset mensal.

export const APP_BILLING_TZ = 'Europe/Madrid';

/**
 * Retorna a chave de período "YYYY-MM" no fuso configurado.
 * Use sempre para cálculos de bônus mensais.
 */
export function currentPeriodKey(date = new Date()): string {
  // Garante cálculo no fuso definido (sem libs externas):
  // Estratégia: usa UTC e corrige por offset aproximado do tz alvo via Intl.
  // Obs.: Para precisão total com horário de verão, preferível usar a lib temporal,
  // mas mantemos simples para o Lovable.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_BILLING_TZ,
    year: 'numeric', month: '2-digit'
  });
  const parts = fmt.formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value ?? '1970';
  const m = parts.find(p => p.type === 'month')?.value ?? '01';
  return `${y}-${m}`;
}