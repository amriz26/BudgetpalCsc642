import { Coffee, Car, Film, Zap, ShoppingBag, Heart, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  'Food': {
    icon: Coffee,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  'Transportation': {
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  'Entertainment': {
    icon: Film,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  'Bills': {
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  'Shopping': {
    icon: ShoppingBag,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  'Health': {
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  'Other': {
    icon: MoreHorizontal,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};

export function getCategoryConfig(category: string): CategoryConfig {
  return categoryConfigs[category] || categoryConfigs['Other'];
}
