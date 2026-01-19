import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';
import { beforeAll, vi } from 'vitest';
import { createMockDevSupabaseClient } from '../src/test/mocks/supabaseDevServer';

// Mock the useSupabase hook for Storybook tests
beforeAll(() => {
    const mockClient = createMockDevSupabaseClient();
    
    vi.mock('../src/utils/supabase', () => ({
        useSupabase: () => mockClient,
        useSession: () => ({
            loaded: true,
            session: null,
        }),
        SupabaseProvider: ({ children }: { children: React.ReactNode }) => children,
    }));
});

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);