# 🚀 SETUP E CONFIGURAÇÃO - MadenAI

> **Data:** 2025-08-25  
> **Ambiente:** Desenvolvimento, Staging e Produção  
> **Objetivo:** Guia completo para configurar o projeto em qualquer ambiente

## 📋 PRÉ-REQUISITOS

### 💻 **Software Necessário**
```bash
Node.js >= 18.0.0
npm >= 9.0.0 (ou yarn/pnpm/bun)
Git >= 2.30.0
Navegador moderno (Chrome/Firefox/Safari/Edge)
```

### 🔧 **Ferramentas Opcionais**
```bash
VS Code (recomendado)
Docker (para containerização)
Postman/Insomnia (para testes de API)
```

## 🏠 DESENVOLVIMENTO LOCAL

### 📥 **1. Clone e Instalação**
```bash
# Clone do repositório
git clone <url-do-repositorio>
cd madeai

# Instalar dependências
npm install

# Verificar instalação
npm run type-check
npm run lint
```

### 🔧 **2. Configuração de Ambiente**
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar variáveis (usando editor de sua preferência)
nano .env
# ou
code .env
```

**Configuração mínima (.env):**
```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=seu-projeto-id
```

### 🚀 **3. Iniciar Desenvolvimento**
```bash
# Servidor de desenvolvimento
npm run dev

# Servidor será iniciado em:
# http://localhost:8080

# Verificar funcionamento
curl http://localhost:8080
```

### ✅ **4. Verificação de Saúde**
```bash
# Executar smoke tests
npm run test:smoke

# Verificar build
npm run build

# Preview do build
npm run preview
```

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### 🔑 **1. Projeto Supabase**
```bash
# Acessar: https://supabase.com/dashboard
# Criar novo projeto ou usar existente
# Anotar:
# - Project URL
# - Project ID  
# - Anon/Public Key
```

### 🗃️ **2. Database Setup**
```sql
-- Executar no SQL Editor do Supabase:

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas básicas (exemplo)
CREATE POLICY "Users can view own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Verificar configuração
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

### 🔐 **3. Authentication Setup**
```bash
# No Dashboard Supabase:
# 1. Authentication > Settings
# 2. Configurar Site URL: http://localhost:8080
# 3. Configurar Redirect URLs:
#    - http://localhost:8080/auth/callback
#    - https://seu-dominio.com/auth/callback (produção)
# 4. Habilitar providers necessários (Email, Google, etc.)
```

### 📁 **4. Storage Setup**
```bash
# No Dashboard Supabase:
# 1. Storage > Create bucket
# 2. Criar buckets necessários:
#    - uploads (public)
#    - documents (private)
#    - avatars (public)
# 3. Configurar políticas de acesso
```

## 🤖 CONFIGURAÇÃO N8N

### 🌐 **1. Acesso ao N8N**
```bash
# URL: https://madeai-br.app.n8n.cloud
# Login: [credenciais do projeto]
# Verificar webhooks ativos:
# - /webhook/chat-geral
# - /webhook/projeto-chat  
# - /webhook/orcamento-ia
# - /webhook/cronograma-ia
# - /webhook/analise-tecnica
```

### 🔗 **2. Teste de Webhooks**
```bash
# Testar conectividade
curl -X HEAD https://madeai-br.app.n8n.cloud/webhook/chat-geral

# Teste básico (não enviar dados reais)
curl -X POST https://madeai-br.app.n8n.cloud/webhook/chat-geral \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### ⚙️ **3. Configuração de Fallbacks**
```typescript
// Verificar em src/utils/agents/fallbacks/
// Cada agent deve ter fallback configurado
// Testar fallbacks localmente:
npm run test:agents
```

## 🌐 STAGING/PREVIEW

### 🔧 **1. Build de Staging**
```bash
# Build otimizado
npm run build

# Testar build localmente
npm run preview

# Verificar bundle size
npm run build -- --analyze
```

### 🚀 **2. Deploy Staging**
```bash
# Via Lovable (automático)
# 1. Push para branch main/master
# 2. Deploy automático via Lovable
# 3. URL: https://seu-projeto.lovable.app

# Via manual (alternativo)
npm run build
# Upload dist/ para servidor de staging
```

### ✅ **3. Verificação Staging**
```bash
# Health check
curl https://seu-projeto.lovable.app/

# Smoke tests remotos
npm run test:smoke:remote

# Verificar Console do navegador
# Verificar Network tab
# Testar funcionalidades principais
```

## 🚀 PRODUÇÃO

### 🏗️ **1. Preparação para Produção**
```bash
# Executar checklist pré-produção
npm run pre-production-check

# Verificações incluem:
# - TypeScript sem erros
# - ESLint sem warnings
# - Build sem erros
# - Smoke tests passando
# - Bundle size aceitável
```

### 🔐 **2. Configuração Produção**
```bash
# Variáveis de produção (.env.production)
NODE_ENV=production
VITE_SUPABASE_URL=https://projeto-prod.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ_prod_key_...
VITE_SUPABASE_PROJECT_ID=projeto-prod-id
VITE_DEBUG_MODE=false
```

### 🌍 **3. Deploy Produção**
```bash
# Via Lovable
# 1. Configurar domínio customizado
# 2. Configurar SSL/HTTPS
# 3. Deploy via interface Lovable

# Build produção manual
NODE_ENV=production npm run build

# Verificar otimizações
ls -la dist/
gzip -9 < dist/index.html | wc -c  # Tamanho comprimido
```

### 📊 **4. Monitoramento Produção**
```bash
# Health checks periódicos
curl -f https://seu-dominio.com/ || echo "Site down"

# Verificar logs (se disponível)
# Verificar métricas de performance
# Configurar alertas (Sentry, LogRocket, etc.)
```

## 🛠️ TROUBLESHOOTING

### 🚨 **Problemas Comuns**

#### ❌ **Erro: Supabase connection failed**
```bash
# Verificar variáveis
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_PUBLISHABLE_KEY

# Testar conectividade
curl -I $VITE_SUPABASE_URL

# Verificar chaves no Dashboard Supabase
```

#### ❌ **Erro: N8N webhooks not responding**
```bash
# Verificar status N8N
curl -I https://madeai-br.app.n8n.cloud

# Verificar logs no N8N dashboard
# Verificar fallbacks estão funcionando
```

#### ❌ **Erro: Build failing**
```bash
# Limpar cache
rm -rf node_modules dist .vite
npm install

# Verificar TypeScript
npm run type-check

# Verificar dependencies
npm audit
npm update
```

#### ❌ **Erro: Tests failing**
```bash
# Executar testes individuais
npm run test:smoke -- --reporter=verbose

# Verificar setup de teste
cat contracts/tests/smoke/configs/setup.ts

# Limpar cache de teste
rm -rf node_modules/.cache
```

### 🔍 **Debug Avançado**

#### 🐛 **Development Debug**
```bash
# Habilitar debug verbose
VITE_DEBUG_MODE=true npm run dev

# Verificar network requests no DevTools
# Verificar console errors
# Verificar React DevTools
```

#### 📱 **Mobile/Responsive Debug**
```bash
# Servidor acessível via IP local
npm run dev -- --host 0.0.0.0

# Acessar via:
# http://192.168.1.xxx:8080 (seu IP local)

# Testar em dispositivos móveis
# Usar Chrome DevTools Device Mode
```

## 📋 CHECKLIST DE DEPLOY

### ✅ **Pré-Deploy**
- [ ] Testes passando (`npm run test:smoke`)
- [ ] Build sem erros (`npm run build`)
- [ ] TypeScript sem erros (`npm run type-check`)
- [ ] ESLint sem warnings (`npm run lint`)
- [ ] Bundle size aceitável (< 1MB initial)
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase funcionando
- [ ] N8N webhooks respondendo

### ✅ **Pós-Deploy**
- [ ] Health check da aplicação
- [ ] Login/logout funcionando
- [ ] Upload de arquivos funcionando
- [ ] IA respondendo (com fallbacks)
- [ ] Performance aceitável (< 3s load)
- [ ] Mobile responsivo
- [ ] HTTPS funcionando
- [ ] Console sem erros críticos

## 🔄 MANUTENÇÃO

### 📅 **Rotina Semanal**
```bash
# Atualizar dependências
npm update
npm audit fix

# Executar testes
npm run test:smoke

# Verificar logs de produção
# Monitorar performance
```

### 📊 **Monitoramento Contínuo**
```bash
# Métricas importantes:
# - Uptime (> 99.5%)
# - Response time (< 2s)
# - Error rate (< 1%)
# - Bundle size (< 1MB)
# - Core Web Vitals (Green)
```

---

## 🎯 ORDEM DE DEPENDÊNCIAS

### 🔄 **Sequência de Inicialização**
1. **Node.js/npm** (base)
2. **Dependências** (`npm install`)
3. **Supabase** (backend)
4. **N8N** (opcional, com fallbacks)
5. **Aplicação** (`npm run dev`)

### 🌐 **Dependências Externas**
```bash
# Críticas (aplicação não funciona sem):
- Supabase Database/Auth
- Domínio/hosting

# Importantes (funciona com fallbacks):
- N8N AI webhooks
- APIs de geolocalização

# Opcionais:
- Analytics/monitoring
- CDN para assets
```

---

> **🎯 OBJETIVO:** Este guia garante que qualquer desenvolvedor possa configurar e executar o projeto MadenAI em qualquer ambiente, do desenvolvimento local até a produção, seguindo as melhores práticas de DevOps e segurança.