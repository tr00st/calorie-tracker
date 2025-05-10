import { Divider, List, ListItem, ListItemText } from '@mui/material';
import { PERSISTENT_MENU_WIDTH } from './Menu';
import { FoodBank, HelpOutline, List as ListIcon, PersonOutline } from '@mui/icons-material';
import MenuEntry from './MenuEntry';

const MenuBody = ({ onMenuItemSelected }: { onMenuItemSelected: { (): void } }) => {
    return (
        <List sx={{ width: PERSISTENT_MENU_WIDTH }}>
            <ListItem>
                <ListItemText slotProps={{ primary: { variant: 'h6' } }}>
                    Calorie Counter
                </ListItemText>
            </ListItem>
            <MenuEntry href="/" label="Log" icon={<ListIcon />} onClick={onMenuItemSelected} />
            <MenuEntry href="/foods" label="Foods" icon={<FoodBank />} onClick={onMenuItemSelected} />
            <Divider />
            <MenuEntry href="/account" label="Account" icon={<PersonOutline />} onClick={onMenuItemSelected} />
            <MenuEntry href="/about" label="About" icon={<HelpOutline />} onClick={onMenuItemSelected} />
        </List>
    );
};

export default MenuBody;
