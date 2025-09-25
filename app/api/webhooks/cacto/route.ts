import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📧 Webhook Cacto recebido:', body);

    const { type: eventType, data } = body;
    const customerEmail = data?.email;
    const planName = data?.plan;

    if (!customerEmail) {
      console.error('❌ Email do cliente não fornecido');
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Buscar usuário pelo email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, plan_code')
      .eq('email', customerEmail)
      .maybeSingle();

    if (userError || !userData) {
      console.error('❌ Usuário não encontrado:', customerEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let newPlanCode = 'free';

    // Mapear eventos para plan_code
    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
        switch (planName?.toLowerCase()) {
          case 'basic':
            newPlanCode = 'basic';
            break;
          case 'pro':
            newPlanCode = 'pro';
            break;
          case 'enterprise':
            newPlanCode = 'enterprise';
            break;
          default:
            newPlanCode = 'free';
        }
        break;

      case 'subscription_canceled':
      case 'subscription_expired':
      case 'payment_failed':
        newPlanCode = 'free';
        break;

      default:
        console.log('📝 Evento não reconhecido:', eventType);
        return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    // Atualizar plan_code do usuário
    const { error: updateError } = await supabase
      .from('users')
      .update({ plan_code: newPlanCode })
      .eq('id', userData.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar plano:', updateError);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    console.log(`✅ Plano atualizado: ${customerEmail} → ${newPlanCode}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Plan updated to ${newPlanCode}`,
      user_id: userData.id 
    });

  } catch (error) {
    console.error('❌ Erro no webhook Cacto:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook Cacto ativo',
    endpoint: '/api/webhooks/cacto',
    methods: ['POST']
  });
}