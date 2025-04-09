import { Box } from '@mui/material';
import React from 'react';

const BoxCont = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width='100%'
            sx={{ ...sx }}
            {...props}
        >
            {children}
        </Box>
    );
};

export default BoxCont;