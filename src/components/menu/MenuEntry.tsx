import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router';
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

export default MenuEntry;
