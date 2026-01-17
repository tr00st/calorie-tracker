import { Button, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useUpdateLogEntryMutation } from '../../utils/queries';

const EditQuickLogBody = ({
    onClose,
    id,
    timestamp,
    initialLabel,
    initialCalories,
}: {
    onClose: (() => void);
    id: number;
    timestamp: string;
    initialLabel: string;
    initialCalories: number;
}) => {
    const [description, setDescription] = useState<string>(initialLabel);
    const [calories, setCalories] = useState<string>(initialCalories.toString());

    const isValidCalorieValue = (value: string) => {
        return Number(value) > 0;
    };

    const mutation = useUpdateLogEntryMutation();
    const updateEntry = async () => {
        onClose();
        mutation.mutate({
            id,
            timestamp,
            description: description,
            calories_override: Number(calories),
        });
    };

    const handleSaveOnEnterKey = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') {
            updateEntry();
        }
    };

    const canSubmit = isValidCalorieValue(calories);

    return (
        <>
            <DialogTitle>
                Edit Log Entry
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '1em!important' }}>
                <Stack spacing={2}>
                    <TextField
                        label="Description"
                        autoFocus
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        onKeyDown={handleSaveOnEnterKey}
                    />
                    <TextField
                        label="Calories"
                        required
                        value={calories}
                        onChange={event => setCalories(event.target.value)}
                        type="number"
                        onKeyDown={handleSaveOnEnterKey}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={!canSubmit} onClick={() => updateEntry()}>Save</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </>
    );
};

export default EditQuickLogBody;
