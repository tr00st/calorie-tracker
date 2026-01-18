import { Dialog } from '@mui/material';
import EditFoodBody from './EditFoodBody';
import { Food } from '../../types/foods';

const EditFoodDialog = ({
    open,
    onClose,
    onFoodUpdated,
    food,
}: {
    open: boolean;
    onClose: (() => void);
    onFoodUpdated: (() => void);
    food: Food;
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
            <EditFoodBody
                onClose={onClose}
                onFoodUpdated={onFoodUpdated}
                food={food}
            />
        </Dialog>
    );
};

export default EditFoodDialog;
