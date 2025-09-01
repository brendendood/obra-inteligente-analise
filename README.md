# MadeAI

Sistema de gestão e análise de obras com integração de IA via N8N.

## 🔒 Configuração de Autenticação Supabase

### Auth Redirect URL no Supabase

Para que o fluxo de confirmação de e-mail funcione corretamente, configure o Auth Redirect URL no painel do Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. Configure:

#### Site URL
- **Desenvolvimento**: `http://localhost:8080`
- **Produção**: `https://SEU_DOMINIO.com`

#### Redirect URLs
- **Desenvolvimento**: `http://localhost:8080/auth/callback`
- **Produção**: `https://SEU_DOMINIO.com/auth/callback`

### Fluxo de Confirmação de E-mail

O sistema implementa um fluxo robusto que:

- ✅ **Sempre termina com sucesso**: independente do resultado técnico
- ✅ **Timeout de segurança**: 8 segundos máximo para evitar loading infinito
- ✅ **Todos os cenários cobertos**: tokens válidos, inválidos, ausentes ou expirados
- ✅ **Acessibilidade completa**: foco automático, aria-live e labels descritivos

#### URLs do Fluxo
- **Callback**: `/auth/callback` - processa os tokens do Supabase
- **Sucesso**: `/email/sucesso` - página final com animação Lottie e botão para login

## Project info

**URL**: https://lovable.dev/projects/1f657578-79fb-4f32-8e40-7b6346722964

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1f657578-79fb-4f32-8e40-7b6346722964) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1f657578-79fb-4f32-8e40-7b6346722964) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
