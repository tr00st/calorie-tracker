import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../../utils/supabase";
import { AppBar, Divider, Fab, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddQuickLogWindow from "../../AddQuickLogWindow";
import CurrentDatePicker from "./CurrentDatePicker";
import { DateTime } from "luxon";
import { Preview } from "@mui/icons-material";

function LogView() {
    const [logEntries, setLogEntries] = useState<any[] | null>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const client = useSupabase();

    const todaysDate = DateTime.now().startOf('day');
    const [filterDate, setFilterDate] = useState(todaysDate);


    const getLogEntries = useCallback(async () => {
        const { data } = await client
            .from("log_entries")
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

    const caloriesForLogEntry = (logEntry : any) => logEntry.calories_override ? logEntry.calories_override : (logEntry.amount * logEntry.food_calories_p100) / 100;


    return (<>
        <AppBar position='static'>
            <CurrentDatePicker selectedDate={filterDate} onChange={(newValue : DateTime) => setFilterDate(newValue)} />
        </AppBar>
        <List>
            <ListItem>
                <ListItemText>
                    Total Calories Today: {logEntries?.reduce((acc, current) => acc + caloriesForLogEntry(current), 0)}
                </ListItemText>
            </ListItem>
            <Divider />
            {logEntries
                ?.map((logEntry: any) => ({
                    ...logEntry,
                    calorie_count: caloriesForLogEntry(logEntry)
                }))
                .map((logEntry: any) => (
                    <ListItem key={logEntry.id}>
                        <ListItemText primary={`${logEntry.food_name ?? "Manual Entry"}, ${logEntry.calorie_count}cal`} secondary={logEntry.timestamp} />
                    </ListItem>
                ))}
        </List>
        <Fab
            sx={{
                position: 'absolute',
                bottom: 16,
                right: 16
            }}
            onClick={() => setShowAddDialog(true)}
        >
            <AddIcon />
        </Fab>
        <AddQuickLogWindow open={showAddDialog} onClose={() => setShowAddDialog(false)} onLogAdded={() => getLogEntries()} />
    </>);
}

export default LogView;