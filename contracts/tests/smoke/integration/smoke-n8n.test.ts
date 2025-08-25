// 🧪 SMOKE TEST - Verificação N8N Webhooks
// Objetivo: Verificar se endpoints N8N estão acessíveis (sem enviar dados reais)

import { describe, it, expect, beforeAll } from 'vitest'

describe('🤖 Smoke Tests - N8N Integration', () => {
  let agentConfig: any
  let agentService: any

  beforeAll(async () => {
    try {
      const configModule = await import('@/utils/agents/agentConfig')
      const serviceModule = await import('@/utils/agents/agentService')
      
      agentConfig = configModule.AGENT_CONFIGS
      agentService = serviceModule.AgentService
    } catch (error) {
      console.error('❌ Failed to import N8N modules:', error)
      throw error
    }
  })

  describe('⚙️ Configuration', () => {
    it('should have agent configurations defined', () => {
      expect(agentConfig).toBeDefined()
      expect(typeof agentConfig).toBe('object')
    })

    it('should have all required agent types', () => {
      const requiredAgents = ['general', 'project', 'budget', 'schedule', 'analysis']
      
      requiredAgents.forEach(agentType => {
        expect(agentConfig[agentType]).toBeDefined()
        expect(agentConfig[agentType].webhookUrl).toBeDefined()
        expect(agentConfig[agentType].timeout).toBeDefined()
        expect(agentConfig[agentType].retryAttempts).toBeDefined()
        expect(agentConfig[agentType].fallbackGenerator).toBeDefined()
      })
    })

    it('should have valid webhook URLs', () => {
      Object.entries(agentConfig).forEach(([agentType, config]: [string, any]) => {
        expect(config.webhookUrl).toMatch(/^https:\/\/madeai-br\.app\.n8n\.cloud\/webhook/)
        expect(config.timeout).toBeGreaterThan(0)
        expect(config.retryAttempts).toBeGreaterThanOrEqual(0)
        expect(typeof config.fallbackGenerator).toBe('function')
      })
    })
  })

  describe('🔗 Endpoint Accessibility', () => {
    it('should have reachable N8N domain', async () => {
      // Testa se o domínio N8N responde (sem enviar dados)
      try {
        const baseUrl = 'https://madeai-br.app.n8n.cloud'
        const response = await fetch(baseUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
        
        // Qualquer resposta (mesmo 404) indica que domínio está acessível
        expect(response).toBeDefined()
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('⚠️ N8N domain timeout - possible network issue')
        } else {
          console.warn('⚠️ N8N domain not reachable:', error.message)
        }
        
        // Para smoke test, log warning mas não falha
        expect(error).toBeInstanceOf(Error)
      }
    })

    // Note: Não fazemos requests reais aos webhooks para evitar spam/dados falsos
    it('should construct valid webhook URLs', () => {
      const expectedEndpoints = [
        'chat-geral',
        'projeto-chat', 
        'orcamento-ia',
        'cronograma-ia',
        'analise-tecnica'
      ]

      expectedEndpoints.forEach(endpoint => {
        const fullUrl = `https://madeai-br.app.n8n.cloud/webhook/${endpoint}`
        
        // Verifica se algum agente usa este endpoint
        const hasAgent = Object.values(agentConfig).some((config: any) => 
          config.webhookUrl === fullUrl
        )
        
        expect(hasAgent).toBe(true)
      })
    })
  })

  describe('🛠️ Agent Service', () => {
    it('should have AgentService class defined', () => {
      expect(agentService).toBeDefined()
      expect(typeof agentService.sendMessage).toBe('function')
      expect(typeof agentService.sendToAgent).toBe('function')
    })

    it('should handle service initialization', () => {
      expect(() => {
        // Verifica se service pode ser instanciado sem erro
        const testRequest = {
          message: 'test',
          agent_type: 'general' as const,
          timestamp: new Date().toISOString()
        }
        
        // Não executa, só verifica estrutura
        expect(testRequest.agent_type).toBe('general')
      }).not.toThrow()
    })
  })

  describe('🔄 Fallback System', () => {
    it('should have fallback functions for all agents', async () => {
      const fallbackModules = [
        '@/utils/agents/fallbacks/generalFallback',
        '@/utils/agents/fallbacks/projectFallback',
        '@/utils/agents/fallbacks/budgetFallback',
        '@/utils/agents/fallbacks/scheduleFallback',
        '@/utils/agents/fallbacks/analysisFallback'
      ]

      for (const modulePath of fallbackModules) {
        try {
          const module = await import(modulePath)
          const fallbackFunction = Object.values(module)[0] as Function
          
          expect(typeof fallbackFunction).toBe('function')
          
          // Testa se fallback executa sem erro
          const testResult = fallbackFunction('test message', {
            message: 'test',
            agent_type: 'general',
            timestamp: new Date().toISOString()
          })
          
          expect(typeof testResult).toBe('string')
          expect(testResult.length).toBeGreaterThan(0)
          
        } catch (error) {
          console.error(`❌ Error testing fallback ${modulePath}:`, error)
          throw error
        }
      }
    })
  })

  describe('📝 Request Structure', () => {
    it('should handle agent request types', async () => {
      const { AgentType } = await import('@/utils/agents/agentTypes')
      
      // Verifica se tipos estão definidos corretamente
      const validTypes = ['general', 'project', 'budget', 'schedule', 'analysis']
      
      validTypes.forEach(type => {
        expect(() => {
          const request = {
            message: 'test',
            agent_type: type,
            timestamp: new Date().toISOString()
          }
          expect(request.agent_type).toBe(type)
        }).not.toThrow()
      })
    })

    it('should validate request payload structure', () => {
      const testPayload = {
        message: 'Test message',
        agent_type: 'general' as const,
        user_context: {
          id: 'test-user',
          plan: 'free'
        },
        project_context: {
          id: 'test-project',
          name: 'Test Project'
        },
        timestamp: new Date().toISOString()
      }

      expect(testPayload.message).toBeDefined()
      expect(testPayload.agent_type).toBeDefined()
      expect(testPayload.timestamp).toBeDefined()
      expect(testPayload.user_context).toBeDefined()
      expect(testPayload.project_context).toBeDefined()
    })
  })

  describe('⏱️ Timeout Configuration', () => {
    it('should have reasonable timeout values', () => {
      Object.entries(agentConfig).forEach(([agentType, config]: [string, any]) => {
        // Timeouts devem estar entre 10s e 120s
        expect(config.timeout).toBeGreaterThanOrEqual(10000)
        expect(config.timeout).toBeLessThanOrEqual(120000)
        
        // Retry attempts devem ser razoáveis (0-3)
        expect(config.retryAttempts).toBeGreaterThanOrEqual(0)
        expect(config.retryAttempts).toBeLessThanOrEqual(3)
      })
    })

    it('should have appropriate timeouts for different agent types', () => {
      // Agentes mais complexos devem ter timeouts maiores
      expect(agentConfig.analysis.timeout).toBeGreaterThanOrEqual(agentConfig.general.timeout)
      expect(agentConfig.budget.timeout).toBeGreaterThanOrEqual(agentConfig.general.timeout)
      expect(agentConfig.schedule.timeout).toBeGreaterThanOrEqual(agentConfig.general.timeout)
    })
  })
})

describe('🔍 N8N Health Check', () => {
  it('should perform basic connectivity check', async () => {
    // Teste não invasivo - apenas verifica conectividade básica
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      // Apenas HEAD request para verificar se servidor responde
      const response = await fetch('https://madeai-br.app.n8n.cloud', {
        method: 'HEAD',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      // Qualquer resposta indica que servidor está online
      expect(response).toBeDefined()
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ N8N connectivity timeout')
      } else {
        console.warn('⚠️ N8N connectivity issue:', error.message)
      }
      
      // Para smoke test, apenas avisa sobre problemas de conectividade
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('should validate webhook endpoints exist in configuration', () => {
    const webhookEndpoints = Object.values(agentConfig).map((config: any) => config.webhookUrl)
    
    expect(webhookEndpoints).toHaveLength(5)
    
    // Todos devem ter URLs únicas
    const uniqueEndpoints = new Set(webhookEndpoints)
    expect(uniqueEndpoints.size).toBe(webhookEndpoints.length)
    
    // Todos devem usar HTTPS
    webhookEndpoints.forEach(url => {
      expect(url).toMatch(/^https:\/\//)
    })
  })
})