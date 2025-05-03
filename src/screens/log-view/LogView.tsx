import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../../utils/supabase";
import { AppBar, Fab, List, ListItem, ListItemText } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddQuickLogWindow from "../../AddQuickLogWindow";
import CurrentDatePicker from "./CurrentDatePicker";
import { DateTime } from "luxon";

function LogView() {
    const [logEntries, setLogEntries] = useState<any>([]);
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


    return (<>
        <AppBar position='static'>
            <CurrentDatePicker selectedDate={filterDate} onChange={(newValue : DateTime) => setFilterDate(newValue)} />
        </AppBar>
        <List>
            {logEntries
                .map((logEntry: any) => ({
                    ...logEntry,
                    calorie_count: logEntry.calories_override ? logEntry.calories_override : (logEntry.amount * logEntry.food_calories_p100) / 100
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