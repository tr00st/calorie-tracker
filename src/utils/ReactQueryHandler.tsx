import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ReactQueryHandler = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }), []);

    return (
        <QueryClientProvider client={queryClient}>
            { children }
        </QueryClientProvider>
    );
};

export default ReactQueryHandler;
