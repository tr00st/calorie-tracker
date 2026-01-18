import type { Preview } from '@storybook/react-vite';
import { createMockDevSupabaseClient } from '../src/test/mocks/supabaseDevServer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../src/types/database.types';

// Create a Supabase context matching the real one
type SupabaseContextData = {
  client: SupabaseClient<Database>;
};

const StorybookSupabaseContext = createContext<SupabaseContextData | null>(null);

// Global decorator that provides all necessary contexts
const preview: Preview = {
  decorators: [
    (Story) => {
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
          <StorybookSupabaseContext.Provider value={{ client: mockClient }}>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <Story />
              </LocalizationProvider>
            </QueryClientProvider>
          </StorybookSupabaseContext.Provider>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;

// Export the hook so stories can access the context if needed
export const useStorybookSupabase = () => {
  const context = useContext(StorybookSupabaseContext);
  if (context === null) {
    throw new Error('Cannot use useStorybookSupabase without context provider');
  }
  return context.client;
};