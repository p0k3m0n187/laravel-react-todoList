import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import StatusBox from '../component/molecule/statusBox'; // Import StatusBox component
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddUpdateModal from '../component/molecule/addUpdModal'; // Import AddUpdateModal component

function Tasks() {
    const [tasks, setTasks] = useState([]); // State to store tasks
    const navigate = useNavigate(); // Initialize useNavigate
    const [open, setOpen] = useState(false); // State to control modal visibility
    const [selectedTask, setSelectedTask] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        // Fetch tasks from the backend
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
                setTasks(tasks.filter((task) => task.id !== taskId));
            }
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleUpdateTask = (task) => {
        console.log('Selected task:', task); // Check if the task data is correct
        setSelectedTask(task);
        setOpen(true);
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
                    <Button onClick={handleOpen} variant="contained" color="primary"> ADD TASKING </Button>
                </Box>
            </Box>

            {/* Main container with Flexbox */}
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {pendingTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        padding: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Typography sx={{ color: 'red' }} variant='h5'>{task.title}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>Start Date: {task.start_date}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>End Date: {task.end_date}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={() => handleDeleteTask(task.id)} >
                                            <DeleteForeverIcon
                                                sx={{
                                                    fontSize: '24px',
                                                    color: 'red'
                                                }} />
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateTask(task)}
                                        >
                                            <VisibilityIcon
                                                sx={{
                                                    fontSize: '24px',
                                                    color: 'red',
                                                }}
                                            />
                                        </Button>
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
                                        padding: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Typography sx={{ color: '#EAAE00' }} variant='h5'>{task.title}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>Start Date: {task.start_date}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>End Date: {task.end_date}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={() => handleDeleteTask(task.id)} >
                                            <DeleteForeverIcon
                                                sx={{
                                                    fontSize: '24px',
                                                    color: '#EAAE00'
                                                }} />
                                        </Button>
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
                                        padding: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Typography sx={{ color: 'green' }} variant='h5'>{task.title}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>Start Date: {task.start_date}</Typography>
                                    <Typography sx={{ fontSize: '1rem' }}>End Date: {task.end_date}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={() => handleDeleteTask(task.id)} >
                                            <DeleteForeverIcon
                                                sx={{
                                                    fontSize: '24px',
                                                    color: 'green'
                                                }} />
                                        </Button>
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
            />
        </Box>
    );
}

export default Tasks;
