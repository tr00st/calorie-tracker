import { Collapse } from '@mui/material';
import { DateTime } from 'luxon';
import { TransitionGroup } from 'react-transition-group';
import LogViewListItem from './LogViewListItem';
import { useLogEntriesByDate } from '../../utils/queries';

function LogListItems({ filterDate }: { filterDate: DateTime }) {
    const logEntries = useLogEntriesByDate(filterDate);

    const caloriesForLogEntry = (logEntry: any) => logEntry.calories_override ? logEntry.calories_override : (logEntry.amount * logEntry.food_calories_p100) / 100;

    return (
        <TransitionGroup>
            {logEntries
                ?.map((logEntry: any) => {
                    let label = 'Manual Entry';
                    if (logEntry.description && logEntry.description !== '') {
                        label = logEntry.description;
                    }
                    else if (logEntry.food_name) {
                        label = logEntry.food_name;
                    }

                    return {
                        ...logEntry,
                        calorie_count: caloriesForLogEntry(logEntry),
                        label: label,
                    };
                })
                .map((logEntry: { label: string; calorie_count: number; timestamp: string; id: string }) => (
                    <Collapse>
                        <LogViewListItem
                            {...logEntry}
                            key={logEntry.id}
                        />
                    </Collapse>
                ))}
        </TransitionGroup>
    );
}

export default LogListItems;
