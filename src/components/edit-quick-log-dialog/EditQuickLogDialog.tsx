import { Dialog } from '@mui/material';
import EditQuickLogBody from './EditQuickLogBody';

const EditQuickLogDialog = ({
    open,
    onClose,
    id,
    timestamp,
    initialLabel,
    initialCalories,
}: {
    open: boolean;
    onClose: (() => void);
    id: number;
    timestamp: string;
    initialLabel: string;
    initialCalories: number;
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
            <EditQuickLogBody
                onClose={onClose}
                id={id}
                timestamp={timestamp}
                initialLabel={initialLabel}
                initialCalories={initialCalories}
            />
        </Dialog>
    );
};

export default EditQuickLogDialog;
