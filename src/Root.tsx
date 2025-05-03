import { AppBar, Box, Button, CssBaseline, Link, Toolbar, Typography } from '@mui/material';
import {
    Outlet,
    Link as RouterLink,
} from "react-router";

const Root = () => {
    return <>
        <CssBaseline />
        <AppBar position='fixed' enableColorOnDark>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link component={RouterLink} underline='none' color="inherit" to="/">
                        Calorie Counter Xtreme
                    </Link>
                </Typography>
                <Button component={RouterLink} color="inherit" to="/account">
                    Account
                </Button>
            </Toolbar>
        </AppBar>
        <Box sx={{marginTop: '4em'}}>
            <Outlet />
        </Box>
    </>;
};

export default Root;
