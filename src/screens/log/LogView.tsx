import React, { Suspense, useState } from 'react';
import { AppBar, Backdrop, CircularProgress, Divider, Fab, List } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddQuickLogDialog from '../../components/add-quick-log-dialog/AddQuickLogDialog';
import CurrentDatePicker from './CurrentDatePicker';
import { DateTime } from 'luxon';
import DailyCalorieTotal from './DailyCalorieTotal';
import LogListItems from './LogListItems';

function LogView() {
    const [showAddDialog, setShowAddDialog] = useState(false);

    const todaysDate = DateTime.now().startOf('day');
    const [filterDate, setFilterDate] = useState(todaysDate);

    const [touchStartX, setTouchStartX] = useState<number>(-1);
    const [touchStartY, setTouchStartY] = useState<number>(-1);

    const handleTouchStart = (e: React.TouchEvent<HTMLUListElement>) => {
        const touch = e.touches[0];
        setTouchStartX(touch.clientX);
        setTouchStartY(touch.clientY);
    };
    const handleTouchEnd = (e: React.TouchEvent<HTMLUListElement>) => {
        const touch = e.changedTouches[0];
        const movementX = touchStartX - touch.clientX;
        const movementY = touchStartY - touch.clientY;
        const magnitudeX = Math.abs(movementX);
        const magnitudeY = Math.abs(movementY);

        if (
            magnitudeX < 10
            || magnitudeX < magnitudeY
        ) {
            return; // Doesn't look like a horizontal swipe
        }

        setFilterDate(filterDate.plus({ days: Math.sign(movementX) }));
    };

    return (
        <>
            <AppBar position="static">
                <CurrentDatePicker selectedDate={filterDate} onChange={(newValue: DateTime) => setFilterDate(newValue)} />
            </AppBar>
            <List sx={{ flexGrow: 1 }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <DailyCalorieTotal date={filterDate} />
                <Divider />
                <Suspense
                    fallback={(
                        <Backdrop open={true} sx={{ position: 'absolute', padding: '5rem', alignItems: 'start' }} invisible>
                            <CircularProgress />
                        </Backdrop>
                    )}
                >
                    <LogListItems filterDate={filterDate} />
                </Suspense>
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
            <AddQuickLogDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} entryDate={filterDate} />
        </>
    );
}

export default LogView;
