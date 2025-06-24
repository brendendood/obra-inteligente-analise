
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      className={`hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg glass-card h-full ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <CardHeader className="pb-4 flex-1">
        <div className={`bg-gradient-to-br ${gradient} p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 mb-4`}>
          {icon}
        </div>
        <CardTitle className="text-lg font-bold text-foreground leading-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default FeatureCard;
