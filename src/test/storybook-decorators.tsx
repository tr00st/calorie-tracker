import { Decorator } from '@storybook/react';
import { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createMockDevSupabaseClient } from './mocks/supabaseDevServer';

// Create a mock Supabase context for Storybook
type SupabaseContextData = {
    client: SupabaseClient<Database>;
};

const MockSupabaseContext = createContext<SupabaseContextData | null>(null);

/**
 * Mock SupabaseProvider for Storybook stories.
 */
const MockSupabaseProvider = ({ 
    children, 
    client,
}: { 
    children: React.ReactNode;
    client: SupabaseClient<Database>;
}) => {
    return (
        <MockSupabaseContext.Provider value={{ client }}>
            {children}
        </MockSupabaseContext.Provider>
    );
};

/**
 * Provides Supabase context with a mocked client for Storybook stories.
 */
export const withSupabase: Decorator = (Story) => {
    const mockClient = createMockDevSupabaseClient();
    
    return (
        <MockSupabaseProvider client={mockClient}>
            <Story />
        </MockSupabaseProvider>
    );
};

/**
 * Provides React Query context for Storybook stories.
 */
export const withReactQuery: Decorator = (Story) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Story />
        </QueryClientProvider>
    );
};

/**
 * Provides Material UI theme context for Storybook stories.
 */
export const withMuiTheme: Decorator = (Story) => {
    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Story />
        </ThemeProvider>
    );
};

/**
 * Provides Luxon date adapter for Storybook stories.
 */
export const withLuxon: Decorator = (Story) => {
    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <Story />
        </LocalizationProvider>
    );
};

/**
 * Combines all common decorators for a full app context.
 * Use this for stories that need the complete application environment.
 */
export const withFullAppContext: Decorator = (Story) => {
    const mockClient = createMockDevSupabaseClient();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });

    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MockSupabaseProvider client={mockClient}>
                <QueryClientProvider client={queryClient}>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Story />
                    </LocalizationProvider>
                </QueryClientProvider>
            </MockSupabaseProvider>
        </ThemeProvider>
    );
};
