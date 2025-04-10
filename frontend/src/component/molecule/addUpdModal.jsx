import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


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

export default function AddUpdateModal({ open, handleClose, task }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const { taskId } = useParams();

    // Effect to populate fields when a task is selected for updating
    useEffect(() => {
        console.log('Task prop:', task); // Check if task is being passed correctly
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setStartDate(task.start_date?.slice(0, 16) || '');
            setEndDate(task.end_date?.slice(0, 16) || '');
        } else {
            // If no task, clear fields (add mode)
            setTitle('');
            setDescription('');
            setStatus('pending');
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

        return `${year}-${month}-${day}T${hours}:${minutes}`; // "Y-m-d\TH:i"
    };

    const formattedStartDate = formatDate(startDate, taskId);
    const formattedEndDate = formatDate(endDate, taskId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('token'); // Retrieve token from local storage

        try {
            let response;

            if (taskId) {
                // Update existing task
                response = await axios.put(
                    `http://127.0.0.1:8000/api/tasks/${taskId}`,
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
            }

            if (response.status === 200 || response.status === 201) {
                setSuccess('Task saved successfully!');
                setTitle('');
                setDescription('');
                setStatus('pending');
                setStartDate('');
                setEndDate('');
                navigate('/tasks');
            }
        } catch (err) {
            console.error('Error saving task:', err);
            if (err.response) {
                console.log('Error response:', err.response.data);
                setError(err.response.data.errors || 'Failed to save task. Please try again.');
            } else {
                setError('Failed to save task. Please try again.');
            }
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography sx={{ mb: 3 }} variant="h6">{task ? 'Update Task' : 'Add Task'}</Typography>

                {error && (
                    <Typography sx={{ color: 'red', mb: 1 }}>
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </Typography>
                )}
                {success && (
                    <Typography sx={{ color: 'green', mb: 1 }}>{success}</Typography>
                )}

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
                        label="End Date"
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {task ? 'Update Task' : 'Add Task'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}