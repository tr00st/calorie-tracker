import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabase } from './supabase';
import { Box, Typography } from '@mui/material';

export default function AuthHandler({ children }: { children: React.ReactNode }) {
    const { loaded, session } = useSession();
    const supabase = useSupabase();

    if (!loaded) {
        return <div>Loading...</div>;
    }
    else if (!session) {
        return (
            <Box>
                <Typography variant="h5">
                    Calorie Tracker Xtreme
                </Typography>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google']} // Disable third-party auth
                    showLinks={false} // Disable registration etc
                />
            </Box>
        );
    }
    else {
        return <>{children}</>;
    }
}
