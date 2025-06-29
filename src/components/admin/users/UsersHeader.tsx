
import { Filter } from 'lucide-react';

interface UsersHeaderProps {
  totalUsers: number;
}

export const UsersHeader = ({ totalUsers }: UsersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
        <p className="text-gray-600 mt-1">{totalUsers} usuários registrados</p>
      </div>
    </div>
  );
};
