import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '../../utils/supabase';
import { Backdrop, CircularProgress, Collapse, Fab, List } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TransitionGroup } from 'react-transition-group';
import FoodsViewListItem from './FoodsViewListItem';
import AddFoodDialog from '../../components/add-food-dialog.tsx/AddFoodDialog';
import { Food } from '../../components/add-quick-log-dialog/FoodSearchBox';

function FoodsView() {
    const [listEntries, setLogEntries] = useState<Food[] | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const client = useSupabase();

    const getFoodListEntries = useCallback(async () => {
        setLogEntries(null);
        const { data } = await client
            .from('foods')
            .select(`
                *
            `);
        setLogEntries(data);
    }, [client]);

    useEffect(() => {
        getFoodListEntries();
    }, [getFoodListEntries]);

    return (
        <>
            <List sx={{ flexGrow: 1 }}>
                <Backdrop open={listEntries === null} sx={{ position: 'absolute', padding: '5rem', alignItems: 'start' }} invisible>
                    <CircularProgress />
                </Backdrop>
                <TransitionGroup>
                    {listEntries
                        ?.map((listEntry: Food) => (
                            <Collapse>
                                <FoodsViewListItem
                                    entity={listEntry}
                                    key={listEntry.id}
                                    onEntryUpdated={getFoodListEntries}
                                />
                            </Collapse>
                        ))}
                </TransitionGroup>
            </List>
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
                onClick={() => setShowAddDialog(true)}
            >
                <AddIcon />
            </Fab>
            <AddFoodDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onFoodAdded={() => getFoodListEntries()} />
        </>
    );
}

export default FoodsView;
