
import { useUserData } from '@/hooks/useUserData';
import { getPlanDisplayName } from '@/utils/planUtils';

export const MemberFooter = () => {
  const { userData } = useUserData();
  
  return (
    <footer className="bg-white border-t border-slate-200/60 px-6 py-4 text-center">
      <p className="text-xs text-slate-500">
        MadenAI v2.0 | Plano: {getPlanDisplayName(userData.plan)} | 
        Projetos: {userData.projectCount} | 
        © 2024 MadenAI - Todos os direitos reservados
      </p>
    </footer>
  );
};
