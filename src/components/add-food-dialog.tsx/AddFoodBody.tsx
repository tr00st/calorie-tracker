import { Button, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useSupabase } from '../../utils/supabase';

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
                calories_p100: calories,
                name: name,
                serving_grams: servingSize,
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
