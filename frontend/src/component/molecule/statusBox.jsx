import { Box } from '@mui/material';

function StatusBox({ children, sx }) {
    return (
        <Box>
            <Box sx={{
                ...sx,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '250px',
            }}>
                {children}
            </Box>
        </Box>
    );
}

export default StatusBox;
