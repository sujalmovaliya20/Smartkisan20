import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X, Sprout, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/translations';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export const Header = () => {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <>
            <header
                className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-sm"
                role="banner"
            >
                {/* Left: Mobile hamburger + Logo */}
                <div className="flex items-center gap-3">
                    <button
                        id="mobile-menu-btn"
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-tap-highlight"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
                    </button>

                    {/* Mobile Logo */}
                    <Link to="/" className="md:hidden flex items-center gap-2 no-tap-highlight">
                        <div className="w-8 h-8 rounded-lg bg-kissan-green flex items-center justify-center">
                            <Sprout className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-base">Smart Kissan</span>
                    </Link>

                    {/* Desktop page title / search */}
                    <div className="hidden md:flex items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search crops, prices, schemes..."
                                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-64
                                           focus:outline-none focus:border-kissan-green focus:bg-white transition-all"
                                aria-label="Search"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Language + Notifications + Avatar */}
                <div className="flex items-center gap-2">
                    {/* Language chips (desktop only) */}
                    <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={cn(
                                    'px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 no-tap-highlight',
                                    language === lang.code
                                        ? 'bg-white text-kissan-green shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                )}
                                aria-label={`Switch to ${lang.name}`}
                                aria-pressed={language === lang.code}
                            >
                                {lang.native}
                            </button>
                        ))}
                    </div>

                    {/* Notifications */}
                    <button
                        id="notification-btn"
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-tap-highlight"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-kissan-amber rounded-full" aria-hidden="true" />
                    </button>

                    {/* User Avatar */}
                    <Link
                        to="/profile"
                        id="user-avatar-btn"
                        className="w-9 h-9 bg-kissan-green-pale border-2 border-kissan-green/30 text-kissan-green
                                   rounded-full flex items-center justify-center font-bold text-sm
                                   hover:border-kissan-green transition-all no-tap-highlight"
                        aria-label="Go to profile"
                    >
                        {initial}
                    </Link>
                </div>
            </header>

            {/* Mobile Slide-in Sidebar Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/40 z-40 animate-fade-in"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="md:hidden fixed top-0 left-0 h-full w-72 z-50 animate-slide-up"
                         style={{ transform: 'none' }}>
                        <Sidebar />
                    </div>
                </>
            )}
        </>
    );
};
