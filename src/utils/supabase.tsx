/* eslint-disable react-refresh/only-export-components */

import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Database } from '../types/database.types';

type SupabaseContextData = {
    client: SupabaseClient;
};

const SupabaseContext = createContext<SupabaseContextData | null>(null);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const supabase = useMemo(() => createClient<Database>(supabaseUrl, supabaseKey), [supabaseUrl, supabaseKey]);

    return (
        <SupabaseContext.Provider value={{
            client: supabase,
        }}
        >
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);

    if (context === null) {
        throw new Error('Cannot use useSupabase without context provider');
    }

    return context.client;
};

export const useSession = () => {
    const [loaded, setLoaded] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const client = useSupabase();

    useEffect(() => {
        client.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoaded(true);
        });
        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, [client.auth]);

    return {
        loaded: loaded,
        session: session,
    };
};
