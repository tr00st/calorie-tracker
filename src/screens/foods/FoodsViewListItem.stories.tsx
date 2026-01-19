import type { Meta, StoryObj } from '@storybook/react';
import FoodsViewListItem from './FoodsViewListItem';
import { vi } from 'vitest';
import { FoodType } from '../../types/foods';

/**
 * FoodsViewListItem displays a single food item in the food list.
 * It shows the name, calorie info, and provides edit/delete actions.
 */
const meta = {
    title: 'Screens/FoodsViewListItem',
    component: FoodsViewListItem,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof FoodsViewListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A by-weight food item showing calories per 100g.
 */
export const ByWeightFood: Story = {
    args: {
        entity: {
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
        onEntryUpdated: vi.fn(),
    },
};

/**
 * A fixed-serving food item showing calories per serving.
 */
export const FixedServingFood: Story = {
    args: {
        entity: {
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
        onEntryUpdated: vi.fn(),
    },
};

/**
 * A food item with a very long name to test text wrapping.
 */
export const LongName: Story = {
    args: {
        entity: {
            id: 3,
            user_id: 'user-123',
            name: 'Organic Free-Range Grass-Fed Beef Sirloin Steak with Special Seasoning and Marinade',
            description: 'Premium quality',
            type: FoodType.BY_WEIGHT,
            calories_p100: 271,
            calories_fixed: null,
            serving_grams: 150,
            created_at: '2024-01-01T00:00:00Z',
        },
        onEntryUpdated: vi.fn(),
    },
};

/**
 * A low-calorie food item.
 */
export const LowCalorie: Story = {
    args: {
        entity: {
            id: 4,
            user_id: 'user-123',
            name: 'Cucumber',
            description: 'Fresh',
            type: FoodType.BY_WEIGHT,
            calories_p100: 16,
            calories_fixed: null,
            serving_grams: 100,
            created_at: '2024-01-01T00:00:00Z',
        },
        onEntryUpdated: vi.fn(),
    },
};

/**
 * A high-calorie food item.
 */
export const HighCalorie: Story = {
    args: {
        entity: {
            id: 5,
            user_id: 'user-123',
            name: 'Peanut Butter',
            description: 'Smooth',
            type: FoodType.BY_WEIGHT,
            calories_p100: 588,
            calories_fixed: null,
            serving_grams: 30,
            created_at: '2024-01-01T00:00:00Z',
        },
        onEntryUpdated: vi.fn(),
    },
};
