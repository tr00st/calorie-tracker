/* eslint-disable react-refresh/only-export-components */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext } from 'react';

type SupabaseContextData = {
    client: SupabaseClient
};

const SupabaseContext = createContext<SupabaseContextData | null>(null);

export const SupabaseProvider = ({ children } : { children : React.ReactNode}) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    return <SupabaseContext.Provider value={{
        client: supabase
    }}>
        {children}
    </SupabaseContext.Provider>
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    
    if (context === null) {
        throw new Error("Cannot use useSupabase without context provider");
    }

    return context.client;
};
