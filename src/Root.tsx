import { AppBar, CssBaseline, IconButton, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
    Outlet,
} from 'react-router';
import Menu, { PERSISTENT_MENU_WIDTH } from './components/menu/Menu';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';

const Root = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    return (
        <Stack sx={{ minHeight: '100vh' }}>
            <CssBaseline />
            <Menu mobileMenuOpen={mobileMenuOpen} onMobileMenuClose={() => setMobileMenuOpen(false)} />
            <Stack sx={{
                marginLeft: isMobile ? null : PERSISTENT_MENU_WIDTH,
                flexGrow: '1',
            }}
            >
                {isMobile && (
                    <AppBar position="sticky" enableColorOnDark>
                        <Toolbar sx={{ gap: 1 }}>
                            <IconButton color="inherit" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Calorie Counter
                            </Typography>
                        </Toolbar>
                    </AppBar>
                )}
                <Outlet />
            </Stack>
        </Stack>
    );
};

export default Root;
