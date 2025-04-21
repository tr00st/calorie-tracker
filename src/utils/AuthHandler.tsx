import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Session } from '@supabase/supabase-js'
import { useSupabase } from './supabase'

export default function AuthHandler({ children }: { children: React.ReactNode }) {
    const [loaded, setLoaded] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const client = useSupabase();

    useEffect(() => {
        client.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoaded(true);
        })
        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
        return () => subscription.unsubscribe()
    }, []);

    console.log(session);

    if (!loaded) {
        return <div>Loading...</div>;
    } else if (!session) {
        return (<Auth supabaseClient={client} appearance={{ theme: ThemeSupa }} />)
    }
    else {
        return <>{children}</>;
    }
}