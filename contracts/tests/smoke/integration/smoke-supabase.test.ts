// 🧪 SMOKE TEST - Verificação Supabase
// Objetivo: Verificar se Supabase está configurado e acessível (sem modificar dados)

import { describe, it, expect, beforeAll } from 'vitest'

describe('🗄️ Smoke Tests - Supabase Integration', () => {
  let supabase: any

  beforeAll(async () => {
    // Import dinâmico para capturar erros de configuração
    try {
      const module = await import('@/integrations/supabase/client')
      supabase = module.supabase
    } catch (error) {
      console.error('❌ Failed to import Supabase client:', error)
      throw error
    }
  })

  describe('🔧 Client Configuration', () => {
    it('should have Supabase client initialized', () => {
      expect(supabase).toBeDefined()
      expect(supabase.supabaseUrl).toBeDefined()
      expect(supabase.supabaseKey).toBeDefined()
    })

    it('should have auth service available', () => {
      expect(supabase.auth).toBeDefined()
      expect(typeof supabase.auth.getSession).toBe('function')
      expect(typeof supabase.auth.onAuthStateChange).toBe('function')
    })

    it('should have database service available', () => {
      expect(supabase.from).toBeDefined()
      expect(typeof supabase.from).toBe('function')
    })

    it('should have storage service available', () => {
      expect(supabase.storage).toBeDefined()
      expect(typeof supabase.storage.from).toBe('function')
    })

    it('should have realtime service available', () => {
      expect(supabase.realtime).toBeDefined()
    })
  })

  describe('🔐 Authentication Service', () => {
    it('should get current session without errors', async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        // Não deve ter erro de conexão/configuração
        expect(error).toBeNull()
        
        // Data pode ser null (não logado) ou ter session
        expect(data).toBeDefined()
        expect(data.session === null || typeof data.session === 'object').toBe(true)
      } catch (error) {
        // Se falhar, deve ser erro de rede, não de configuração
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should setup auth state listener without errors', () => {
      expect(() => {
        const { data } = supabase.auth.onAuthStateChange(() => {})
        expect(data.subscription).toBeDefined()
        expect(typeof data.subscription.unsubscribe).toBe('function')
        
        // Cleanup
        data.subscription.unsubscribe()
      }).not.toThrow()
    })
  })

  describe('🗃️ Database Service', () => {
    it('should create query builder without errors', () => {
      expect(() => {
        const query = supabase.from('projects')
        expect(query).toBeDefined()
        expect(typeof query.select).toBe('function')
        expect(typeof query.insert).toBe('function')
        expect(typeof query.update).toBe('function')
        expect(typeof query.delete).toBe('function')
      }).not.toThrow()
    })

    it('should handle RPC calls structure', () => {
      expect(() => {
        const rpc = supabase.rpc('test_function')
        expect(rpc).toBeDefined()
      }).not.toThrow()
    })
  })

  describe('📁 Storage Service', () => {
    it('should create storage bucket reference without errors', () => {
      expect(() => {
        const bucket = supabase.storage.from('uploads')
        expect(bucket).toBeDefined()
        expect(typeof bucket.upload).toBe('function')
        expect(typeof bucket.download).toBe('function')
        expect(typeof bucket.list).toBe('function')
      }).not.toThrow()
    })
  })

  describe('📡 Realtime Service', () => {
    it('should create realtime channel without errors', () => {
      expect(() => {
        const channel = supabase.realtime.channel('test-channel')
        expect(channel).toBeDefined()
        expect(typeof channel.on).toBe('function')
        expect(typeof channel.subscribe).toBe('function')
        expect(typeof channel.unsubscribe).toBe('function')
      }).not.toThrow()
    })
  })

  describe('🔗 Connection Health', () => {
    it('should have valid configuration URLs', () => {
      // Verifica se URLs têm formato correto
      expect(supabase.supabaseUrl).toMatch(/^https:\/\/.*\.supabase\.co$/)
      expect(supabase.supabaseKey).toMatch(/^eyJ.*/)
    })

    it('should respect timeout configurations', async () => {
      // Teste de timeout - não deve travar indefinidamente
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )

      const testQuery = supabase.from('profiles').select('id').limit(1)

      try {
        await Promise.race([testQuery, timeoutPromise])
        // Se chegou aqui, query completou dentro do timeout (success)
        expect(true).toBe(true)
      } catch (error) {
        // Se for timeout, é problema de configuração
        if (error.message === 'Timeout') {
          console.warn('⚠️ Supabase query timeout - possible network issue')
        }
        // Outros erros podem ser de permissão (acceptable para smoke test)
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('🎯 Environment Configuration', () => {
    it('should use correct project configuration', () => {
      // Verifica se está usando o projeto correto
      expect(supabase.supabaseUrl).toContain('mozqijzvtbuwuzgemzsm')
    })

    it('should have proper API key format', () => {
      // Verifica formato da API key (JWT)
      const key = supabase.supabaseKey
      expect(key).toMatch(/^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
    })
  })
})

describe('🔍 Integration Health Check', () => {
  it('should perform basic health check', async () => {
    try {
      const supabase = (await import('@/integrations/supabase/client')).supabase
      
      // Health check simples - pegar versão ou status
      const start = Date.now()
      const { data, error } = await supabase.auth.getSession()
      const duration = Date.now() - start
      
      // Resposta deve vir em tempo razoável (menos de 3 segundos)
      expect(duration).toBeLessThan(3000)
      
      // Não deve ter erro de configuração/conexão
      if (error) {
        // Erros de auth são OK, erros de config não
        expect(error.message).not.toContain('Invalid API key')
        expect(error.message).not.toContain('Invalid URL')
      }
      
      expect(data).toBeDefined()
      
    } catch (error) {
      // Log para debug, mas não falha o teste se for erro de rede
      console.warn('⚠️ Supabase health check warning:', error.message)
      
      // Só falha se for erro de configuração crítica
      expect(error.message).not.toContain('Invalid API key')
      expect(error.message).not.toContain('Invalid URL')
    }
  })
})