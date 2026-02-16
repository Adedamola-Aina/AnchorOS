// @ts-nocheck
import React from 'react';
import {
    ShoppingBag,
    ShoppingCart,
    Car,
    Home,
    Zap,
    Briefcase,
    Tag,
    Heart,
    Film,
    Plane,
    GraduationCap,
    TrendingUp,
    ArrowLeftRight,
    RefreshCw,
    Coffee,
    Utensils,
    type LucideIcon
} from 'lucide-react';

interface CategoryIconProps {
    category: string;
    className?: string;
    size?: number;
}

const CATEGORY_MAP: Record<string, { icon: LucideIcon; color: string }> = {
    food: { icon: Utensils, color: 'text-orange-500 bg-orange-500/10' },
    groceries: { icon: ShoppingCart, color: 'text-green-500 bg-green-500/10' },
    dining: { icon: Coffee, color: 'text-amber-500 bg-amber-500/10' },
    transport: { icon: Car, color: 'text-primary-500 bg-primary-500/10' },
    housing: { icon: Home, color: 'text-primary-500 bg-primary-500/10' },
    rent: { icon: Home, color: 'text-primary-500 bg-primary-500/10' },
    utilities: { icon: Zap, color: 'text-yellow-500 bg-yellow-500/10' },
    salary: { icon: Briefcase, color: 'text-finance-500 bg-finance-500/10' },
    income: { icon: Briefcase, color: 'text-finance-500 bg-finance-500/10' },
    investments: { icon: TrendingUp, color: 'text-finance-500 bg-finance-500/10' },
    health: { icon: Heart, color: 'text-rose-500 bg-rose-500/10' },
    'personal care': { icon: Heart, color: 'text-pink-500 bg-pink-500/10' },
    entertainment: { icon: Film, color: 'text-purple-500 bg-purple-500/10' },
    travel: { icon: Plane, color: 'text-cyan-500 bg-cyan-500/10' },
    education: { icon: GraduationCap, color: 'text-slate-500 bg-slate-500/10' },
    shopping: { icon: ShoppingBag, color: 'text-primary-500 bg-primary-500/10' },
    transfer: { icon: ArrowLeftRight, color: 'text-slate-500 bg-slate-500/10' },
    conversion: { icon: RefreshCw, color: 'text-slate-500 bg-slate-500/10' },
    general: { icon: Tag, color: 'text-slate-400 bg-slate-400/10' },
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = '', size = 16 }) => {
    const normalized = category.toLowerCase();
    const config = CATEGORY_MAP[normalized] || CATEGORY_MAP.general;
    const Icon = config.icon;

    return (
        <div className={`p-2 rounded-lg ${config.color} ${className}`}>
            <Icon size={size} strokeWidth={2.5} />
        </div>
    );
};
