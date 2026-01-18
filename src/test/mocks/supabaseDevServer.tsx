import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';

/**
 * Mock data for development and Storybook.
 * This provides realistic sample data for testing components.
 */
export const mockFoods: Database['public']['Tables']['foods']['Row'][] = [
    {
        id: 1,
        user_id: 'mock-user-id',
        name: 'Banana',
        description: 'Medium sized',
        type: 'FIXED_SERVING',
        calories_fixed: 105,
        calories_p100: null,
        serving_grams: null,
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        user_id: 'mock-user-id',
        name: 'Chicken Breast',
        description: 'Grilled',
        type: 'BY_WEIGHT',
        calories_fixed: null,
        calories_p100: 165,
        serving_grams: 100,
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 3,
        user_id: 'mock-user-id',
        name: 'Brown Rice',
        description: 'Cooked',
        type: 'BY_WEIGHT',
        calories_fixed: null,
        calories_p100: 123,
        serving_grams: 150,
        created_at: '2024-01-01T00:00:00Z',
    },
];

export const mockLogEntries: Database['public']['Tables']['log_entries']['Row'][] = [
    {
        id: 1,
        user_id: 'mock-user-id',
        timestamp: '2024-01-15T08:00:00Z',
        description: 'Breakfast - Oatmeal',
        calories_override: 350,
        food_id: null,
        food_grams: null,
        created_at: '2024-01-15T08:00:00Z',
    },
    {
        id: 2,
        user_id: 'mock-user-id',
        timestamp: '2024-01-15T12:30:00Z',
        description: 'Lunch',
        calories_override: null,
        food_id: 2,
        food_grams: 150,
        created_at: '2024-01-15T12:30:00Z',
    },
    {
        id: 3,
        user_id: 'mock-user-id',
        timestamp: '2024-01-15T19:00:00Z',
        description: 'Dinner',
        calories_override: 650,
        food_id: null,
        food_grams: null,
        created_at: '2024-01-15T19:00:00Z',
    },
];

/**
 * Creates a mock Supabase client that uses in-memory data.
 * This is useful for development and Storybook stories.
 * 
 * The mock client intercepts common Supabase operations and returns
 * data from the mock datasets above.
 * 
 * @example
 * ```tsx
 * const mockClient = createMockDevSupabaseClient();
 * // Use in SupabaseProvider
 * <SupabaseProvider value={{ client: mockClient }}>
 *   <YourComponent />
 * </SupabaseProvider>
 * ```
 */
export const createMockDevSupabaseClient = (): SupabaseClient<Database> => {
    // Create a base client with fake credentials
    // This won't actually connect to any server
    const baseClient = createClient<Database>(
        'https://mock.supabase.co',
        'mock-anon-key',
    );

    // Store mock data in memory
    const mockData = {
        foods: [...mockFoods],
        log_entries: [...mockLogEntries],
    };

    // Override the from method to return our mock query builder
    const originalFrom = baseClient.from.bind(baseClient);
    
    baseClient.from = ((table: string) => {
        const chain: any = {
            select: (columns = '*') => {
                // Return the appropriate mock data
                const data = mockData[table as keyof typeof mockData] || [];
                
                return {
                    ...chain,
                    data,
                    error: null,
                    eq: (column: string, value: any) => {
                        const filtered = data.filter((item: any) => item[column] === value);
                        return {
                            ...chain,
                            data: filtered,
                            error: null,
                        };
                    },
                    order: (column: string, options?: any) => {
                        const sorted = [...data].sort((a: any, b: any) => {
                            const order = options?.ascending === false ? -1 : 1;
                            return a[column] > b[column] ? order : -order;
                        });
                        return {
                            ...chain,
                            data: sorted,
                            error: null,
                        };
                    },
                    then: (resolve: any) => {
                        return Promise.resolve({ data, error: null }).then(resolve);
                    },
                };
            },
            insert: (values: any) => {
                const tableData = mockData[table as keyof typeof mockData];
                if (Array.isArray(tableData)) {
                    const newId = Math.max(...tableData.map((item: any) => item.id || 0)) + 1;
                    const newItem = { ...values, id: newId, created_at: new Date().toISOString() };
                    tableData.push(newItem);
                }
                return {
                    ...chain,
                    data: values,
                    error: null,
                    then: (resolve: any) => {
                        return Promise.resolve({ data: values, error: null }).then(resolve);
                    },
                };
            },
            update: (values: any) => {
                return {
                    ...chain,
                    eq: (column: string, value: any) => {
                        const tableData = mockData[table as keyof typeof mockData];
                        if (Array.isArray(tableData)) {
                            const index = tableData.findIndex((item: any) => item[column] === value);
                            if (index >= 0) {
                                tableData[index] = { ...tableData[index], ...values };
                            }
                        }
                        return {
                            ...chain,
                            data: values,
                            error: null,
                            then: (resolve: any) => {
                                return Promise.resolve({ data: values, error: null }).then(resolve);
                            },
                        };
                    },
                };
            },
            delete: () => {
                return {
                    ...chain,
                    eq: (column: string, value: any) => {
                        const tableData = mockData[table as keyof typeof mockData];
                        if (Array.isArray(tableData)) {
                            const index = tableData.findIndex((item: any) => item[column] === value);
                            if (index >= 0) {
                                tableData.splice(index, 1);
                            }
                        }
                        return {
                            ...chain,
                            data: null,
                            error: null,
                            then: (resolve: any) => {
                                return Promise.resolve({ data: null, error: null }).then(resolve);
                            },
                        };
                    },
                };
            },
        };

        return chain;
    }) as any;

    return baseClient;
};

/**
 * Environment variable to enable mock Supabase client in development.
 * Set VITE_USE_MOCK_SUPABASE=true in your .env.local to use mock data.
 */
export const shouldUseMockSupabase = (): boolean => {
    return import.meta.env.VITE_USE_MOCK_SUPABASE === 'true';
};
