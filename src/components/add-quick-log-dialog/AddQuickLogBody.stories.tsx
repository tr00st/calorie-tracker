import type { Meta, StoryObj } from '@storybook/react';
import AddQuickLogBody from './AddQuickLogBody';
import { vi } from 'vitest';
import { DateTime } from 'luxon';

/**
 * AddQuickLogBody is a component for quickly adding a calorie log entry.
 * It allows users to enter calories directly or select from their food list.
 */
const meta = {
    title: 'Components/AddQuickLogBody',
    component: AddQuickLogBody,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof AddQuickLogBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state shows the quick log form for today's date.
 */
export const Default: Story = {
    args: {
        onClose: vi.fn(),
        entryDate: DateTime.now(),
    },
};

/**
 * Shows the form configured for a specific past date.
 */
export const PastDate: Story = {
    args: {
        onClose: vi.fn(),
        entryDate: DateTime.fromISO('2024-01-15'),
    },
};

/**
 * Shows the form configured for a future date.
 */
export const FutureDate: Story = {
    args: {
        onClose: vi.fn(),
        entryDate: DateTime.now().plus({ days: 1 }),
    },
};
