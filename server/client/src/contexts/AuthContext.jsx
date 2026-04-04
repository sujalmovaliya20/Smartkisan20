import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * signUp — creates Supabase auth user with metadata,
     * then upserts the profiles row with all collected fields.
     * The DB trigger auto-inserts full_name from raw_user_meta_data,
     * but we also upsert to ensure location & farming_type are saved.
     */
    const signUp = async (email, password, metadata = {}) => {
        const { full_name = '', location = '', farming_type = '' } = metadata;

        // 1. Create the auth user (passes metadata to DB trigger)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name, location, farming_type },
            },
        });

        if (error || !data?.user) return { data, error };

        // 2. Upsert profile so all fields are populated immediately
        await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            full_name,
            location,
            farming_type,
            updated_at: new Date().toISOString(),
        });

        return { data, error };
    };

    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = () => {
        return supabase.auth.signOut();
    };

    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    skipBrowserRedirect: true,
                },
            });

            return { data, error };
        } catch (err) {
            console.error('AuthContext: signInWithOAuth exception', err);
            return { error: err };
        }
    };

    const value = {
        session,
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
