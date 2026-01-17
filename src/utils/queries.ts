import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useSupabase } from './supabase';
import { DateTime } from 'luxon';
import { Database } from '../types/database.types';

export const useLogEntriesByDate = (filterDate: DateTime) => {
    const client = useSupabase();

    const query = useSuspenseQuery({
        queryKey: ['log_entries', 'by_date', filterDate.toISODate()],
        queryFn: async () => await client
            .from('log_entries')
            .select(`
                *,
                ...foods(
                food_name:name,
                food_calories_p100:calories_p100
                )
            `)
            .gte('timestamp', filterDate)
            .lt('timestamp', filterDate.endOf('day')),
    });

    return query.data.data;
};

export const useInsertLogEntryMutation = () => {
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: Database['public']['Tables']['log_entries']['Insert']) => await supabase
            .from('log_entries')
            .insert(payload),
        onSuccess: (_data, variables) => {
            const submitDate = DateTime.fromISO(variables.timestamp);
            queryClient.invalidateQueries({ queryKey: ['log_entries', 'by_date', submitDate.toISODate()] });
        },
    });
};

export const useUpdateLogEntryMutation = () => {
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { id: number; timestamp: string; description?: string; calories_override?: number }) => {
            return await supabase
                .from('log_entries')
                .update({
                    description: payload.description,
                    calories_override: payload.calories_override,
                })
                .eq('id', payload.id);
        },
        onSuccess: (_data, variables) => {
            const submitDate = DateTime.fromISO(variables.timestamp);
            queryClient.invalidateQueries({ queryKey: ['log_entries', 'by_date', submitDate.toISODate()] });
        },
    });
};

export const useDeleteLogEntryMutation = () => {
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { id: string; timestamp: string }) => await supabase
            .from('log_entries')
            .delete()
            .eq('id', payload.id),
        onSuccess: (_data, variables) => {
            const submitDate = DateTime.fromISO(variables.timestamp);
            queryClient.invalidateQueries({ queryKey: ['log_entries', 'by_date', submitDate.toISODate()] });
        },
    });
};
