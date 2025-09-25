/**
 * UI Assertions - Helpers para validar comportamentos obrigatórios da interface
 * 
 * Estas funções verificam se a UI está respeitando os limites de plano
 * e comportamentos essenciais do sistema sem dados demonstrativos.
 */

import { supabase } from '@/integrations/supabase/client';

export interface UIAssertionResult {
  passed: boolean;
  message: string;
  details?: any;
}

/**
 * Verifica se usuário sem plano é redirecionado para pricing-blocked
 */
export const assertUserWithoutPlanRedirect = async (): Promise<UIAssertionResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { passed: false, message: 'Usuário não autenticado para teste' };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('plan_code')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return { passed: false, message: 'Dados do usuário não encontrados' };
    }

    const currentPath = window.location.pathname;
    
    // Se usuário sem plano não está em pricing-blocked, deve ser redirecionado
    if (!userData.plan_code && currentPath !== '/pricing-blocked') {
      return { 
        passed: false, 
        message: `Usuário sem plano em ${currentPath}, deveria estar em /pricing-blocked`,
        details: { plan_code: userData.plan_code, current_path: currentPath }
      };
    }

    return { 
      passed: true, 
      message: 'Redirecionamento de usuário sem plano funcionando corretamente' 
    };
  } catch (error: any) {
    return { passed: false, message: `Erro na verificação: ${error.message}` };
  }
};

/**
 * Verifica se pricing-blocked exibe nome e email do usuário
 */
export const assertPricingBlockedShowsUserInfo = async (): Promise<UIAssertionResult> => {
  try {
    if (window.location.pathname !== '/pricing-blocked') {
      return { passed: false, message: 'Teste deve ser executado na página /pricing-blocked' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { passed: false, message: 'Usuário não autenticado' };
    }

    // Verificar se nome/email aparecem na página
    const pageText = document.body.textContent || '';
    const hasEmail = user.email && pageText.includes(user.email);
    const hasName = user.user_metadata?.full_name && pageText.includes(user.user_metadata.full_name);

    if (!hasEmail && !hasName) {
      return { 
        passed: false, 
        message: 'Página pricing-blocked não exibe informações do usuário',
        details: { email: user.email, name: user.user_metadata?.full_name }
      };
    }

    return { passed: true, message: 'Informações do usuário exibidas corretamente' };
  } catch (error: any) {
    return { passed: false, message: `Erro na verificação: ${error.message}` };
  }
};

/**
 * Verifica se botões de assinar plano disparam checkout com user_id
 */
export const assertSubscriptionButtonsWithUserId = async (): Promise<UIAssertionResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { passed: false, message: 'Usuário não autenticado' };
    }

    const subscriptionButtons = document.querySelectorAll('[data-plan-id]');
    
    if (subscriptionButtons.length === 0) {
      return { 
        passed: false, 
        message: 'Nenhum botão de assinatura encontrado (data-plan-id)' 
      };
    }

    // Verificar se botões têm onclick que inclui user_id
    let validButtons = 0;
    subscriptionButtons.forEach((button) => {
      const onclick = button.getAttribute('onclick') || '';
      if (onclick.includes(user.id)) {
        validButtons++;
      }
    });

    if (validButtons === 0) {
      return { 
        passed: false, 
        message: 'Botões de assinatura não incluem user_id no checkout',
        details: { total_buttons: subscriptionButtons.length, valid_buttons: validButtons }
      };
    }

    return { 
      passed: true, 
      message: `${validButtons}/${subscriptionButtons.length} botões de assinatura configurados corretamente` 
    };
  } catch (error: any) {
    return { passed: false, message: `Erro na verificação: ${error.message}` };
  }
};

/**
 * Verifica se usuário vê apenas features do seu plano
 */
export const assertPlanFeatureVisibility = async (): Promise<UIAssertionResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { passed: false, message: 'Usuário não autenticado' };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('plan_code')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return { passed: false, message: 'Dados do usuário não encontrados' };
    }

    const planCode = userData.plan_code;
    
    // Verificar elementos de features por plano
    const enterpriseFeatures = document.querySelectorAll('[data-feature="enterprise"]');
    const proFeatures = document.querySelectorAll('[data-feature="pro"]');
    
    if (planCode === 'BASIC') {
      // Usuário Basic não deve ver features Pro/Enterprise
      const visibleEnterpriseFeatures = Array.from(enterpriseFeatures)
        .filter(el => !el.classList.contains('hidden') && !el.hasAttribute('disabled'));
      const visibleProFeatures = Array.from(proFeatures)
        .filter(el => !el.classList.contains('hidden') && !el.hasAttribute('disabled'));
        
      if (visibleEnterpriseFeatures.length > 0 || visibleProFeatures.length > 0) {
        return { 
          passed: false, 
          message: 'Usuário BASIC vê features de planos superiores',
          details: { 
            plan: planCode, 
            visible_enterprise: visibleEnterpriseFeatures.length,
            visible_pro: visibleProFeatures.length
          }
        };
      }
    }

    return { 
      passed: true, 
      message: `Visibilidade de features respeitando plano ${planCode}` 
    };
  } catch (error: any) {
    return { passed: false, message: `Erro na verificação: ${error.message}` };
  }
};

/**
 * Verifica se contadores de projeto respeitam limite do plano
 */
export const assertProjectLimitsRespected = async (): Promise<UIAssertionResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { passed: false, message: 'Usuário não autenticado' };
    }

    // Buscar limites do usuário
    const { data: limits, error } = await supabase.rpc('check_user_limits', {
      p_user_id: user.id
    });

    if (error) {
      return { passed: false, message: `Erro ao verificar limites: ${error.message}` };
    }

    const { projects_used, project_limit, can_create_project } = limits as any;

    // Verificar se botão "Criar Projeto" está habilitado/desabilitado corretamente
    const createProjectButton = document.querySelector('[data-action="create-project"]');
    
    if (createProjectButton) {
      const isDisabled = createProjectButton.hasAttribute('disabled') || 
                        createProjectButton.classList.contains('disabled');
      
      if (can_create_project && isDisabled) {
        return { 
          passed: false, 
          message: 'Botão criar projeto desabilitado mesmo podendo criar',
          details: { projects_used, project_limit, can_create_project }
        };
      }
      
      if (!can_create_project && !isDisabled) {
        return { 
          passed: false, 
          message: 'Botão criar projeto habilitado mesmo no limite',
          details: { projects_used, project_limit, can_create_project }
        };
      }
    }

    return { 
      passed: true, 
      message: `Limites de projeto respeitados: ${projects_used}/${project_limit}` 
    };
  } catch (error: any) {
    return { passed: false, message: `Erro na verificação: ${error.message}` };
  }
};

/**
 * Verifica se contador de mensagens IA é exibido e atualiza corretamente
 */
export const assertAIMessageCounterRealTime = async (): Promise<UIAssertionResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { passed: false, message: 'Usuário não autenticado' };
    }

    // Buscar uso atual de mensagens
    const { data: limits, error } = await supabase.rpc('check_user_limits', {
      p_user_id: user.id
    });

    if (error) {
      return { passed: false, message: `Erro ao verificar limites: ${error.message}` };
    }

    const { messages_used, message_limit } = limits as any;

    // Verificar se contador é exibido na UI
    const counterElement = document.querySelector('[data-counter="ai-messages"]');
    
    if (!counterElement) {
      return { 
        passed: false, 
        message: 'Contador de mensagens IA não encontrado na UI' 
      };
    }

    const counterText = counterElement.textContent || '';
    const hasCurrentUsage = counterText.includes(messages_used.toString());
    const hasLimit = message_limit !== -1 ? counterText.includes(message_limit.toString()) : true;

    if (!hasCurrentUsage || !hasLimit) {
      return { 
        passed: false, 
        message: 'Contador de mensagens não exibe valores corretos',
        details: { 
          messages_used, 
          message_limit, 
          counter_text: counterText,
          has_usage: hasCurrentUsage,
          has_limit: hasLimit
        }
      };
    }

    return { 
      passed: true, 
      message: `Contador de mensagens funcionando: ${messages_used}/${message_limit}` 
    };
  } catch (error: any) {
    return { passed: false, message: `Erro na verificação: ${error.message}` };
  }
};

/**
 * Executa todas as verificações de UI
 */
export const runAllUIAssertions = async (): Promise<UIAssertionResult[]> => {
  const assertions = [
    assertUserWithoutPlanRedirect,
    assertPricingBlockedShowsUserInfo,
    assertSubscriptionButtonsWithUserId,
    assertPlanFeatureVisibility,
    assertProjectLimitsRespected,
    assertAIMessageCounterRealTime
  ];

  const results: UIAssertionResult[] = [];
  
  for (const assertion of assertions) {
    try {
      const result = await assertion();
      results.push(result);
    } catch (error: any) {
      results.push({
        passed: false,
        message: `Erro ao executar ${assertion.name}: ${error.message}`
      });
    }
  }

  return results;
};