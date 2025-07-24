/**
 * Validação robusta de arquivos para upload
 * Garante integridade e segurança dos uploads
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  fileInfo?: {
    type: string;
    size: number;
    sizeFormatted: string;
    name: string;
  };
}

export interface UploadValidationConfig {
  maxSizeBytes: number;
  allowedTypes: string[];
  allowedExtensions: string[];
  maxFileNameLength: number;
}

// Configuração padrão robusta
const DEFAULT_CONFIG: UploadValidationConfig = {
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
  ],
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.txt', '.doc', '.docx'],
  maxFileNameLength: 255
};

// Helper para formatar tamanho de arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Verificação de extensão mais robusta
const getFileExtension = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return '';
  return fileName.substring(lastDot).toLowerCase();
};

// Verificação de tipo MIME mais rigorosa
const isMimeTypeValid = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Verificação de extensão de arquivo
const isExtensionValid = (fileName: string, allowedExtensions: string[]): boolean => {
  const extension = getFileExtension(fileName);
  return allowedExtensions.includes(extension);
};

// Validação de nome de arquivo
const isFileNameValid = (fileName: string, maxLength: number): { isValid: boolean; error?: string } => {
  if (!fileName || fileName.trim().length === 0) {
    return { isValid: false, error: 'Nome do arquivo não pode estar vazio' };
  }
  
  if (fileName.length > maxLength) {
    return { isValid: false, error: `Nome do arquivo muito longo (máximo ${maxLength} caracteres)` };
  }
  
  // Verificar caracteres perigosos
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (dangerousChars.test(fileName)) {
    return { isValid: false, error: 'Nome do arquivo contém caracteres inválidos' };
  }
  
  return { isValid: true };
};

// Validação específica para PDFs
const validatePDFStructure = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // Ler os primeiros bytes para verificar assinatura PDF
    const arrayBuffer = await file.slice(0, 1024).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = String.fromCharCode.apply(null, Array.from(uint8Array.slice(0, 8)));
    
    if (!header.startsWith('%PDF-')) {
      return { isValid: false, error: 'Arquivo PDF corrompido ou inválido' };
    }
    
    // Verificar se não está vazio
    if (file.size < 100) {
      return { isValid: false, error: 'Arquivo PDF muito pequeno ou corrompido' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Erro ao validar estrutura do PDF' };
  }
};

/**
 * Função principal de validação
 */
export const validateUploadFile = async (
  file: File | null, 
  config: Partial<UploadValidationConfig> = {}
): Promise<ValidationResult> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Verificação básica de arquivo
  if (!file) {
    return {
      isValid: false,
      error: 'Nenhum arquivo selecionado'
    };
  }
  
  console.log('🔍 VALIDATOR: Iniciando validação:', {
    name: file.name,
    type: file.type,
    size: file.size,
    sizeFormatted: formatFileSize(file.size)
  });
  
  const warnings: string[] = [];
  const fileInfo = {
    type: file.type,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    name: file.name
  };
  
  // 1. Validação de nome
  const nameValidation = isFileNameValid(file.name, finalConfig.maxFileNameLength);
  if (!nameValidation.isValid) {
    return {
      isValid: false,
      error: nameValidation.error,
      fileInfo
    };
  }
  
  // 2. Validação de tamanho
  if (file.size > finalConfig.maxSizeBytes) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${formatFileSize(finalConfig.maxSizeBytes)}`,
      fileInfo
    };
  }
  
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'Arquivo está vazio ou corrompido',
      fileInfo
    };
  }
  
  // 3. Validação de tipo MIME
  if (!isMimeTypeValid(file, finalConfig.allowedTypes)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${finalConfig.allowedExtensions.join(', ')}`,
      fileInfo
    };
  }
  
  // 4. Validação de extensão
  if (!isExtensionValid(file.name, finalConfig.allowedExtensions)) {
    return {
      isValid: false,
      error: `Extensão de arquivo não permitida. Extensões aceitas: ${finalConfig.allowedExtensions.join(', ')}`,
      fileInfo
    };
  }
  
  // 5. Validação específica para PDFs
  if (file.type === 'application/pdf') {
    const pdfValidation = await validatePDFStructure(file);
    if (!pdfValidation.isValid) {
      return {
        isValid: false,
        error: pdfValidation.error,
        fileInfo
      };
    }
  }
  
  // 6. Avisos baseados no tamanho
  if (file.size > 20 * 1024 * 1024) { // 20MB
    warnings.push('Arquivo grande detectado. O processamento pode demorar mais.');
  }
  
  if (file.size < 1024) { // 1KB
    warnings.push('Arquivo muito pequeno. Verifique se contém o conteúdo esperado.');
  }
  
  console.log('✅ VALIDATOR: Validação concluída:', {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    fileInfo
  });
  
  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    fileInfo
  };
};

/**
 * Validação de nome de projeto
 */
export const validateProjectName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Nome do projeto é obrigatório'
    };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: 'Nome do projeto deve ter pelo menos 3 caracteres'
    };
  }
  
  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Nome do projeto muito longo (máximo 100 caracteres)'
    };
  }
  
  // Verificar caracteres perigosos
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (dangerousChars.test(trimmed)) {
    return {
      isValid: false,
      error: 'Nome do projeto contém caracteres inválidos'
    };
  }
  
  return {
    isValid: true,
    fileInfo: {
      type: 'project-name',
      size: trimmed.length,
      sizeFormatted: `${trimmed.length} caracteres`,
      name: trimmed
    }
  };
};

/**
 * Validação combinada para upload completo
 */
export const validateCompleteUpload = async (
  file: File | null,
  projectName: string,
  config?: Partial<UploadValidationConfig>
): Promise<{
  fileValidation: ValidationResult;
  nameValidation: ValidationResult;
  isValid: boolean;
  combinedError?: string;
}> => {
  const fileValidation = await validateUploadFile(file, config);
  const nameValidation = validateProjectName(projectName);
  
  const isValid = fileValidation.isValid && nameValidation.isValid;
  
  let combinedError: string | undefined;
  if (!isValid) {
    const errors = [
      !fileValidation.isValid ? fileValidation.error : null,
      !nameValidation.isValid ? nameValidation.error : null
    ].filter(Boolean);
    
    combinedError = errors.join(' | ');
  }
  
  return {
    fileValidation,
    nameValidation,
    isValid,
    combinedError
  };
};