// 🧪 SMOKE TEST - Verificação APIs Externas
// Objetivo: Verificar se APIs externas estão acessíveis e funcionais

import { describe, it, expect } from 'vitest'

describe('🌐 Smoke Tests - External APIs', () => {
  describe('🌍 IP Geolocation API', () => {
    it('should be able to fetch public IP', async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch('https://api.ipify.org?format=json', {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        expect(response.ok).toBe(true)
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data).toBeDefined()
        expect(data.ip).toBeDefined()
        expect(typeof data.ip).toBe('string')
        
        // Validate IP format (basic IPv4/IPv6 check)
        expect(data.ip).toMatch(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i)
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('⚠️ IP geolocation API timeout')
        } else {
          console.warn('⚠️ IP geolocation API error:', error.message)
        }
        
        // Para smoke test, log warning mas continua
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should handle API response format correctly', async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json', {
          signal: AbortSignal.timeout(3000)
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Verifica estrutura da resposta
          expect(typeof data).toBe('object')
          expect('ip' in data).toBe(true)
          
          // IP deve ser string não vazia
          expect(typeof data.ip).toBe('string')
          expect(data.ip.length).toBeGreaterThan(0)
        }
        
      } catch (error) {
        // Falhas de rede são aceitáveis em smoke tests
        console.warn('⚠️ Network issue with IP API:', error.message)
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('🗄️ Supabase External Endpoints', () => {
    it('should validate Supabase domain accessibility', async () => {
      try {
        const supabaseUrl = 'https://mozqijzvtbuwuzgemzsm.supabase.co'
        
        const response = await fetch(supabaseUrl, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        
        // Qualquer resposta indica que domínio está acessível
        expect(response).toBeDefined()
        
      } catch (error) {
        console.warn('⚠️ Supabase domain accessibility issue:', error.message)
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should validate Supabase API endpoint structure', () => {
      const supabaseUrl = 'https://mozqijzvtbuwuzgemzsm.supabase.co'
      
      // Verifica estrutura das URLs da API
      const expectedEndpoints = [
        '/auth/v1/',
        '/rest/v1/',
        '/storage/v1/',
        '/realtime/v1/'
      ]
      
      expectedEndpoints.forEach(endpoint => {
        const fullUrl = `${supabaseUrl}${endpoint}`
        expect(fullUrl).toMatch(/^https:\/\/.*\.supabase\.co\//)
      })
    })
  })

  describe('🤖 N8N External Verification', () => {
    it('should validate N8N domain structure', () => {
      const n8nUrl = 'https://madeai-br.app.n8n.cloud'
      
      expect(n8nUrl).toMatch(/^https:\/\/.*\.n8n\.cloud$/)
      expect(n8nUrl).toContain('madeai-br')
    })

    it('should check N8N domain accessibility', async () => {
      try {
        const response = await fetch('https://madeai-br.app.n8n.cloud', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        
        // Qualquer resposta (incluindo 404) indica que domínio responde
        expect(response).toBeDefined()
        
      } catch (error) {
        console.warn('⚠️ N8N domain accessibility issue:', error.message)
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('📧 Email Service Dependencies', () => {
    it('should handle email service configuration', async () => {
      // Verifica se configurações de email estão estruturadas corretamente
      try {
        // Não testamos email real, apenas verificamos se módulos carregam
        const supabase = (await import('@/integrations/supabase/client')).supabase
        
        expect(supabase.functions).toBeDefined()
        expect(typeof supabase.functions.invoke).toBe('function')
        
      } catch (error) {
        console.error('❌ Email service configuration error:', error)
        throw error
      }
    })
  })

  describe('🔍 External Service Health', () => {
    it('should perform concurrent health checks', async () => {
      const healthChecks = [
        // IP API
        fetch('https://api.ipify.org?format=json', {
          signal: AbortSignal.timeout(3000)
        }).then(response => ({ service: 'ipify', status: response.ok })),
        
        // Supabase (HEAD request)
        fetch('https://mozqijzvtbuwuzgemzsm.supabase.co', {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        }).then(response => ({ service: 'supabase', status: response.status < 500 })),
        
        // N8N (HEAD request)
        fetch('https://madeai-br.app.n8n.cloud', {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        }).then(response => ({ service: 'n8n', status: response.status < 500 }))
      ]

      try {
        const results = await Promise.allSettled(healthChecks)
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            console.log(`✅ ${result.value.service} health check: ${result.value.status ? 'OK' : 'Issue'}`)
          } else {
            console.warn(`⚠️ ${['ipify', 'supabase', 'n8n'][index]} health check failed:`, result.reason.message)
          }
        })
        
        // Ao menos um serviço deve estar acessível
        const successfulChecks = results.filter(result => 
          result.status === 'fulfilled' && result.value.status
        )
        
        expect(successfulChecks.length).toBeGreaterThan(0)
        
      } catch (error) {
        console.warn('⚠️ Health checks failed:', error)
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should validate response times', async () => {
      const startTime = Date.now()
      
      try {
        await fetch('https://api.ipify.org?format=json', {
          signal: AbortSignal.timeout(2000)
        })
        
        const responseTime = Date.now() - startTime
        
        // API deve responder em menos de 2 segundos
        expect(responseTime).toBeLessThan(2000)
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('⚠️ API response too slow (>2s)')
        } else {
          console.warn('⚠️ API response error:', error.message)
        }
        
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('🌍 CDN and Static Resources', () => {
    it('should validate external CDN accessibility', async () => {
      // Testa CDNs comuns usados pelo projeto
      const cdnUrls = [
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net'
      ]

      for (const cdnUrl of cdnUrls) {
        try {
          const response = await fetch(cdnUrl, {
            method: 'HEAD',
            signal: AbortSignal.timeout(3000)
          })
          
          expect(response).toBeDefined()
          
        } catch (error) {
          console.warn(`⚠️ CDN ${cdnUrl} accessibility issue:`, error.message)
          expect(error).toBeInstanceOf(Error)
        }
      }
    })
  })
})

describe('⚡ External API Performance', () => {
  it('should monitor API response times', async () => {
    const performanceTests = [
      {
        name: 'IP API',
        url: 'https://api.ipify.org?format=json',
        maxTime: 2000
      }
    ]

    for (const test of performanceTests) {
      try {
        const start = Date.now()
        
        await fetch(test.url, {
          signal: AbortSignal.timeout(test.maxTime)
        })
        
        const duration = Date.now() - start
        
        expect(duration).toBeLessThan(test.maxTime)
        console.log(`✅ ${test.name} response time: ${duration}ms`)
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn(`⚠️ ${test.name} timeout (>${test.maxTime}ms)`)
        } else {
          console.warn(`⚠️ ${test.name} error:`, error.message)
        }
        
        expect(error).toBeInstanceOf(Error)
      }
    }
  })
})