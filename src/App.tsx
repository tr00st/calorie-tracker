import './index.css'
import LogView from './LogView'
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

export default function App() {
    return <SupabaseProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <AuthHandler>
                <RouterProvider router={router} />
            </AuthHandler>
        </LocalizationProvider>
    </SupabaseProvider>;
}
