import { AppBar, Button, CssBaseline, Link, Toolbar, Typography } from '@mui/material';
import {
    Outlet,
    Link as RouterLink,
} from "react-router";

const Root = () => {
    return <>
        <CssBaseline />
        <AppBar position='static'>
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
        <Outlet />
    </>;
};

export default Root;
