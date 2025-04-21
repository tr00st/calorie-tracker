import './index.css'
import LogView from './LogView'
import { SupabaseProvider } from './utils/supabase'
import { AppBar, CssBaseline, Toolbar, Typography } from '@mui/material';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import AuthHandler from './utils/AuthHandler';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const router = createBrowserRouter([
    {
        path: "/",
        element: <LogView />,
    },
], {
    basename: import.meta.env.BASE_URL
});

export default function App() {
    return <SupabaseProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Calorie Counter Xtreme
                    </Typography>
                </Toolbar>
            </AppBar>
            <CssBaseline />
            <AuthHandler>
                <RouterProvider router={router} />
            </AuthHandler>
        </LocalizationProvider>
    </SupabaseProvider>;
}
