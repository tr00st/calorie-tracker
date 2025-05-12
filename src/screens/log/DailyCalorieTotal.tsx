import { ListItem, ListItemText, Stack } from '@mui/material';
import FadeBetweenValues from '../../utils/FadeBetweenValues';

const DailyCalorieTotal = ({ caloriesForDay }: { caloriesForDay: number }) => {
    return (
        <ListItem>
            <ListItemText>
                <Stack direction="row" gap="0.3rem">
                    <span>Total Calories Consumed:</span>
                    <FadeBetweenValues value={caloriesForDay} />
                </Stack>
            </ListItemText>
        </ListItem>
    );
};

export default DailyCalorieTotal;
