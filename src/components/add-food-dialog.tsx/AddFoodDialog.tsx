import { Dialog } from '@mui/material';
import AddFoodBody from './AddFoodBody';

const AddFoodDialog = ({
    open,
    onClose,
    onFoodAdded,
}: {
    open: boolean;
    onClose: (() => void);
    onFoodAdded: (() => void);
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
            <AddFoodBody onClose={onClose} onFoodAdded={onFoodAdded} />
        </Dialog>
    );
};

export default AddFoodDialog;
