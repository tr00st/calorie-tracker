import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabase } from './supabase'

export default function AuthHandler({ children }: { children: React.ReactNode }) {
    const { loaded, session } = useSession();
    const supabase = useSupabase();

    if (!loaded) {
        return <div>Loading...</div>;
    } else if (!session) {
        return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
    else {
        return <>{children}</>;
    }
}