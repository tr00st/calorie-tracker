import { Dialog } from '@mui/material';
import AddQuickLogBody from './AddQuickLogBody';
import { DateTime } from 'luxon';

const AddQuickLogDialog = ({
    open,
    onClose,
    onLogAdded,
    entryDate,
}: {
    open: boolean;
    onClose: (() => void);
    onLogAdded: (() => void);
    entryDate: DateTime;
}) => {
    const handleCloseEvent = (_event: object, reason: string) => {
        if (reason === 'backdropClick') {
            return;
        }
        else {
            onClose();
        }
    };
    return (
        <Dialog open={open} onClose={handleCloseEvent} disableRestoreFocus>
            <AddQuickLogBody onClose={onClose} onLogAdded={onLogAdded} entryDate={entryDate} />
        </Dialog>
    );
};

export default AddQuickLogDialog;
