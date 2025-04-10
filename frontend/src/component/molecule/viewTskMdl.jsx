import React from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: '#f5f5f5', // Light grey background
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow
    p: 4,
};

const titleStyle = {
    fontWeight: 'bold',
    color: '#333', // Darker color for better readability
    fontSize: '1.2rem',
};

const valueStyle = {
    fontSize: '1rem',
    color: '#555', // Slightly lighter color for values
    marginBottom: '8px', // Add margin between values
};

const descriptionBoxStyle = {
    height: 'auto',
    width: '100%',
    overflow: 'auto', // To ensure scrolling if content overflows
    wordWrap: 'break-word', // Break words if they exceed the width
    whiteSpace: 'pre-wrap', // Preserve whitespace and wrap lines
    padding: '8px',
    backgroundColor: '#fff', // White background for the description area
    borderRadius: '4px',
    border: '1px solid #ddd', // Border for better visual separation
};

const buttonStyle = {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#1565c0',
    },
};

export default function ViewTskMdl({ open, handleClose, task }) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }} variant="h6">
                    View Task
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography sx={titleStyle}>Title:</Typography>
                        <Typography sx={valueStyle}>{task?.title || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={titleStyle}>Description:</Typography>
                        <Box sx={descriptionBoxStyle}>
                            <Typography sx={valueStyle}>{task?.description || 'N/A'}</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={titleStyle}>Status:</Typography>
                        <Typography sx={valueStyle}>
                            {task?.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Pending'}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={titleStyle}>Start Date:</Typography>
                        <Typography sx={valueStyle}>{task?.start_date ? new Date(task.start_date).toLocaleString() : 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={titleStyle}>Due Date:</Typography>
                        <Typography sx={valueStyle}>{task?.end_date ? new Date(task.end_date).toLocaleString() : 'N/A'}</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        sx={buttonStyle}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
