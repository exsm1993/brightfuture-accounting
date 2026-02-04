import { cn } from '@/lib/utils';
import { BusinessLineType } from '@/types/finance';

interface BusinessLineBadgeProps {
  businessLine: BusinessLineType | string;
}

export const BusinessLineBadge = ({ businessLine }: BusinessLineBadgeProps) => {
  const isSolar = businessLine === 'Solar';
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        isSolar 
          ? 'bg-solar/10 text-solar' 
          : 'bg-home-improvement/10 text-home-improvement'
      )}
    >
      {businessLine}
    </span>
  );
};
