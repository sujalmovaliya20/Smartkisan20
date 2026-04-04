import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CloudSun, Sprout, Store, Map,
    MessageCircle, FileText, User, Settings, LogOut,
    ShoppingBag, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV_GROUPS = [
    {
        label: 'Main',
        items: [
            { icon: LayoutDashboard, labelKey: 'dashboard', path: '/' },
            { icon: CloudSun, labelKey: 'weather', path: '/weather' },
            { icon: Sprout, labelKey: 'crop_health', path: '/crop-health' },
            { icon: Store, labelKey: 'market', path: '/market' },
            { icon: ShoppingBag, labelKey: 'marketplace', path: '/marketplace' },
        ]
    },
    {
        label: 'More',
        items: [
            { icon: Map, labelKey: 'my_plots', path: '/plots' },
            { icon: MessageCircle, labelKey: 'expert_chat', path: '/expert-chat' },
            { icon: FileText, labelKey: 'schemes', path: '/schemes' },
        ]
    },
    {
        label: 'Account',
        items: [
            { icon: User, labelKey: 'profile', path: '/profile' },
            { icon: Settings, labelKey: 'settings', path: '/settings' },
        ]
    }
];

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { t } = useLanguage();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/auth');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside
            className="w-64 hidden md:flex flex-col h-screen fixed left-0 top-0 z-50"
            style={{ background: 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 60%, #1a5928 100%)' }}
            aria-label="Sidebar navigation"
        >
            {/* Logo */}
            <div className="p-5 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-none">Smart Kissan</h2>
                        <p className="text-xs text-green-200/70 mt-0.5">स्मार्ट किसान</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" aria-label="Main navigation">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-green-300/50">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.path);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative no-tap-highlight',
                                            active
                                                ? 'bg-white/20 text-white shadow-sm'
                                                : 'text-green-100/70 hover:bg-white/10 hover:text-white'
                                        )}
                                        aria-current={active ? 'page' : undefined}
                                    >
                                        {active && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-kissan-amber rounded-r-full" />
                                        )}
                                        <Icon className={cn(
                                            'w-5 h-5 flex-shrink-0 transition-colors',
                                            active ? 'text-white' : 'text-green-200/60 group-hover:text-white'
                                        )} />
                                        <span className="flex-1">{t(item.labelKey)}</span>
                                        {active && <ChevronRight className="w-4 h-4 text-white/50" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom: Logout */}
            <div className="p-3 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-green-100/70
                               hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200 group no-tap-highlight"
                    aria-label={t('logout')}
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-300 transition-colors" />
                    {t('logout')}
                </button>
            </div>
        </aside>
    );
};
