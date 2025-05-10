import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '../../utils/supabase';
import Autocomplete from '@mui/material/Autocomplete';
import { CircularProgress, TextField } from '@mui/material';

export type Food = {
    id: string;
    calories_p100: number;
    serving_grams: number;
    name: string;
};

const FoodSearchBox = ({
    value,
    onChange,
    disabled = false,
}: {
    value: Food | null;
    onChange: (newOption: Food | null) => void;
    disabled: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = useSupabase();
    const [foods, setFoods] = useState<any[] | null>([]);

    const getFoods = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('foods')
            .select()
            .order('name');

        setFoods(data);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        getFoods();
    }, [getFoods]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (_event: any, newOption: Food) => {
        onChange(newOption);
    };

    return (
        <Autocomplete
            onChange={handleChange}
            value={value}
            disabled={disabled}
            sx={{ width: 300 }}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(food: any) => food.name}
            options={foods ?? []}
            loading={loading}
            renderInput={(params: any) => (
                <TextField
                    {...params}
                    label="Pick a Food"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        },
                    }}
                />
            )}
        />
    );
};

export default FoodSearchBox;
