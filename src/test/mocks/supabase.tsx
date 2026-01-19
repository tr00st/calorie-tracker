import { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { vi } from 'vitest';
import { Database } from '../../types/database.types';

/**
 * Creates a mock Supabase client for testing purposes.
 * This mock includes commonly used methods from the Supabase client API.
 * 
 * @example
 * ```ts
 * const mockClient = createMockSupabaseClient();
 * mockClient.from.mockReturnValue({
 *   select: vi.fn().mockResolvedValue({ data: [], error: null })
 * });
 * ```
 */
export const createMockSupabaseClient = () => {
    const mockClient = {
        from: vi.fn(),
        auth: {
            getSession: vi.fn().mockResolvedValue({
                data: { session: null },
                error: null,
            }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: vi.fn() } },
            }),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            signUp: vi.fn(),
        },
        channel: vi.fn(),
        removeChannel: vi.fn(),
    };

    return mockClient as unknown as SupabaseClient<Database>;
};

/**
 * Mock context for Supabase provider.
 * Use this in tests when you need to provide a specific mock client.
 */
const MockSupabaseContext = createContext<SupabaseClient<Database> | null>(null);

/**
 * Mock Supabase Provider component for testing.
 * Wraps components with a mocked Supabase context.
 * 
 * @example
 * ```tsx
 * const mockClient = createMockSupabaseClient();
 * render(
 *   <MockSupabaseProvider client={mockClient}>
 *     <YourComponent />
 *   </MockSupabaseProvider>
 * );
 * ```
 */
export const MockSupabaseProvider = ({
    children,
    client,
}: {
    children: React.ReactNode;
    client: SupabaseClient<Database>;
}) => {
    return (
        <MockSupabaseContext.Provider value={client}>
            {children}
        </MockSupabaseContext.Provider>
    );
};

/**
 * Hook to use mocked Supabase client in tests.
 * This is meant to be used as a replacement for the real useSupabase hook.
 */
export const useMockSupabase = () => {
    const context = useContext(MockSupabaseContext);
    if (context === null) {
        throw new Error('Cannot use useMockSupabase without MockSupabaseProvider');
    }
    return context;
};

/**
 * Creates a mock Supabase response for successful queries.
 */
export const createMockSupabaseResponse = <T,>(data: T) => ({
    data,
    error: null,
    count: null,
    status: 200,
    statusText: 'OK',
});

/**
 * Creates a mock Supabase error response.
 */
export const createMockSupabaseError = (message: string, code?: string) => ({
    data: null,
    error: {
        message,
        code: code || 'MOCK_ERROR',
        details: '',
        hint: '',
    },
    count: null,
    status: 400,
    statusText: 'Bad Request',
});
