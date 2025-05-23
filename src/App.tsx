import './index.css';
import LogView from './screens/log/LogView';
import { SupabaseProvider } from './utils/supabase';
import {
    createHashRouter,
    RouterProvider,
} from 'react-router';
import AuthHandler from './utils/AuthHandler';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import Account from './Account';
import Root from './Root';
import { createTheme, ThemeProvider } from '@mui/material';
import FoodsView from './screens/foods/FoodsView';
import AboutView from './screens/about/AboutView';
import ReactQueryHandler from './utils/ReactQueryHandler';

const router = createHashRouter([
    {
        path: '/',
        Component: Root,
        children: [
            {
                index: true,
                Component: LogView,
            },
            {
                path: '/foods',
                Component: FoodsView,
            },
            {
                path: '/account',
                Component: Account,
            },
            {
                path: '/about',
                Component: AboutView,
            },
        ],
    },
]);

const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
});

export default function App() {
    return (
        <SupabaseProvider>
            <ReactQueryHandler>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <AuthHandler>
                            <RouterProvider router={router} />
                        </AuthHandler>
                    </LocalizationProvider>
                </ThemeProvider>
            </ReactQueryHandler>
        </SupabaseProvider>
    );
}
