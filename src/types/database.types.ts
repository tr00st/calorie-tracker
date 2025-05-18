export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        };
        Views: {
            [_ in never]: never
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never
        };
        CompositeTypes: {
            [_ in never]: never
        };
    };
    public: {
        Tables: {
            foods: {
                Row: {
                    calories_fixed: number | null;
                    calories_p100: number | null;
                    created_at: string;
                    description: string | null;
                    id: string;
                    name: string;
                    owner_id: string | null;
                    serving_grams: number | null;
                    type: Database['public']['Enums']['food_types'] | null;
                };
                Insert: {
                    calories_fixed?: number | null;
                    calories_p100?: number | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    name: string;
                    owner_id?: string | null;
                    serving_grams?: number | null;
                    type?: Database['public']['Enums']['food_types'] | null;
                };
                Update: {
                    calories_fixed?: number | null;
                    calories_p100?: number | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    owner_id?: string | null;
                    serving_grams?: number | null;
                    type?: Database['public']['Enums']['food_types'] | null;
                };
                Relationships: [];
            };
            log_entries: {
                Row: {
                    amount: number | null;
                    calories_override: number | null;
                    created_at: string;
                    description: string | null;
                    food_id: string | null;
                    id: number;
                    timestamp: string;
                    user_id: string;
                };
                Insert: {
                    amount?: number | null;
                    calories_override?: number | null;
                    created_at?: string;
                    description?: string | null;
                    food_id?: string | null;
                    id?: number;
                    timestamp: string;
                    user_id?: string;
                };
                Update: {
                    amount?: number | null;
                    calories_override?: number | null;
                    created_at?: string;
                    description?: string | null;
                    food_id?: string | null;
                    id?: number;
                    timestamp?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'LogEntry_food_id_fkey';
                        columns: ['food_id'];
                        isOneToOne: false;
                        referencedRelation: 'foods';
                        referencedColumns: ['id'];
                    },
                ];
            };
            profiles: {
                Row: {
                    daily_calorie_target: number | null;
                    id: string;
                };
                Insert: {
                    daily_calorie_target?: number | null;
                    id: string;
                };
                Update: {
                    daily_calorie_target?: number | null;
                    id?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never
        };
        Functions: {
            [_ in never]: never
        };
        Enums: {
            food_types: 'by_weight' | 'fixed_serving';
        };
        CompositeTypes: {
            [_ in never]: never
        };
    };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
            Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
            Row: infer R;
        }
            ? R
            : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
        ? (DefaultSchema['Tables'] &
            DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
                Row: infer R;
            }
                ? R
                : never
        : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I;
    }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
        ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
            ? I
            : never
        : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U;
    }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
        ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
            ? U
            : never
        : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
        ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
        : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
        ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
        : never;

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {
            food_types: ['by_weight', 'fixed_serving'],
        },
    },
} as const;
