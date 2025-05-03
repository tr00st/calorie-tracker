import './index.css'
import LogView from './screens/log-view/LogView'
import { SupabaseProvider } from './utils/supabase'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import AuthHandler from './utils/AuthHandler';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import Account from './Account';
import Root from './Root';
import { createTheme, ThemeProvider } from '@mui/material';

const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: LogView,
            },
            {
                path: "/account",
                Component: Account
            }
        ]
    }
], {
    basename: import.meta.env.BASE_URL
});

const theme = createTheme({
    colorSchemes: {
        dark: true
    }
});

export default function App() {
    return <SupabaseProvider>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <AuthHandler>
                    <RouterProvider router={router} />
                </AuthHandler>
            </LocalizationProvider>
        </ThemeProvider>
    </SupabaseProvider>;
}
