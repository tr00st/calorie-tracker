import { Button, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useSupabase } from '../../utils/supabase';

const AddQuickLogBody = ({
    onClose,
    onLogAdded,
}: {
    onClose: (() => void);
    onLogAdded: (() => void);
}) => {
    const [timestamp, setTimestamp] = useState<DateTime | null>(DateTime.now());
    const [description, setDescription] = useState<string>('');
    const [calories, setCalories] = useState<string>('');
    const caloriesRegex = /^[0-9]+$/;
    const isValidCalorieValue = (value: string) => {
        return caloriesRegex.test(value);
    };

    /* For later - loading foods to pick from. */
    // const [foods, setFoods] = useState<any>([]);
    // async function getFoods() {
    //     const { data } = await client.from("foods").select();
    //     console.log('Foods loaded: ', data);
    //     setFoods(data);
    // }
    // useEffect(() => {
    //     getFoods();
    // }, []);

    const supabase = useSupabase();

    const addEntry = async () => {
        const { error } = await supabase
            .from('log_entries')
            .insert({
                timestamp: timestamp,
                calories_override: calories,
                description: description,
            });

        console.error(error);
        onLogAdded();
        onClose();
    };

    return (
        <>
            <DialogTitle>
                Add Log Entry
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '1em!important' }}>
                <Stack spacing={1}>
                    <TimePicker value={timestamp} onChange={newValue => setTimestamp(newValue)} />
                    <TextField label="Quick Set Calories" autoFocus required value={calories} onChange={event => setCalories(event.target.value)} type="number" />
                    <TextField label="Description" value={description} onChange={event => setDescription(event.target.value)} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={!isValidCalorieValue(calories)} onClick={() => addEntry()}>Add</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </>
    );
};

export default AddQuickLogBody;
