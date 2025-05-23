import { Button, Collapse, DialogActions, DialogContent, DialogTitle, Divider, FormLabel, Stack, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import FoodSearchBox from './FoodSearchBox';
import { Food, FoodType } from '../../types/foods';
import { useInsertLogEntryMutation } from '../../utils/queries';

const AddQuickLogBody = ({
    onClose,
    entryDate,
}: {
    onClose: (() => void);
    entryDate: DateTime;
}) => {
    const currentDateTime = DateTime.now();
    const combinedDateTime = currentDateTime.set({
        year: entryDate.year,
        month: entryDate.month,
        day: entryDate.day,
    });

    const [timestamp, setTimestamp] = useState<DateTime | null>(combinedDateTime);
    const [description, setDescription] = useState<string>('');

    const [calories, setCalories] = useState<string>('');
    const isValidCalorieValue = (value: string) => {
        return Number(value) !== 0;
    };

    const [baseFood, setBaseFood] = useState<Food | null>(null);
    const [foodAmount, setFoodAmount] = useState<string>('');
    const isValidFoodAmountValue = (value: string) => {
        return Number(value) > 0;
    };

    const mutation = useInsertLogEntryMutation();
    const addEntry = async () => {
        onClose();
        setCalories(''); // Blank the calories field as soon as we start saving, to prevent duplicates.
        mutation.mutate({
            timestamp: (timestamp ?? DateTime.now()).toISO() ?? '',
            calories_override: Number(calories),
            description: description,
        });
    };

    const handleSaveOnEnterKey = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') {
            addEntry();
        }
    };

    const usingQuickSet = Boolean(isValidCalorieValue(calories) && (baseFood === null));
    const usingFoodPicker = Boolean(baseFood !== null);

    useEffect(() => {
        if (baseFood !== null) {
            if (baseFood.serving_grams !== null) {
                setFoodAmount(baseFood.serving_grams.toString());
            }
            else if (baseFood.calories_fixed !== null) {
                setCalories(baseFood.calories_fixed.toString());
            }
            setDescription(baseFood.name);
        }
        else {
            setFoodAmount('');
            setCalories('');
            setDescription('');
        }
    }, [baseFood]);

    useEffect(() => {
        if (usingFoodPicker && baseFood !== null) {
            if (baseFood.type === FoodType.BY_WEIGHT) {
                if (isValidFoodAmountValue(foodAmount) && baseFood.calories_p100) {
                    setCalories((Number(foodAmount) * baseFood.calories_p100 / 100).toString());
                }
            }
            else if (baseFood.calories_fixed !== null) {
                setCalories(baseFood.calories_fixed.toString());
            }
        }
    }, [baseFood, foodAmount, usingFoodPicker]);

    let canSubmit = false;
    if (usingQuickSet) {
        canSubmit = isValidCalorieValue(calories);
    }
    else if (usingFoodPicker) {
        canSubmit = baseFood?.type === FoodType.FIXED_SERVING || isValidFoodAmountValue(foodAmount);
    }

    return (
        <>
            <DialogTitle>
                Add Log Entry
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '1em!important' }}>
                <Stack spacing={1}>
                    <TimePicker value={timestamp} onChange={newValue => setTimestamp(newValue)} />
                    <Divider />

                    <FoodSearchBox
                        value={baseFood}
                        onChange={food => setBaseFood(food)}
                        disabled={usingQuickSet}
                    />
                    <Collapse in={usingFoodPicker} unmountOnExit>
                        <Stack direction="column" spacing={1} marginTop={1}>
                            <Collapse in={baseFood?.type === FoodType.BY_WEIGHT}>
                                <Stack direction="column" spacing={1} marginTop={1}>
                                    <TextField
                                        label="Amount (g)"
                                        autoFocus
                                        required
                                        value={foodAmount}
                                        onChange={event => setFoodAmount(event.target.value)}
                                        type="number"
                                        onKeyDown={handleSaveOnEnterKey}
                                    />
                                </Stack>
                            </Collapse>
                            <TextField
                                disabled
                                label="Calculated Calories"
                                value={calories}
                                type="number"
                            />
                        </Stack>
                    </Collapse>

                    <Collapse in={!usingFoodPicker} unmountOnExit>
                        <Stack direction="column" spacing={1} marginTop={1}>
                            <FormLabel>Or...</FormLabel>
                            <TextField
                                label="Quick Set Calories"
                                autoFocus
                                required
                                value={calories}
                                onChange={event => setCalories(event.target.value)}
                                type="number"
                                onKeyDown={handleSaveOnEnterKey}
                            />
                        </Stack>
                    </Collapse>
                    <Divider />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        onKeyDown={handleSaveOnEnterKey}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={!canSubmit} onClick={() => addEntry()}>Add</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </>
    );
};

export default AddQuickLogBody;
