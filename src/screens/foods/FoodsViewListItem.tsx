import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Delete, Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useSupabase } from '../../utils/supabase';

const FoodsViewListItem = ({
    name,
    description,
    calories_p100,
    id,
    onEntryUpdated,
}: {
    name: string;
    description: string;
    calories_p100: number;
    id: string;
    onEntryUpdated: (() => void);
}) => {
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const menuIsOpen = Boolean(menuAnchorElement);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const supabase = useSupabase();

    const handleDelete = () => {
        setMenuAnchorElement(null);
        setDeleteConfirmationOpen(true);
    };

    const runDelete = async () => {
        setDeleteConfirmationOpen(false);
        await supabase
            .from('foods')
            .delete()
            .eq('id', id);
        onEntryUpdated();
    };

    return (
        <ListItem
            secondaryAction={(
                <IconButton onClick={e => setMenuAnchorElement(e.currentTarget)}>
                    <MenuIcon />
                </IconButton>
            )}
        >
            <ListItemText
                primary={`${name}, ${calories_p100}cal/100g`}
                secondary={description}
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
                <DialogTitle>Permantly Delete Food?</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this food?
                    <strong>This is permanent, will remove all entries using this food, and cannot be undone.</strong>
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

export default FoodsViewListItem;
