import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useSession, useSupabase } from './utils/supabase';
import { useNavigate } from 'react-router';
import { Logout } from '@mui/icons-material';

export const Account = () => {
    const supabase = useSupabase();
    const { loaded: sessionLoaded, session } = useSession();
    const navigate = useNavigate();

    const signOut = () => {
        supabase.auth.signOut();
        navigate('/');
    };

    if (!sessionLoaded) {
        return <>Loading</>;
    }
    else {
        return (
            <List>
                <ListItem>
                    <ListItemText primary={`Logged in as: ${session?.user.email}`}></ListItemText>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => signOut()}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText>Sign Out</ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        );
    }
};

export default Account;
