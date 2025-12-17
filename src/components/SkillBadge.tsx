import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  variant?: 'matched' | 'missing' | 'extra';
}

const SkillBadge = ({ skill, variant = 'matched' }: SkillBadgeProps) => {
  const variantStyles = {
    matched: 'bg-success/10 text-success border-success/20',
    missing: 'bg-destructive/10 text-destructive border-destructive/20',
    extra: 'bg-info/10 text-info border-info/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all hover:scale-105',
        variantStyles[variant]
      )}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;
