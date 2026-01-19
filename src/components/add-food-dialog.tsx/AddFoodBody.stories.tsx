import type { Meta, StoryObj } from '@storybook/react';
import AddFoodBody from './AddFoodBody';
import { vi } from 'vitest';

/**
 * AddFoodBody is a component for adding new food items to the user's food list.
 * It supports both fixed-serving and by-weight food types.
 */
const meta = {
    title: 'Components/AddFoodBody',
    component: AddFoodBody,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AddFoodBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state shows the form ready for input with "By Weight" as the default serving type.
 */
export const Default: Story = {
    args: {
        onClose: vi.fn(),
        onFoodAdded: vi.fn(),
    },
};

/**
 * Shows the form with the "Fixed Serving" type selected.
 * This is useful for foods like "one apple" or "one egg".
 */
export const FixedServing: Story = {
    args: {
        onClose: vi.fn(),
        onFoodAdded: vi.fn(),
    },
    play: async ({ canvasElement }) => {
        // Note: This would require user interaction in Storybook to change the select
        // For a fully automated test, you'd use Vitest with @testing-library
    },
};
