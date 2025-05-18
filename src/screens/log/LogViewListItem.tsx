import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Delete, MoreHoriz } from '@mui/icons-material';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { useDeleteLogEntryMutation } from '../../utils/queries';

const LogViewListItem = ({
    label,
    calorie_count,
    timestamp,
    id,
}: {
    label: string;
    calorie_count: number;
    timestamp: string;
    id: string;
}) => {
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const menuIsOpen = Boolean(menuAnchorElement);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const handleDelete = () => {
        setMenuAnchorElement(null);
        setDeleteConfirmationOpen(true);
    };

    const mutation = useDeleteLogEntryMutation();
    const runDelete = async () => {
        setDeleteConfirmationOpen(false);
        mutation.mutate({
            id,
            timestamp,
        });
    };

    const displayTime = DateTime.fromISO(timestamp).toLocaleString(DateTime.TIME_SIMPLE);

    return (
        <ListItem
            secondaryAction={(
                <IconButton onClick={e => setMenuAnchorElement(e.currentTarget)}>
                    <MoreHoriz />
                </IconButton>
            )}
            sx={{ borderBottom: '1px #f5f5f5 solid' }}
        >
            <ListItemText
                primary={`${label}`}
                secondary={`${calorie_count}cal, ${displayTime}`}
                sx={{ flexGrow: 1 }}
            />
            <Menu
                open={menuIsOpen}
                onClose={() => setMenuAnchorElement(null)}
                anchorEl={menuAnchorElement}
            >
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>
            <Dialog open={deleteConfirmationOpen}>
                <DialogTitle>Permantly Delete Entry?</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this entry?
                    <br />
                    <strong>This is permanent, and cannot be undone.</strong>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setDeleteConfirmationOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={runDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </ListItem>
    );
};

export default LogViewListItem;
