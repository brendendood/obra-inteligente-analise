
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  gradient?: string;
  disabled?: boolean;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  gradient = "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
  disabled = false 
}: FeatureCardProps) => {
  return (
    <Card 
      className={`feature-card card-hover cursor-pointer group h-full dark:bg-[#1a1a1a] dark:border-[#333] ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <CardHeader className="pb-4 flex-1">
        <div className={`bg-gradient-to-br ${gradient} p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 mb-4`}>
          {icon}
        </div>
        <CardTitle className="text-lg font-bold text-foreground dark:text-[#f2f2f2] leading-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-[#bbbbbb] leading-relaxed text-sm">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default FeatureCard;
