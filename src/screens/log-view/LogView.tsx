import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '../../utils/supabase';
import { AppBar, Backdrop, CircularProgress, Collapse, Divider, Fab, List, ListItem, ListItemText, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddQuickLogDialog from '../../components/add-quick-log-dialog/AddQuickLogDialog';
import CurrentDatePicker from './CurrentDatePicker';
import { DateTime } from 'luxon';
import { TransitionGroup } from 'react-transition-group';
import FadeBetweenValues from '../../utils/FadeBetweenValues';
import LogViewListItem from './LogViewListItem';

function LogView() {
    const [logEntries, setLogEntries] = useState<any[] | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const client = useSupabase();

    const todaysDate = DateTime.now().startOf('day');
    const [filterDate, setFilterDate] = useState(todaysDate);

    const getLogEntries = useCallback(async () => {
        setLogEntries(null);
        const { data } = await client
            .from('log_entries')
            .select(`
                *,
                ...foods(
                food_name:name,
                food_calories_p100:calories_p100
                )
            `)
            .gte('timestamp', filterDate)
            .lt('timestamp', filterDate.endOf('day'));
        console.log('Logs loaded: ', data);
        setLogEntries(data);
    }, [client, filterDate]);

    useEffect(() => {
        getLogEntries();
    }, [getLogEntries]);

    const caloriesForLogEntry = (logEntry: any) => logEntry.calories_override ? logEntry.calories_override : (logEntry.amount * logEntry.food_calories_p100) / 100;
    const caloriesForDay = logEntries?.reduce((acc, current) => acc + caloriesForLogEntry(current), 0);

    return (
        <>
            <AppBar position="static">
                <CurrentDatePicker selectedDate={filterDate} onChange={(newValue: DateTime) => setFilterDate(newValue)} />
            </AppBar>
            <List sx={{ flexGrow: 1 }}>
                <ListItem>
                    <ListItemText>
                        <Stack direction="row" gap="0.3rem">
                            <span>Total Calories Consumed:</span>
                            <FadeBetweenValues value={caloriesForDay} />
                        </Stack>
                    </ListItemText>
                </ListItem>
                <Divider />
                <Backdrop open={logEntries === null} sx={{ position: 'absolute', padding: '5rem', alignItems: 'start' }} invisible>
                    <CircularProgress />
                </Backdrop>
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
                                    onEntryUpdated={getLogEntries}
                                />
                            </Collapse>
                        ))}
                </TransitionGroup>
            </List>
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
                onClick={() => setShowAddDialog(true)}
            >
                <AddIcon />
            </Fab>
            <AddQuickLogDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onLogAdded={() => getLogEntries()} />
        </>
    );
}

export default LogView;
