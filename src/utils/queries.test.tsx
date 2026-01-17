import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateLogEntryMutation, useDeleteLogEntryMutation, useInsertLogEntryMutation } from './queries';

// Mock the supabase module
const mockSupabase = {
    from: vi.fn(),
};

vi.mock('./supabase', () => ({
    useSupabase: () => mockSupabase,
}));

describe('Query Mutations', () => {
    let queryClient: QueryClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        vi.clearAllMocks();
    });

    describe('useInsertLogEntryMutation', () => {
        it('calls supabase insert with correct payload', async () => {
            const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
            mockSupabase.from.mockReturnValue({
                insert: mockInsert,
            });

            const { result } = renderHook(() => useInsertLogEntryMutation(), { wrapper });

            const payload = {
                timestamp: '2024-01-15T10:30:00.000Z',
                calories_override: 250,
                description: 'Test Food',
            };

            result.current.mutate(payload);

            await waitFor(() => {
                expect(mockSupabase.from).toHaveBeenCalledWith('log_entries');
                expect(mockInsert).toHaveBeenCalledWith(payload);
            });
        });

        it('invalidates correct query cache on success', async () => {
            const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
            mockSupabase.from.mockReturnValue({
                insert: mockInsert,
            });

            const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const { result } = renderHook(() => useInsertLogEntryMutation(), { wrapper });

            const timestamp = '2024-01-15T10:30:00.000Z';
            result.current.mutate({
                timestamp,
                calories_override: 250,
                description: 'Test Food',
            });

            await waitFor(() => {
                expect(invalidateQueriesSpy).toHaveBeenCalledWith({
                    queryKey: ['log_entries', 'by_date', '2024-01-15'],
                });
            });
        });
    });

    describe('useUpdateLogEntryMutation', () => {
        it('calls supabase update with correct payload', async () => {
            const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockUpdate = vi.fn().mockReturnValue({
                eq: mockEq,
            });
            mockSupabase.from.mockReturnValue({
                update: mockUpdate,
            });

            const { result } = renderHook(() => useUpdateLogEntryMutation(), { wrapper });

            const payload = {
                id: 123,
                timestamp: '2024-01-15T10:30:00.000Z',
                description: 'Updated Food',
                calories_override: 300,
            };

            result.current.mutate(payload);

            await waitFor(() => {
                expect(mockSupabase.from).toHaveBeenCalledWith('log_entries');
                expect(mockUpdate).toHaveBeenCalledWith({
                    description: 'Updated Food',
                    calories_override: 300,
                });
                expect(mockEq).toHaveBeenCalledWith('id', 123);
            });
        });

        it('invalidates correct query cache on success', async () => {
            const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockUpdate = vi.fn().mockReturnValue({
                eq: mockEq,
            });
            mockSupabase.from.mockReturnValue({
                update: mockUpdate,
            });

            const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const { result } = renderHook(() => useUpdateLogEntryMutation(), { wrapper });

            result.current.mutate({
                id: 123,
                timestamp: '2024-01-15T10:30:00.000Z',
                description: 'Updated Food',
                calories_override: 300,
            });

            await waitFor(() => {
                expect(invalidateQueriesSpy).toHaveBeenCalledWith({
                    queryKey: ['log_entries', 'by_date', '2024-01-15'],
                });
            });
        });
    });

    describe('useDeleteLogEntryMutation', () => {
        it('calls supabase delete with correct id', async () => {
            const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockDelete = vi.fn().mockReturnValue({
                eq: mockEq,
            });
            mockSupabase.from.mockReturnValue({
                delete: mockDelete,
            });

            const { result } = renderHook(() => useDeleteLogEntryMutation(), { wrapper });

            const payload = {
                id: 123,
                timestamp: '2024-01-15T10:30:00.000Z',
            };

            result.current.mutate(payload);

            await waitFor(() => {
                expect(mockSupabase.from).toHaveBeenCalledWith('log_entries');
                expect(mockDelete).toHaveBeenCalled();
                expect(mockEq).toHaveBeenCalledWith('id', 123);
            });
        });

        it('invalidates correct query cache on success', async () => {
            const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockDelete = vi.fn().mockReturnValue({
                eq: mockEq,
            });
            mockSupabase.from.mockReturnValue({
                delete: mockDelete,
            });

            const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const { result } = renderHook(() => useDeleteLogEntryMutation(), { wrapper });

            result.current.mutate({
                id: 123,
                timestamp: '2024-01-15T10:30:00.000Z',
            });

            await waitFor(() => {
                expect(invalidateQueriesSpy).toHaveBeenCalledWith({
                    queryKey: ['log_entries', 'by_date', '2024-01-15'],
                });
            });
        });
    });
});
