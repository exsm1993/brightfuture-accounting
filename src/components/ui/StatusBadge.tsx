import { cn } from '@/lib/utils';
import { PayableStatus } from '@/types/finance';

interface StatusBadgeProps {
  status: PayableStatus | string;
  size?: 'sm' | 'default';
}

export const StatusBadge = ({ status, size = 'default' }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Paid':
      case 'Completed':
        return 'bg-success/10 text-success border-success/20';
      case 'Ready':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
      case 'In Progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Hold':
      case 'Cancelled':
      case 'Failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Signed':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        getStatusStyles(),
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {status}
    </span>
  );
};
