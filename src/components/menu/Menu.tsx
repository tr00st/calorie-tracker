import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import MenuBody from './MenuBody';

export const PERSISTENT_MENU_WIDTH = '20rem';

const Menu = ({ mobileMenuOpen, onMobileMenuClose } : { mobileMenuOpen : boolean, onMobileMenuClose : {(): void} }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return <Drawer variant='temporary' open={mobileMenuOpen} onClose={() => onMobileMenuClose()} >
            <MenuBody onMenuItemSelected={() => onMobileMenuClose()} />
        </Drawer>;
    } else {
        return <Drawer variant='permanent' sx={{width: PERSISTENT_MENU_WIDTH}}>
            <MenuBody onMenuItemSelected={() => null} />
        </Drawer>;
    }
};

export default Menu;
