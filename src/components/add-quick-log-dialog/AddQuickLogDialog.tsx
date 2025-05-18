import { Dialog } from '@mui/material';
import AddQuickLogBody from './AddQuickLogBody';
import { DateTime } from 'luxon';

const AddQuickLogDialog = ({
    open,
    onClose,
    entryDate,
}: {
    open: boolean;
    onClose: (() => void);
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
            <AddQuickLogBody onClose={onClose} entryDate={entryDate} />
        </Dialog>
    );
};

export default AddQuickLogDialog;
