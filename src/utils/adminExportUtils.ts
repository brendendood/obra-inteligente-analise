import * as XLSX from 'xlsx';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_sign_in_at?: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  tags?: string[];
  city?: string;
  state?: string;
  country?: string;
  company?: string;
  phone?: string;
}

export interface LoginHistoryRecord {
  id: string;
  user_id: string;
  login_at: string;
  ip_address?: string;
  city?: string;
  region?: string;
  country?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  latitude?: number;
  longitude?: number;
}

export const exportUsersToExcel = (users: AdminUser[]) => {
  try {
    const mainData = [
      ['RELATÓRIO DE USUÁRIOS - MADENAI'],
      [''],
      ['Gerado em:', new Date().toLocaleString('pt-BR')],
      ['Total de usuários:', users.length.toString()],
      [''],
      ['DADOS DOS USUÁRIOS'],
      ['ID', 'Email', 'Nome Completo', 'Plano', 'Status', 'Empresa', 'Telefone', 'Cidade', 'Estado', 'País', 'Tags', 'Criado em', 'Último Login'],
      ...users.map(user => [
        user.id,
        user.email,
        user.full_name || '',
        user.plan,
        user.status,
        user.company || '',
        user.phone || '',
        user.city || '',
        user.state || '',
        user.country || '',
        user.tags?.join(', ') || '',
        new Date(user.created_at).toLocaleString('pt-BR'),
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(mainData);
    
    // Configurar larguras das colunas
    ws['!cols'] = [
      { wch: 25 }, // ID
      { wch: 30 }, // Email
      { wch: 25 }, // Nome
      { wch: 10 }, // Plano
      { wch: 12 }, // Status
      { wch: 20 }, // Empresa
      { wch: 15 }, // Telefone
      { wch: 15 }, // Cidade
      { wch: 15 }, // Estado
      { wch: 15 }, // País
      { wch: 20 }, // Tags
      { wch: 20 }, // Criado em
      { wch: 20 }  // Último Login
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuários');
    
    const filename = `Usuarios_MadenAI_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao exportar usuários para Excel:', error);
    return { success: false, error: 'Erro ao gerar arquivo Excel' };
  }
};

export const exportUsersToCSV = (users: AdminUser[]) => {
  try {
    // UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    
    const headers = ['ID', 'Email', 'Nome Completo', 'Plano', 'Status', 'Empresa', 'Telefone', 'Cidade', 'Estado', 'País', 'Tags', 'Criado em', 'Último Login'];
    const rows = users.map(user => [
      user.id,
      user.email,
      `"${(user.full_name || '').replace(/"/g, '""')}"`,
      user.plan,
      user.status,
      `"${(user.company || '').replace(/"/g, '""')}"`,
      user.phone || '',
      user.city || '',
      user.state || '',
      user.country || '',
      `"${(user.tags?.join(', ') || '').replace(/"/g, '""')}"`,
      new Date(user.created_at).toLocaleString('pt-BR'),
      user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca'
    ]);

    const csvContent = [
      `Relatório de Usuários - MadenAI;;;;;;;;;;;;;`,
      `Gerado em: ${new Date().toLocaleString('pt-BR')};;;;;;;;;;;;;`,
      `Total: ${users.length} usuários;;;;;;;;;;;;;`,
      '',
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Usuarios_MadenAI_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    return { success: true, filename: link.download };
  } catch (error) {
    console.error('Erro ao exportar usuários para CSV:', error);
    return { success: false, error: 'Erro ao gerar arquivo CSV' };
  }
};

export const exportLoginHistoryToExcel = (loginHistory: LoginHistoryRecord[]) => {
  try {
    const mainData = [
      ['HISTÓRICO DE LOGINS - MADENAI'],
      [''],
      ['Gerado em:', new Date().toLocaleString('pt-BR')],
      ['Total de registros:', loginHistory.length.toString()],
      [''],
      ['HISTÓRICO DE LOGINS'],
      ['Data/Hora', 'ID do Usuário', 'IP', 'Cidade', 'Estado', 'País', 'Dispositivo', 'Navegador', 'Sistema', 'Latitude', 'Longitude'],
      ...loginHistory.map(login => [
        new Date(login.login_at).toLocaleString('pt-BR'),
        login.user_id,
        login.ip_address || '',
        login.city || '',
        login.region || '',
        login.country || '',
        login.device_type || '',
        login.browser || '',
        login.os || '',
        login.latitude?.toString() || '',
        login.longitude?.toString() || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(mainData);
    
    // Configurar larguras das colunas
    ws['!cols'] = [
      { wch: 20 }, // Data/Hora
      { wch: 25 }, // ID do Usuário
      { wch: 15 }, // IP
      { wch: 15 }, // Cidade
      { wch: 15 }, // Estado
      { wch: 15 }, // País
      { wch: 12 }, // Dispositivo
      { wch: 15 }, // Navegador
      { wch: 12 }, // Sistema
      { wch: 12 }, // Latitude
      { wch: 12 }  // Longitude
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Logins');
    
    const filename = `Historico_Logins_MadenAI_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao exportar histórico para Excel:', error);
    return { success: false, error: 'Erro ao gerar arquivo Excel' };
  }
};