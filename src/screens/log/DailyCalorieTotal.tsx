import { ListItem, ListItemText, Stack } from '@mui/material';
import FadeBetweenValues from '../../utils/FadeBetweenValues';
import { DateTime } from 'luxon';
import { useLogEntriesByDate } from '../../utils/queries';
import { caloriesForLogEntry } from '../../utils/calorieTools';
import { Suspense } from 'react';

const CalorieNumber = ({ date }: { date: DateTime }) => {
    const logEntries = useLogEntriesByDate(date);
    const caloriesForDay = logEntries?.reduce((acc, current) => acc + caloriesForLogEntry(current), 0);
    return <FadeBetweenValues value={caloriesForDay} />;
};

const DailyCalorieTotal = ({ date }: { date: DateTime }) => {
    return (
        <ListItem>
            <ListItemText>
                <Stack direction="row" gap="0.3rem">
                    <span>Total Calories Consumed:</span>
                    <Suspense fallback={<>...</>}>
                        <CalorieNumber date={date} />
                    </Suspense>
                </Stack>
            </ListItemText>
        </ListItem>
    );
};

export default DailyCalorieTotal;
