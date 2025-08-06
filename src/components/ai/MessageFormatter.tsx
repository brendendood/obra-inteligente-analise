
import DOMPurify from 'dompurify';

interface MessageFormatterProps {
  content: string;
  className?: string;
}

export const MessageFormatter = ({ content, className = "" }: MessageFormatterProps) => {
  // Parse markdown-like formatting to HTML
  const formatMessage = (text: string): string => {
    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHTML = DOMPurify.sanitize(formatMessage(content), {
    ALLOWED_TAGS: ['strong', 'em', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });

  return (
    <div 
      className={`whitespace-pre-wrap break-words leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};
