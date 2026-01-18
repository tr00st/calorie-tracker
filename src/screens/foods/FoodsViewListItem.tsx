import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Delete, Edit, MoreHoriz } from '@mui/icons-material';
import { useState } from 'react';
import { useSupabase } from '../../utils/supabase';
import { Food, FoodType } from '../../types/foods';
import EditFoodDialog from '../../components/edit-food-dialog/EditFoodDialog';

const FoodsViewListItem = ({
    entity,
    onEntryUpdated,
}: {
    entity: Food;
    onEntryUpdated: (() => void);
}) => {
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const menuIsOpen = Boolean(menuAnchorElement);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const supabase = useSupabase();

    const handleDelete = () => {
        setMenuAnchorElement(null);
        setDeleteConfirmationOpen(true);
    };

    const handleEdit = () => {
        setMenuAnchorElement(null);
        setEditDialogOpen(true);
    };

    const runDelete = async () => {
        setDeleteConfirmationOpen(false);
        await supabase
            .from('foods')
            .delete()
            .eq('id', entity.id);
        onEntryUpdated();
    };

    let label = entity.name;
    if (entity.type === FoodType.BY_WEIGHT) {
        label = `${entity.name}, ${entity.calories_p100}cal/100g`;
    }
    else if (entity.type === 'fixed_serving') {
        label = `${entity.name}, ${entity.calories_fixed}cal/serving`;
    }

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
                primary={label}
                secondary={entity.description}
                sx={{ flexGrow: 1 }}
            />
            <Menu
                open={menuIsOpen}
                onClose={() => setMenuAnchorElement(null)}
                anchorEl={menuAnchorElement}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>
                    Edit
                </MenuItem>
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
            <EditFoodDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onFoodUpdated={onEntryUpdated}
                food={entity}
            />
        </ListItem>
    );
};

export default FoodsViewListItem;
