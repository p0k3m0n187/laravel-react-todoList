import { Box } from '@mui/material';
import React from 'react';

function BoxBorder({ children }) {
    return (
        <Box sx={{
            border: '2px solid black',
            borderRadius: 2,
            width: '350px',
            height: '100%',
            p: 4,
        }}>
            {children}
        </Box>
    );
}

export default BoxBorder;
