import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricTileProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

const tileVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.45, 
      ease: "easeOut" as const
    } 
  },
};

export const MetricTile = ({ title, value, icon: Icon, className = "" }: MetricTileProps) => {
  return (
    <motion.div
      variants={tileVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`group rounded-2xl border border-primary/20 bg-primary/10 p-4 transition-all duration-300 hover:shadow-md flex flex-col justify-center items-center text-center ${className}`}
    >
      <div className="text-2xl font-bold tracking-tight text-foreground mb-2 line-clamp-2">
        {value}
      </div>
      <div className="flex items-center justify-center space-x-1">
        {Icon && (
          <Icon className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        )}
        <span className="text-xs text-muted-foreground line-clamp-2 leading-tight">{title}</span>
      </div>
    </motion.div>
  );
};