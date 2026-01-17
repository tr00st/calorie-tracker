export enum FoodType {
    BY_WEIGHT = 'by_weight',
    FIXED_SERVING = 'fixed_serving',
};

export type Food = {
    id: string;
    calories_p100: number | null;
    serving_grams: number | null;
    calories_fixed: number | null;
    type: FoodType;
    name: string;
    description: string;
};
