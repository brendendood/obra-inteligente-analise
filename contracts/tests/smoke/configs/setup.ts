// Setup file para os smoke tests
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup após cada teste
afterEach(() => {
  cleanup()
})

// Mock global do fetch para testes que precisam
global.fetch = vi.fn()

// Mock do window.location para testes de roteamento
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Mock do window.history para testes de navegação
Object.defineProperty(window, 'history', {
  value: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    length: 1,
    state: null,
  },
  writable: true,
})

// Mock do ResizeObserver para componentes que usam
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Suprimir warnings de console durante testes (mas manter errors)
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

console.warn = vi.fn()
console.error = (...args) => {
  // Manter errors importantes, suprimir warnings conhecidos
  const message = args[0]?.toString() || ''
  
  if (
    message.includes('Warning: ReactDOM.render is deprecated') ||
    message.includes('Warning: componentWillReceiveProps') ||
    message.includes('validateDOMNesting')
  ) {
    return // Suprimir warnings conhecidos
  }
  
  originalConsoleError(...args)
}

// Configurar timeouts globais para testes externos
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 5000,
})

// Setup para testes de performance
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now(),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  } as any
}

// Mock do AbortController se não existir
if (typeof AbortController === 'undefined') {
  global.AbortController = class AbortController {
    signal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
    abort = vi.fn(() => {
      this.signal.aborted = true
    })
  } as any
}

// Configurar AbortSignal.timeout se não existir
if (typeof AbortSignal !== 'undefined' && !AbortSignal.timeout) {
  AbortSignal.timeout = (delay: number) => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), delay)
    return controller.signal
  }
}

console.log('🧪 Smoke test setup completed')