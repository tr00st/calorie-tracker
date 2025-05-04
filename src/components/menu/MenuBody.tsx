import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router';
import { PERSISTENT_MENU_WIDTH } from './Menu';

const MenuBody = ({ onMenuItemSelected }: { onMenuItemSelected: { (): void } }) => {
    return (
        <List sx={{ width: PERSISTENT_MENU_WIDTH }}>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/" onClick={onMenuItemSelected}>
                    <ListItemText>Log</ListItemText>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/account" onClick={onMenuItemSelected}>
                    <ListItemText>Account</ListItemText>
                </ListItemButton>
            </ListItem>
        </List>
    );
};

export default MenuBody;
