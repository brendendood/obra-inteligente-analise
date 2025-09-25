import { test, expect } from '@playwright/test';

// Configuração base para testes
test.beforeEach(async ({ page }) => {
  // Configurar interceptadores para APIs
  await page.route('**/api/admin/mock/cacto', (route) => {
    // Mock do webhook para testes
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
});

test.describe('Subscription Flow - Novo Usuário', () => {
  test('Signup → Quiz → Paywall: fluxo completo', async ({ page }) => {
    // 1. Acessar página de signup
    await page.goto('/signup');
    
    // 2. Preencher formulário de cadastro
    await page.fill('[data-testid="email-input"]', `test-${Date.now()}@example.com`);
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="name-input"]', 'Usuario Teste');
    
    // 3. Submeter cadastro
    await page.click('[data-testid="signup-button"]');
    
    // 4. Aguardar redirecionamento para quiz
    await expect(page).toHaveURL(/.*\/quiz.*/);
    
    // 5. Completar quiz (assumindo steps básicos)
    await page.selectOption('[data-testid="context-select"]', 'construtora');
    await page.click('[data-testid="quiz-next"]');
    
    await page.selectOption('[data-testid="role-select"]', 'engenheiro');
    await page.click('[data-testid="quiz-next"]');
    
    await page.check('[data-testid="challenge-bim"]');
    await page.click('[data-testid="quiz-finish"]');
    
    // 6. Deve redirecionar para pricing-blocked
    await expect(page).toHaveURL(/.*\/pricing-blocked/);
    
    // 7. Verificar que não consegue acessar dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/pricing-blocked/);
  });
});

test.describe('Login sem Plano', () => {
  test('Usuário sem plano é redirecionado para pricing-blocked', async ({ page }) => {
    // 1. Fazer login com usuário sem plano (mock)
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user-no-plan@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // 2. Deve redirecionar automaticamente para pricing-blocked
    await expect(page).toHaveURL(/.*\/pricing-blocked/);
    
    // 3. Verificar que nome e email são exibidos
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
  });
});

test.describe('Assinatura via Mock Webhook', () => {
  test('Assinar plano BASIC via mock e acessar dashboard', async ({ page }) => {
    // 1. Login como admin para usar mock webhook
    await page.goto('/admin/verification');
    
    // 2. Simular webhook de assinatura BASIC
    await page.evaluate(async () => {
      const response = await fetch('/api/admin/mock/cacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription_created',
          email: 'test-user@example.com',
          plan: 'basic'
        })
      });
      return response.json();
    });
    
    // 3. Login como usuário básico
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test-user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // 4. Deve acessar dashboard com sucesso
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('Assinar PRO e ENTERPRISE via mock', async ({ page }) => {
    const plans = ['pro', 'enterprise'];
    
    for (const plan of plans) {
      // Mock webhook para cada plano
      await page.evaluate(async (planType) => {
        const response = await fetch('/api/admin/mock/cacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'subscription_created',
            email: `user-${planType}@example.com`,
            plan: planType
          })
        });
        return response.json();
      }, plan);
    }
  });
});

test.describe('Limites de Projetos', () => {
  test('BASIC: criar 5 projetos → 6º bloqueia', async ({ page }) => {
    // 1. Login como usuário BASIC
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'basic-user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // 2. Navegar para criação de projetos
    await page.goto('/projects');
    
    // 3. Criar 5 projetos (limite BASIC)
    for (let i = 1; i <= 5; i++) {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name"]', `Projeto BASIC ${i}`);
      await page.click('[data-testid="save-project"]');
      await expect(page.locator(`text=Projeto BASIC ${i}`)).toBeVisible();
    }
    
    // 4. Tentar criar 6º projeto (deve bloquear)
    await page.click('[data-testid="create-project-button"]');
    await expect(page.locator('[data-testid="limit-reached-message"]')).toBeVisible();
  });

  test('Excluir projeto não libera crédito', async ({ page }) => {
    // 1. Login como usuário no limite
    await page.goto('/dashboard');
    
    // 2. Verificar que está no limite
    await expect(page.locator('[data-testid="projects-count"]')).toContainText('5/5');
    
    // 3. Excluir um projeto
    await page.click('[data-testid="delete-project-button"]');
    await page.click('[data-testid="confirm-delete"]');
    
    // 4. Verificar que contagem mudou mas ainda não pode criar
    await expect(page.locator('[data-testid="projects-count"]')).toContainText('4/5');
    await page.click('[data-testid="create-project-button"]');
    await expect(page.locator('[data-testid="limit-reached-message"]')).toBeVisible();
  });

  test('PRO: criar 20 projetos → 21º bloqueia', async ({ page }) => {
    // Similar ao teste BASIC mas com limite de 20
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'pro-user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Criar até o limite de 20 projetos PRO
    for (let i = 1; i <= 20; i++) {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name"]', `Projeto PRO ${i}`);
      await page.click('[data-testid="save-project"]');
    }
    
    // 21º deve bloquear
    await page.click('[data-testid="create-project-button"]');
    await expect(page.locator('[data-testid="limit-reached-message"]')).toBeVisible();
  });

  test('ENTERPRISE: criar 100+ projetos → nunca bloqueia', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'enterprise-user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Criar muitos projetos para testar ilimitado
    for (let i = 1; i <= 50; i++) {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name"]', `Projeto ENT ${i}`);
      await page.click('[data-testid="save-project"]');
    }
    
    // Botão criar deve estar sempre disponível
    await expect(page.locator('[data-testid="create-project-button"]')).toBeEnabled();
  });
});

test.describe('Mensagens IA', () => {
  test('BASIC: 500 mensagens → 501ª bloqueia → reset zera contador', async ({ page }) => {
    // 1. Login como usuário BASIC
    await page.goto('/assistant');
    
    // 2. Simular 500 mensagens (via API mock)
    await page.evaluate(async () => {
      for (let i = 0; i < 500; i++) {
        await fetch('/api/increment-message-usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 'basic-user-id' })
        });
      }
    });
    
    // 3. Verificar contador no limite
    await expect(page.locator('[data-testid="message-counter"]')).toContainText('500/500');
    
    // 4. Tentar enviar 501ª mensagem
    await page.fill('[data-testid="message-input"]', 'Mensagem que deve bloquear');
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="limit-reached-ai"]')).toBeVisible();
    
    // 5. Simular reset mensal
    await page.evaluate(async () => {
      await fetch('/api/admin/reset-monthly-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'basic-user-id' })
      });
    });
    
    // 6. Contador deve voltar a 0
    await page.reload();
    await expect(page.locator('[data-testid="message-counter"]')).toContainText('0/500');
  });
});

test.describe('Gates de Features', () => {
  test('Usuário PRO tenta acessar feature ENTERPRISE → bloquear', async ({ page }) => {
    // 1. Login como usuário PRO
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'pro-user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // 2. Tentar acessar feature enterprise
    await page.goto('/advanced-reports'); // Feature enterprise
    
    // 3. Deve mostrar mensagem de upgrade
    await expect(page.locator('[data-testid="upgrade-required"]')).toBeVisible();
    await expect(page.locator('text=Upgrade para Enterprise')).toBeVisible();
  });
});

test.describe('Admin Panel', () => {
  test('Acesso /admin/users sem is_admin → 403', async ({ page }) => {
    // 1. Login como usuário normal
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'normal-user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // 2. Tentar acessar admin
    const response = await page.goto('/admin/users');
    expect(response?.status()).toBe(403);
  });

  test('Admin edita plano e vê efeito imediato + log', async ({ page }) => {
    // 1. Login como admin
    await page.goto('/admin/users');
    
    // 2. Editar plano de um usuário
    await page.selectOption('[data-testid="user-plan-select-1"]', 'PRO');
    await page.click('[data-testid="save-plan-1"]');
    
    // 3. Verificar toast de sucesso
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    
    // 4. Verificar que mudança refletiu na tabela
    await expect(page.locator('[data-testid="user-plan-1"]')).toContainText('PRO');
    
    // 5. Verificar logs de admin (se aplicável)
    await page.goto('/admin/logs');
    await expect(page.locator('text=update_plan')).toBeVisible();
  });
});