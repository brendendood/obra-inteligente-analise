import DOMPurify from 'dompurify';

/**
 * Content sanitization utilities to prevent XSS attacks
 */

// Configuration for different content types
const AI_RESPONSE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
  ALLOWED_ATTR: ['class'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onkeydown', 'onkeyup']
};

const USER_INPUT_CONFIG = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true
};

/**
 * Sanitize AI-generated content that may contain basic HTML formatting
 */
export const sanitizeAIContent = (content: string): string => {
  if (!content) return '';
  
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: AI_RESPONSE_CONFIG.ALLOWED_TAGS,
    ALLOWED_ATTR: AI_RESPONSE_CONFIG.ALLOWED_ATTR,
    FORBID_TAGS: AI_RESPONSE_CONFIG.FORBID_TAGS,
    FORBID_ATTR: AI_RESPONSE_CONFIG.FORBID_ATTR,
    KEEP_CONTENT: true,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false
  });
};

/**
 * Sanitize user input by stripping all HTML tags but keeping text content
 */
export const sanitizeUserInput = (input: string): string => {
  if (!input) return '';
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: USER_INPUT_CONFIG.ALLOWED_TAGS,
    ALLOWED_ATTR: USER_INPUT_CONFIG.ALLOWED_ATTR,
    KEEP_CONTENT: USER_INPUT_CONFIG.KEEP_CONTENT,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false
  });
};

/**
 * Create safe text content using DOM TextContent API (most secure for plain text)
 */
export const createSafeTextContent = (text: string): string => {
  if (!text) return '';
  
  // Create a temporary DOM element to safely extract text content
  const div = document.createElement('div');
  div.textContent = text;
  return div.textContent || '';
};

/**
 * Safely render formatted text with line breaks preserved
 */
export const renderSafeFormattedText = (text: string): string => {
  if (!text) return '';
  
  // First sanitize as plain text, then convert line breaks to <br> tags
  const safeText = createSafeTextContent(text);
  return safeText.replace(/\n/g, '<br>');
};

/**
 * Check if content contains potentially dangerous elements
 */
export const containsDangerousContent = (content: string): boolean => {
  if (!content) return false;
  
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /data:text\/html/i
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(content));
};

/**
 * Validate and sanitize file upload content
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return '';
  
  // Remove path traversal attempts and dangerous characters
  return fileName
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\.+/, '')
    .trim();
};