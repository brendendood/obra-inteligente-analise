
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { GenderSelect } from '@/components/account/GenderSelect';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    cargo: '',
    gender: 'male' as 'male' | 'female',
    refCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({ title: "❌ Nome obrigatório", description: "Por favor, preencha seu nome completo." });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "❌ Email obrigatório", description: "Por favor, preencha seu email." });
      return false;
    }
    if (formData.password.length < 8) {
      toast({ title: "❌ Senha muito fraca", description: "A senha deve ter pelo menos 8 caracteres." });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "❌ Senhas não coincidem", description: "Por favor, confirme sua senha corretamente." });
      return false;
    }
    if (!acceptedTerms) {
      toast({ title: "❌ Aceite os termos", description: "Você deve aceitar os Termos de Uso." });
      return false;
    }
    if (!acceptedPrivacy) {
      toast({ title: "❌ Aceite a política", description: "Você deve aceitar a Política de Privacidade." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      console.log('🔐 SIGNUP: Iniciando cadastro para:', formData.email);

      // Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company: formData.company,
            cargo: formData.cargo,
            gender: formData.gender,
            ref_code: formData.refCode || undefined,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      });

      if (authError) {
        console.error('❌ SIGNUP: Erro na criação:', authError);
        
        if (authError.message.includes('already registered')) {
          toast({
            title: "❌ Email já cadastrado",
            description: "Este email já possui uma conta. Tente fazer login ou usar outro email.",
          });
        } else {
          toast({
            title: "❌ Erro no cadastro",
            description: authError.message,
          });
        }
        return;
      }

      if (!authData.user) {
        throw new Error('Falha na criação do usuário');
      }

      console.log('✅ SIGNUP: Usuário criado:', authData.user.id);

      // Enviar email de verificação personalizado
      try {
        console.log('📧 SIGNUP: Enviando email de verificação...');
        
        const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email: formData.email,
            user_data: {
              full_name: formData.fullName,
              user_id: authData.user.id
            }
          }
        });

        if (emailError) {
          console.error('⚠️ SIGNUP: Erro no email de verificação:', emailError);
          toast({
            title: "⚠️ Aviso",
            description: "Cadastro realizado, mas houve problema no envio do email de verificação. Tente reenviar.",
          });
        } else {
          console.log('✅ SIGNUP: Email de verificação enviado');
        }
      } catch (emailError) {
        console.error('⚠️ SIGNUP: Erro na função de email:', emailError);
      }

      // Mostrar tela de sucesso
      setUserEmail(formData.email);
      setShowSuccess(true);

      toast({
        title: "🎉 Cadastro realizado!",
        description: `Bem-vindo(a), ${formData.fullName}! Verifique seu email para ativar sua conta.`,
      });

    } catch (error: any) {
      console.error('❌ SIGNUP: Erro geral:', error);
      toast({
        title: "❌ Erro no cadastro",
        description: error.message || "Erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      console.log('📧 RESEND: Reenviando verificação para:', userEmail);

      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: userEmail,
          user_data: {
            full_name: formData.fullName
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "📧 Email reenviado!",
        description: "Verifique sua caixa de entrada (e spam) novamente.",
      });

    } catch (error: any) {
      console.error('❌ RESEND: Erro:', error);
      toast({
        title: "❌ Erro no reenvio",
        description: error.message || "Não foi possível reenviar o email.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tela de sucesso após cadastro
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UnifiedLogo />
            <CardTitle className="text-2xl text-green-600">✅ Cadastro Realizado!</CardTitle>
            <CardDescription>
              Verifique seu email para ativar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>📧 Email enviado para:</strong><br />
                {userEmail}
                <br /><br />
                Clique no link de verificação para ativar sua conta e fazer login.
                <br /><br />
                <strong>⚠️ Não esqueça de verificar a pasta de spam!</strong>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={handleResendVerification}
                disabled={loading}
                variant="outline" 
                className="w-full"
              >
                {loading ? "Reenviando..." : "📧 Reenviar Email"}
              </Button>
              
              <Button 
                onClick={() => navigate('/login')}
                variant="default" 
                className="w-full"
              >
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulário de cadastro
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <UnifiedLogo />
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Junte-se à revolução da construção inteligente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Digite a senha novamente"
                required
              />
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Nome da sua empresa (opcional)"
              />
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                type="text"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                placeholder="Seu cargo (opcional)"
              />
            </div>

            {/* Gênero */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <GenderSelect
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              />
            </div>

            {/* Código de Referência */}
            <div className="space-y-2">
              <Label htmlFor="refCode">Código de Indicação (opcional)</Label>
              <Input
                id="refCode"
                type="text"
                value={formData.refCode}
                onChange={(e) => handleInputChange('refCode', e.target.value)}
                placeholder="REF_XXXXXXXX"
              />
            </div>

            {/* Checkboxes de aceite */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Aceito os <Link to="/terms" className="text-primary underline">Termos de Uso</Link> *
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                />
                <Label htmlFor="privacy" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Aceito a <Link to="/privacy" className="text-primary underline">Política de Privacidade</Link> *
                </Label>
              </div>
            </div>

            {/* Botão de envio */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary underline hover:no-underline">
                Fazer Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
