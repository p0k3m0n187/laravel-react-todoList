import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Tooltip, Typography } from '@mui/material';
import StatusBox from '../component/molecule/statusBox'; // Import StatusBox component
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import AddUpdateModal from '../component/molecule/addUpdModal'; // Import AddUpdateModal component
import ViewTskMdl from '../component/molecule/viewTskMdl'; // Import viewTskMdl component

function Tasks() {
    const [tasks, setTasks] = useState([]); // State to store tasks
    const navigate = useNavigate(); // Initialize useNavigate
    const [open, setOpen] = useState(false); // State to control modal visibility
    const [openView, setOpenView] = useState(false); // State to control view modal visibility
    const [selectedTask, setSelectedTask] = useState(null);
    const [deleted, setDeleted] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Effect to fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                if (!token) {
                    // Redirect to login page if no token is found
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                setTasks(response.data); // Store tasks in state
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };

        fetchTasks();
    }, [navigate]); // Empty dependency array ensures this runs once when the component mounts

    
    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');

        if (!confirmDelete) {
            return; // If the user cancels, do nothing
        }

        try {
            const token = localStorage.getItem('token'); // Get token from local storage
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });

            if (response.status === 200) {
                // Remove the deleted task from the state
                setDeleted("Task deleted successfully!");
                setSnackbarOpen(true); // Open Snackbar on success deletion
                setTasks(tasks.filter((task) => task.id !== taskId));
            }
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleUpdateTask = (task) => {
        setSelectedTask(task);
        setOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);  // Close Snackbar
    };

    const handleViewTask = (task) => {
        setSelectedTask(task); // Set the selected task
        setOpenView(true); // Open the modal
    };

    // Filter tasks based on their status
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                    <Typography variant="h4"> Tasks </Typography>
                </Box>
                <Box>
                    <Button onClick={handleOpen} variant="contained" color="primary"> ADD TASK </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens, row on larger screens
                    justifyContent: 'space-between',
                    gap: 2, // Add spacing between each task section
                    flexWrap: 'wrap', // Allow wrapping when space is limited
                }}
            >
                {/* Pending Tasks */}
                <StatusBox>
                    <Typography gutterBottom variant="h5">Pending</Typography>
                    {pendingTasks.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                            {pendingTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        display: 'flex',
                                        height: '100%',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Box sx={{ display: 'relative', backgroundColor: '#d32f2f', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', p: 1, mb: 2 }}>
                                        <Typography
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: 'calc(15ch)',
                                                color: 'white'
                                            }}
                                            variant='h5'>
                                            {task.title.length > 50 ? `${task.title.substring(0, 50)}...` : task.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1 }}>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Start Date: {task.start_date ? new Date(task.end_date).toLocaleString() : 'N/A'}</Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Due Date: {task.end_date ? new Date(task.end_date).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Tooltip title="View" arrow>
                                            <Button onClick={() => handleViewTask(task)}>
                                                <ViewIcon sx={{ fontSize: '24px', color: 'red' }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <Button onClick={() => handleDeleteTask(task.id)}>
                                                <DeleteForeverIcon sx={{ fontSize: '24px', color: 'red' }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Edit" arrow>
                                            <Button onClick={() => handleUpdateTask(task)}>
                                                <VisibilityIcon sx={{ fontSize: '24px', color: 'red' }} />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <p>No pending tasks available.</p>
                    )}
                </StatusBox>

                {/* In Progress Tasks */}
                <StatusBox>
                    <Typography gutterBottom variant="h5">In Progress</Typography>
                    {inProgressTasks.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {inProgressTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        display: 'flex',
                                        height: '100%',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Box sx={{ display: 'relative', backgroundColor: '#EAAE00', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', p: 1, mb: 2 }}>
                                        <Typography
                                            sx={{
                                                color: 'white',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: 'calc(15ch)',
                                            }}
                                            variant='h5'>
                                            {task.title.length > 50 ? `${task.title.substring(0, 50)}...` : task.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1 }}>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Start Date: {task.start_date ? new Date(task.end_date).toLocaleString() : 'N/A'}</Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Due Date: {task.end_date ? new Date(task.end_date).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Tooltip title="View" arrow>
                                            <Button onClick={() => handleViewTask(task)} >
                                                <ViewIcon
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: '#EAAE00'
                                                    }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <Button onClick={() => handleDeleteTask(task.id)} >
                                                <DeleteForeverIcon
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: '#EAAE00'
                                                    }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Edit" arrow>
                                            <Button
                                                onClick={() => handleUpdateTask(task)}
                                            >
                                                <VisibilityIcon
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: '#EAAE00',
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <p>No tasks in progress.</p>
                    )}
                </StatusBox>

                {/* Completed Tasks */}
                <StatusBox>
                    <Typography gutterBottom variant="h5">Completed</Typography>
                    {completedTasks.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {completedTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        display: 'flex',
                                        height: '100%',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Box sx={{ display: 'relative', backgroundColor: 'green', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', p: 1, mb: 2 }}>
                                        <Typography
                                            sx={{
                                                color: 'white',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: 'calc(15ch)',
                                            }}
                                            variant='h5'>
                                            {task.title.length > 50 ? `${task.title.substring(0, 50)}...` : task.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 1 }}>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Start Date: {task.start_date ? new Date(task.end_date).toLocaleString() : 'N/A'}</Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Due Date: {task.end_date ? new Date(task.end_date).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Tooltip title="View" arrow>
                                            <Button onClick={() => handleViewTask(task)} >
                                                <ViewIcon
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: 'green'
                                                    }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <Button onClick={() => handleDeleteTask(task.id)} >
                                                <DeleteForeverIcon
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: 'green'
                                                    }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Edit" arrow>
                                            <Button
                                                onClick={() => handleUpdateTask(task)}
                                            >
                                                <VisibilityIcon
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: 'green',
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <p>No completed tasks available.</p>
                    )}
                </StatusBox>
            </Box >

            <AddUpdateModal
                open={open}
                handleClose={() => {
                    setSelectedTask(null);
                    handleClose();
                }}
                task={selectedTask}
                setTasks={setTasks} // Pass setTasks down to the modal
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {deleted}
                </Alert>
            </Snackbar>

            <ViewTskMdl
                open={openView}
                handleClose={() => setOpenView(false)} // Close the modal
                task={selectedTask} // Pass the selected task data
            />
        </Box >
    );
}

export default Tasks;
