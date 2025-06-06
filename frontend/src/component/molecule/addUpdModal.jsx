import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Snackbar, Alert } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AddUpdateModal({ open, handleClose, task, setTasks }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [success, setSuccess] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Effect to populate fields when a task is selected for updating
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status || 'pending'); // Ensure 'pending' as default if status is undefined
            setStartDate(task.start_date?.slice(0, 16) || ''); // Check date format
            setEndDate(task.end_date?.slice(0, 16) || ''); // Check date format
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending'); // Default to 'pending' if no task is selected
            setStartDate('');
            setEndDate('');
        }
    }, [task, open]);

    const formatDate = (date, isUpdating) => {
        if (!date) return null;
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const hours = String(formattedDate.getHours()).padStart(2, '0');
        const minutes = String(formattedDate.getMinutes()).padStart(2, '0');

        return isUpdating
            ? `${year}-${month}-${day}T${hours}:${minutes}`
            : `${year}-${month}-${day} ${hours}:${minutes}:00`;
    };

    const formattedStartDate = formatDate(startDate, task?.id);  // Check if task is valid
    const formattedEndDate = formatDate(endDate, task?.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);

        const token = localStorage.getItem('token');

        try {
            let response;

            if (task?.id) {
                // Update existing task
                response = await axios.put(
                    `http://127.0.0.1:8000/api/tasks/${task.id}`,
                    {
                        title,
                        description,
                        status,
                        start_date: formattedStartDate,
                        end_date: formattedEndDate,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Update tasks state optimistically
                setTasks(prevTasks => prevTasks.map(t => (t.id === task.id ? response.data : t))); // Replace task

            } else {
                // Add new task
                response = await axios.post(
                    'http://127.0.0.1:8000/api/tasks',
                    {
                        title,
                        description,
                        status,
                        start_date: formattedStartDate,
                        end_date: formattedEndDate,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Add the new task optimistically
                setTasks(prevTasks => [...prevTasks, response.data]); // Add new task to the list
            }

            if (response.status === 200 || response.status === 201) {
                setSuccess('Task saved successfully!');
                setSnackbarOpen(true);  // Open Snackbar on success
                setTitle('');
                setDescription('');
                setStatus('pending');
                setStartDate('');
                setEndDate('');
                handleClose(); // Close the modal
            }
        } catch (err) {
            console.error('Error saving task:', err);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);  // Close Snackbar
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography sx={{ mb: 3 }} variant="h6">{task ? 'Update Task' : 'Add Task'}</Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Due Date"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor:
                                    status === 'pending'
                                        ? 'red'            
                                        : status === 'in_progress'
                                            ? '#EAAE00'         
                                            : status === 'completed'
                                                ? 'green'           
                                                : 'primary.main',   
                            }}
                        >
                            {task ? 'Update Task' : 'Add Task'}
                        </Button>

                    </Box>
                </Box>
            </Modal>

            {/* Snackbar for success message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </>
    );
}