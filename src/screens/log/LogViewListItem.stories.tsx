import type { Meta, StoryObj } from '@storybook/react';
import LogViewListItem from './LogViewListItem';
import { vi } from 'vitest';
import { DateTime } from 'luxon';

/**
 * LogViewListItem displays a single log entry in the calorie tracker.
 * It shows the time, description, and calorie count for each entry.
 */
const meta = {
    title: 'Screens/LogViewListItem',
    component: LogViewListItem,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof LogViewListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A typical log entry with a manual calorie override.
 */
export const ManualEntry: Story = {
    args: {
        entry: {
            id: 1,
            user_id: 'user-123',
            timestamp: DateTime.now().toISO(),
            description: 'Breakfast - Oatmeal with berries',
            calories_override: 350,
            food_id: null,
            food_grams: null,
            created_at: DateTime.now().toISO(),
        },
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    },
};

/**
 * A log entry from a saved food item with weight-based calories.
 */
export const FoodBasedEntry: Story = {
    args: {
        entry: {
            id: 2,
            user_id: 'user-123',
            timestamp: DateTime.now().toISO(),
            description: 'Chicken Breast',
            calories_override: null,
            food_id: 2,
            food_grams: 150,
            created_at: DateTime.now().toISO(),
        },
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    },
};

/**
 * A log entry with a very long description to test text wrapping.
 */
export const LongDescription: Story = {
    args: {
        entry: {
            id: 3,
            user_id: 'user-123',
            timestamp: DateTime.now().toISO(),
            description: 'A very long description that contains lots of details about the meal including ingredients, preparation method, and other relevant information that might wrap to multiple lines',
            calories_override: 650,
            food_id: null,
            food_grams: null,
            created_at: DateTime.now().toISO(),
        },
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    },
};

/**
 * A log entry with very low calories.
 */
export const LowCalories: Story = {
    args: {
        entry: {
            id: 4,
            user_id: 'user-123',
            timestamp: DateTime.now().toISO(),
            description: 'Coffee',
            calories_override: 5,
            food_id: null,
            food_grams: null,
            created_at: DateTime.now().toISO(),
        },
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    },
};

/**
 * A log entry with high calories.
 */
export const HighCalories: Story = {
    args: {
        entry: {
            id: 5,
            user_id: 'user-123',
            timestamp: DateTime.now().toISO(),
            description: 'Large Pizza',
            calories_override: 2400,
            food_id: null,
            food_grams: null,
            created_at: DateTime.now().toISO(),
        },
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    },
};
