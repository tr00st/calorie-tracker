import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router';
import { PERSISTENT_MENU_WIDTH } from './Menu';
import { List as ListIcon, PersonOutline } from '@mui/icons-material';

const MenuBody = ({ onMenuItemSelected }: { onMenuItemSelected: { (): void } }) => {
    return (
        <List sx={{ width: PERSISTENT_MENU_WIDTH }}>
            <ListItem>
                <ListItemText slotProps={{ primary: { variant: 'h6' } }}>
                    Calorie Counter Xtreme
                </ListItemText>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/" onClick={onMenuItemSelected}>
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText>Log</ListItemText>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/account" onClick={onMenuItemSelected}>
                    <ListItemIcon>
                        <PersonOutline />
                    </ListItemIcon>
                    <ListItemText>Account</ListItemText>
                </ListItemButton>
            </ListItem>
        </List>
    );
};

export default MenuBody;
