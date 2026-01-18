import type { Meta, StoryObj } from '@storybook/react';
import EditQuickLogBody from './EditQuickLogBody';
import { vi } from 'vitest';

/**
 * EditQuickLogBody is a component for editing an existing calorie log entry.
 * It allows users to update the description and calorie count.
 */
const meta = {
    title: 'Components/EditQuickLogBody',
    component: EditQuickLogBody,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof EditQuickLogBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with typical values.
 */
export const Default: Story = {
    args: {
        onClose: vi.fn(),
        id: 1,
        timestamp: '2024-01-15T12:30:00Z',
        initialLabel: 'Lunch - Chicken and Rice',
        initialCalories: 450,
    },
};

/**
 * Editing a breakfast entry with lower calories.
 */
export const BreakfastEntry: Story = {
    args: {
        onClose: vi.fn(),
        id: 2,
        timestamp: '2024-01-15T08:00:00Z',
        initialLabel: 'Breakfast - Oatmeal',
        initialCalories: 250,
    },
};

/**
 * Editing an entry with a long description.
 */
export const LongDescription: Story = {
    args: {
        onClose: vi.fn(),
        id: 3,
        timestamp: '2024-01-15T19:00:00Z',
        initialLabel: 'Dinner - Grilled salmon with roasted vegetables, quinoa, and a side salad with olive oil dressing',
        initialCalories: 650,
    },
};

/**
 * Editing a snack entry with very low calories.
 */
export const LowCalorieSnack: Story = {
    args: {
        onClose: vi.fn(),
        id: 4,
        timestamp: '2024-01-15T15:00:00Z',
        initialLabel: 'Snack - Apple',
        initialCalories: 95,
    },
};

/**
 * Editing a high-calorie meal.
 */
export const HighCalorieMeal: Story = {
    args: {
        onClose: vi.fn(),
        id: 5,
        timestamp: '2024-01-15T20:00:00Z',
        initialLabel: 'Dinner - Large Pizza',
        initialCalories: 2400,
    },
};
