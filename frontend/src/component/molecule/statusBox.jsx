import { Box } from '@mui/material';
import React from 'react';

function StatusBox({ children, sx }) {
    return (
        <Box>
            <Box sx={{
                ...sx,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 1,
                flex: 1,
                minWidth: '250px',
                padding: 1,
                minHeight: '450px',
            }}>
                {children}
            </Box>
        </Box>
    );
}

export default StatusBox;
