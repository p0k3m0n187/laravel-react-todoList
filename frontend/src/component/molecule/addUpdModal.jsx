import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Snackbar, Alert, Autocomplete } from '@mui/material';

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

export default function AddUpdateModal({ open, handleClose, task, setTasks, fetchUserTasks }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [success, setSuccess] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    // const [assignedUserId, setAssignedUserId] = useState('');
    const [assignedUserIds, setAssignedUserIds] = useState([]); // For multiple user assignment

    // Effect to populate fields when a task is selected for updating
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status || 'pending'); // Ensure 'pending' as default if status is undefined
            setStartDate(task.start_date?.slice(0, 16) || ''); // Check date format
            setEndDate(task.end_date?.slice(0, 16) || ''); // Check date format
            // Pre-populate assigned users
            setAssignedUserIds(
                Array.isArray(task.assigned_users)
                    ? task.assigned_users.map(u => u.id)
                    : []
            );
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending'); // Default to 'pending' if no task is selected
            // setStartDate('');
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setStartDate(`${year}-${month}-${day}T${hours}:${minutes}`);
            setAssignedUserIds([]);
            setEndDate('');
        }
    }, [task, open]);

    useEffect(() => {
        if (open) {
            axios.get(`http://127.0.0.1:8000/api/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).then(res => setUsers(res.data));
        }
    }, [open]);

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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setSuccess(null);

    //     const token = localStorage.getItem('token');

    //     try {
    //         let response;

    //         // if (task?.id) {
    //         //     // Update existing task
    //         //     response = await axios.put(
    //         //         `http://127.0.0.1:8000/api/tasks/${task.id}`,
    //         //         {
    //         //             title,
    //         //             description,
    //         //             status,
    //         //             start_date: formattedStartDate,
    //         //             end_date: formattedEndDate,
    //         //         },
    //         //         {
    //         //             headers: {
    //         //                 Authorization: `Bearer ${token}`,
    //         //             },
    //         //         }
    //         //     );

    //         if (!task?.id && assignedUserIds.length > 0) {
    //             await Promise.all(
    //                 assignedUserIds.map(userId =>
    //                     axios.post('http://127.0.0.1:8000/api/assigned-tasks', {
    //                         user_id: userId,
    //                         task_id: response.data.id,
    //                     }, {
    //                         headers: { Authorization: `Bearer ${token}` }
    //                     })
    //                 )
    //             );


    //             // Update tasks state optimistically
    //             setTasks(prevTasks => prevTasks.map(t => (t.id === task.id ? response.data : t))); // Replace task

    //         } else {
    //             // Add new task
    //             response = await axios.post(
    //                 'http://127.0.0.1:8000/api/tasks',
    //                 {
    //                     title,
    //                     description,
    //                     status,
    //                     start_date: formattedStartDate,
    //                     end_date: formattedEndDate,
    //                 },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );

    //             // Add the new task optimistically
    //             setTasks(prevTasks => [...prevTasks, response.data]); // Add new task to the list
    //         }

    //         if (response.status === 200 || response.status === 201) {
    //             setSuccess(task?.id ? 'Task updated successfully!' : 'Task added successfully!');
    //             setSnackbarOpen(true);  // Open Snackbar on success

    //             // Assign the task if a user is selected and it's a new task
    //             if (!task?.id && assignedUserId) {
    //                 await axios.post('http://127.0.0.1:8000/api/assigned-tasks', {
    //                     user_id: assignedUserId,
    //                     task_id: response.data.id,
    //                 }, {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 })
    //             }

    //             setTitle('');
    //             setDescription('');
    //             setStatus('pending');
    //             setStartDate('');
    //             setEndDate('');
    //             setAssignedUserId('');
    //             handleClose(); // Close the modal
    //         }
    //     } catch (err) {
    //         console.error('Error saving task:', err);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);

        const token = localStorage.getItem('token');
        let response;

        try {
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

                // Remove all previous assignments for this task
                await axios.delete(`http://127.0.0.1:8000/api/assigned-tasks/task/${task.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Assign new users after updating (send one request with all user IDs)
                if (assignedUserIds.length > 0) {
                    await axios.post('http://127.0.0.1:8000/api/assigned-tasks', {
                        user_ids: assignedUserIds,
                        task_id: task.id,
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

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

                // Assign users after adding (send one request with all user IDs)
                if (assignedUserIds.length > 0) {
                    await axios.post('http://127.0.0.1:8000/api/assigned-tasks', {
                        user_ids: assignedUserIds,
                        task_id: response.data.id,
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                setTasks(prevTasks => [...prevTasks, response.data]); // Add new task to the list
            }

            if (response.status === 200 || response.status === 201) {
                // setSuccess(task?.id ? 'Task updated successfully!' : 'Task added successfully!');
                setSuccess(response.data.message); // Show backend message in Snackbar
                setSnackbarOpen(true);
                setTitle('');
                setDescription('');
                setStatus('pending');
                setStartDate('');
                setEndDate('');
                setAssignedUserIds([]);
                handleClose();
                if (fetchUserTasks) {
                    fetchUserTasks(); // <-- Fetch latest tasks after add/update
                }
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
            <Modal open={open}>
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
                            required
                            label="Start Date"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            required
                            label="Due Date"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        {/* <FormControl fullWidth>
                            <InputLabel>Assign User</InputLabel>
                            <Select
                                value={assignedUserId}
                                label="Assign To"
                                onChange={(e) => setAssignedUserId(e.target.value)}
                            >
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                        <Autocomplete
                            multiple
                            fullWidth
                            options={users}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            value={users.filter(u => assignedUserIds.includes(u.id))}
                            onChange={(event, newValue) => setAssignedUserIds(newValue.map(u => u.id))}
                            renderInput={(params) => (
                                <TextField {...params} label="Assign Users" variant="outlined" />
                            )}
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
                        <Button variant="outlined"
                            onClick={handleClose}
                        >
                            Cancel
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