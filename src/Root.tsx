import { AppBar, Box, CssBaseline, IconButton, Link, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
    Outlet,
    Link as RouterLink,
} from 'react-router';
import Menu, { PERSISTENT_MENU_WIDTH } from './components/menu/Menu';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';

const Root = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    return (
        <>
            <CssBaseline />
            <Menu mobileMenuOpen={mobileMenuOpen} onMobileMenuClose={() => setMobileMenuOpen(false)} />
            <Box sx={{
                marginLeft: isMobile ? null : PERSISTENT_MENU_WIDTH,
            }}
            >
                <AppBar position="sticky" enableColorOnDark>
                    <Toolbar sx={{ gap: 1 }}>
                        {isMobile && (
                            <IconButton color="inherit" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <MenuIcon />
                            </IconButton>
                        ) }
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link component={RouterLink} underline="none" color="inherit" to="/">
                                Calorie Counter Xtreme
                            </Link>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </Box>
        </>
    );
};

export default Root;
