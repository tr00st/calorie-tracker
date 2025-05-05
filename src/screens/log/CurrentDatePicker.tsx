import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { IconButton, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';

const CurrentDatePicker = (props: {
    selectedDate: DateTime;
    onChange: (newValue: DateTime) => void;
}) => {
    return (
        <Toolbar>
            <IconButton onClick={() => props.onChange(props.selectedDate.plus({ days: -1 }))} color="inherit">
                <NavigateBefore />
            </IconButton>
            <Typography variant="h6" component="div" flexGrow="1" textAlign="center">
                {props.selectedDate.toISODate()}
            </Typography>
            <IconButton onClick={() => props.onChange(props.selectedDate.plus({ days: 1 }))} color="inherit">
                <NavigateNext />
            </IconButton>
        </Toolbar>
    );
};

export default CurrentDatePicker;
