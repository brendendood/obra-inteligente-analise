// Security validation utilities for MadeAI
export const validateUserInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove dangerous characters and limit length
  const cleaned = input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>'"]/g, '') // Remove potential XSS characters
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  return cleaned;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Brazilian phone number format
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateProjectName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100 && /^[a-zA-Z0-9\s\-_À-ÿ]+$/.test(name);
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 255);
};

export const validateFileSize = (size: number, maxSizeInMB: number = 50): boolean => {
  return size <= maxSizeInMB * 1024 * 1024;
};

export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

// Rate limiting utility
export class RateLimiter {
  private attempts = new Map<string, { count: number; timestamp: number }>();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);
    
    if (!attempt || now - attempt.timestamp > this.windowMs) {
      this.attempts.set(identifier, { count: 1, timestamp: now });
      return true;
    }
    
    if (attempt.count >= this.maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// IP validation
export const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Security headers validation
export const validateSecurityHeaders = (headers: Record<string, string>): boolean => {
  const requiredHeaders = ['user-agent', 'origin'];
  return requiredHeaders.every(header => headers[header]?.length > 0);
};