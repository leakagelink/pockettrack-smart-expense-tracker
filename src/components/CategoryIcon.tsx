import { icons } from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 16, md: 20, lg: 24 };
const wrapperSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };

export default function CategoryIcon({ iconName, color, size = 'md' }: CategoryIconProps) {
  const Icon = (icons as Record<string, any>)[iconName] || icons['CircleDot'];

  return (
    <div
      className={`${wrapperSizes[size]} rounded-xl flex items-center justify-center`}
      style={{ backgroundColor: `hsl(${color} / 0.15)` }}
    >
      <Icon size={sizes[size]} style={{ color: `hsl(${color})` }} />
    </div>
  );
}
