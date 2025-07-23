
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileTab } from '@/components/account/ProfileTab';
import { SecurityTab } from '@/components/account/SecurityTab';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

const Account = () => {
  const { userData, loading } = useUserData();
  const [isLoading, setIsLoading] = useState(false);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Conta & Preferências</h1>
              <p className="text-slate-600">Gerencie suas informações pessoais e configurações</p>
            </div>
            <div className="text-right">
              <Badge 
                variant={userData.plan === 'free' ? 'secondary' : 'default'}
                className={`${userData.plan === 'enterprise' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : userData.plan === 'pro' ? 'bg-blue-600' : userData.plan === 'basic' ? 'bg-green-600' : ''}`}
              >
                <Crown className="h-3 w-3 mr-1" />
                {userData.plan === 'free' ? 'FREE' : userData.plan === 'basic' ? 'Basic' : userData.plan === 'pro' ? 'Pro' : 'Enterprise'}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileTab isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityTab isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Account;
