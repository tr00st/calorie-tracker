import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router';
import { PERSISTENT_MENU_WIDTH } from './Menu';
import { FoodBank, List as ListIcon, PersonOutline } from '@mui/icons-material';
import { ReactNode } from 'react';

const MenuEntry = ({
    href,
    label,
    icon,
    onClick,
}: {
    href: string;
    label: string;
    icon: ReactNode | null;
    onClick: () => void;
}) => {
    const location = useLocation();
    const isCurrent = matchPath(href, location.pathname) !== null;
    return (
        <ListItem disablePadding>
            <ListItemButton component={Link} to={href} onClick={onClick} selected={isCurrent}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
            </ListItemButton>
        </ListItem>
    );
};

const MenuBody = ({ onMenuItemSelected }: { onMenuItemSelected: { (): void } }) => {
    return (
        <List sx={{ width: PERSISTENT_MENU_WIDTH }}>
            <ListItem>
                <ListItemText slotProps={{ primary: { variant: 'h6' } }}>
                    Calorie Counter
                </ListItemText>
            </ListItem>
            <MenuEntry href="/" label="Log" icon={<ListIcon />} onClick={onMenuItemSelected} />
            <MenuEntry href="/foods" label="Foods" icon={<FoodBank />} onClick={onMenuItemSelected} />
            <Divider />
            <MenuEntry href="/account" label="Account" icon={<PersonOutline />} onClick={onMenuItemSelected} />
        </List>
    );
};

export default MenuBody;
