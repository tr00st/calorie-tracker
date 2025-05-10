import { Button, Collapse, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useSupabase } from '../../utils/supabase';
import { FoodType } from '../../types/foods';

const AddFoodBody = ({
    onClose,
    onFoodAdded,
}: {
    onClose: (() => void);
    onFoodAdded: (() => void);
}) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [calories, setCalories] = useState<string>('');
    const [servingSize, setServingSize] = useState<string>('100');
    const [servingType, setServingType] = useState<FoodType>(FoodType.BY_WEIGHT);
    const caloriesRegex = /^[0-9]+$/;
    const isValidCalorieValue = (value: string) => {
        return caloriesRegex.test(value);
    };

    const supabase = useSupabase();

    const addEntry = async () => {
        onClose();
        setCalories(''); // Blank the calories field as soon as we start saving, to prevent duplicates.
        const { error } = await supabase
            .from('foods')
            .insert({
                name: name,
                type: servingType,
                calories_p100: servingType === FoodType.BY_WEIGHT ? calories : null,
                serving_grams: servingType === FoodType.BY_WEIGHT ? servingSize : null,
                calories_fixed: servingType === FoodType.FIXED_SERVING ? calories : null,
                description: description,
            });

        if (error) {
            console.error(error);
        }
        onFoodAdded();
    };

    const handleSaveOnEnterKey = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') {
            addEntry();
        }
    };

    return (
        <>
            <DialogTitle>
                Add Food
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '1em!important' }}>
                <Stack spacing={1}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="serving-type-label">Serving Type</InputLabel>
                        <Select
                            label="Serving Type"
                            labelId="serving-type-label"
                            id="serving-type"
                            value={servingType}
                            onChange={event => setServingType(event.target.value as FoodType)}
                        >
                            <MenuItem value={FoodType.BY_WEIGHT}>By Weight</MenuItem>
                            <MenuItem value={FoodType.FIXED_SERVING}>Fixed</MenuItem>
                        </Select>
                    </FormControl>
                    <Collapse in={servingType === FoodType.BY_WEIGHT} unmountOnExit>
                        <Stack direction="column" spacing={1} marginTop={1}>
                            <TextField
                                label="Calories per 100g"
                                autoFocus
                                required
                                value={calories}
                                onChange={event => setCalories(event.target.value)}
                                type="number"
                                onKeyDown={handleSaveOnEnterKey}
                            />
                            <TextField
                                label="Serving size (g)"
                                required
                                value={servingSize}
                                onChange={event => setServingSize(event.target.value)}
                                type="number"
                                onKeyDown={handleSaveOnEnterKey}
                            />
                        </Stack>
                    </Collapse>
                    <Collapse in={servingType === FoodType.FIXED_SERVING} unmountOnExit>
                        <Stack direction="column" spacing={1} marginTop={1}>
                            <TextField
                                label="Calories per serving"
                                autoFocus
                                required
                                value={calories}
                                onChange={event => setCalories(event.target.value)}
                                type="number"
                                onKeyDown={handleSaveOnEnterKey}
                            />
                        </Stack>
                    </Collapse>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        onKeyDown={handleSaveOnEnterKey}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        onKeyDown={handleSaveOnEnterKey}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={!isValidCalorieValue(calories)} onClick={() => addEntry()}>Add</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </>
    );
};

export default AddFoodBody;
