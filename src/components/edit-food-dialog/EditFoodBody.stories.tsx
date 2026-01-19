import type { Meta, StoryObj } from '@storybook/react';
import EditFoodBody from './EditFoodBody';
import { vi } from 'vitest';
import { FoodType } from '../../types/foods';

/**
 * EditFoodBody is a component for editing existing food items in the user's food list.
 * It supports both fixed-serving and by-weight food types.
 */
const meta = {
    title: 'Components/EditFoodBody',
    component: EditFoodBody,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof EditFoodBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Editing a by-weight food item (e.g., chicken breast with calories per 100g).
 */
export const ByWeightFood: Story = {
    args: {
        onClose: vi.fn(),
        onFoodUpdated: vi.fn(),
        food: {
            id: 1,
            user_id: 'user-123',
            name: 'Chicken Breast',
            description: 'Grilled',
            type: FoodType.BY_WEIGHT,
            calories_p100: 165,
            calories_fixed: null,
            serving_grams: 100,
            created_at: '2024-01-01T00:00:00Z',
        },
    },
};

/**
 * Editing a fixed-serving food item (e.g., one banana).
 */
export const FixedServingFood: Story = {
    args: {
        onClose: vi.fn(),
        onFoodUpdated: vi.fn(),
        food: {
            id: 2,
            user_id: 'user-123',
            name: 'Banana',
            description: 'Medium sized',
            type: FoodType.FIXED_SERVING,
            calories_p100: null,
            calories_fixed: 105,
            serving_grams: null,
            created_at: '2024-01-01T00:00:00Z',
        },
    },
};

/**
 * Editing a food with a long name and description.
 */
export const LongText: Story = {
    args: {
        onClose: vi.fn(),
        onFoodUpdated: vi.fn(),
        food: {
            id: 3,
            user_id: 'user-123',
            name: 'Organic Free-Range Grass-Fed Beef Sirloin Steak',
            description: 'Premium quality, sourced from local farms, high in protein and omega-3 fatty acids',
            type: FoodType.BY_WEIGHT,
            calories_p100: 271,
            calories_fixed: null,
            serving_grams: 150,
            created_at: '2024-01-01T00:00:00Z',
        },
    },
};
