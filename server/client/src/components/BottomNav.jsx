import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, TrendingUp, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV_ITEMS = [
    { icon: LayoutDashboard, labelKey: 'dashboard', path: '/', id: 'nav-home' },
    { icon: Sprout, labelKey: 'crop_health', path: '/crop-health', id: 'nav-advisory' },
    { icon: TrendingUp, labelKey: 'market', path: '/market', id: 'nav-prices' },
    { icon: ShoppingBag, labelKey: 'marketplace', path: '/marketplace', id: 'nav-marketplace' },
    { icon: User, labelKey: 'profile', path: '/profile', id: 'nav-profile' },
];

export const BottomNav = () => {
    const location = useLocation();
    const { t } = useLanguage();

    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-bottom-nav"
            style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
            aria-label="Bottom navigation"
        >
            <div className="flex items-stretch">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            id={item.id}
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 no-tap-highlight',
                                'transition-all duration-200 relative',
                                isActive ? 'text-kissan-green' : 'text-gray-400 hover:text-gray-600'
                            )}
                            aria-label={t(item.labelKey)}
                        >
                            {/* Active pill indicator */}
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-kissan-green" />
                            )}

                            <div className={cn(
                                'rounded-xl p-1.5 transition-all duration-200',
                                isActive ? 'bg-kissan-green-pale' : ''
                            )}>
                                <Icon className={cn(
                                    'w-5 h-5 transition-all duration-200',
                                    isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                                )} />
                            </div>

                            <span className={cn(
                                'text-[10px] font-medium leading-tight text-center',
                                isActive ? 'font-semibold' : ''
                            )}>
                                {t(item.labelKey)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
