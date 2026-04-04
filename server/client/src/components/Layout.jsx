import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { WhatsAppButton } from './WhatsAppButton';
import GlobalVoiceAssistant from './GlobalVoiceAssistant';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, Wifi, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Layout = ({ children }) => {
    const { user } = useAuth();
    const [profileIncomplete, setProfileIncomplete] = React.useState(false);
    const [loadingProfile, setLoadingProfile] = React.useState(true);
    const { t } = useLanguage();

    React.useEffect(() => {
        const checkProfile = async () => {
            if (user) {
                try {
                    const { data } = await api.getProfile(user.id);
                    setProfileIncomplete(!data?.location);
                } catch {
                    setProfileIncomplete(false);
                }
            }
            setLoadingProfile(false);
        };
        checkProfile();
    }, [user]);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                <Header />

                {/* Profile Incomplete Alert */}
                {profileIncomplete && !loadingProfile && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-2 min-w-0">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">
                                Complete your profile to get personalised weather &amp; advisory
                            </span>
                        </div>
                        <Link
                            to="/profile"
                            className="flex-shrink-0 bg-white text-orange-600 hover:bg-orange-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Complete Now
                        </Link>
                    </div>
                )}

                {/* Offline sync cue */}
                <div className="hidden md:flex items-center gap-2 px-6 py-1.5 bg-kissan-green-pale dark:bg-green-950/40 border-b border-kissan-green/10 dark:border-green-800/30 text-xs text-kissan-green dark:text-green-400 font-medium">
                    <Wifi className="w-3 h-3" />
                    <span>Live Data</span>
                    <span className="text-gray-400 dark:text-gray-600 mx-1">·</span>
                    <Clock className="w-3 h-3 text-gray-400 dark:text-gray-600" />
                    <span className="text-gray-400 dark:text-gray-600">Last synced: just now</span>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>

                {/* Global Voice Assistant */}
                <GlobalVoiceAssistant />
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav />

            {/* WhatsApp Floating Button */}
            <WhatsAppButton bottomOffset="bottom-24 md:bottom-8" />
        </div>
    );
};
