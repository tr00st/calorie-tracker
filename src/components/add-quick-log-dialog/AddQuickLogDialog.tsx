import { Dialog } from "@mui/material";
import AddQuickLogBody from "./AddQuickLogBody";


const AddQuickLogDialog = ({
    open,
    onClose,
    onLogAdded
} : {
    open : boolean,
    onClose : (() => void),
    onLogAdded : (() => void)
}) => {
    const handleCloseEvent = (_event: object, reason: string) => {
        if (reason === "backdropClick") {
            return;
        } else {
            onClose();
        }
    };
    return <Dialog  open={open} onClose={handleCloseEvent} disableRestoreFocus>
        <AddQuickLogBody onClose={onClose} onLogAdded={onLogAdded} />
    </Dialog>;
};

export default AddQuickLogDialog;
