import { Box, Fade } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

const FadeBetweenValues = ({ value }: { value: string | number }) => {
    return (
        <Box>
            <TransitionGroup>
                <Fade key={value}>
                    <span style={{ position: 'absolute' }}>
                        {value}
                    </span>
                </Fade>
            </TransitionGroup>
        </Box>
    );
};

export default FadeBetweenValues;
