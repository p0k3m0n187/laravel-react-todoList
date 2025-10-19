import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Typography, InputAdornment } from '@mui/material';
import StatusBox from '../component/molecule/statusBox';
import VisibilityIcon from '@mui/icons-material/Edit';
import AddUpdateModal from '../component/molecule/addUpdModal';
import ViewTskMdl from '../component/molecule/viewTskMdl';
import CustomTextField from '../component/atom/customTextField';
import SearchIcon from '@mui/icons-material/Search';

function Tasks() {
    const [myTasks, setMyTasks] = useState([]); // State to store my tasks
    const [tasks, setTasks] = useState([]); // State to store tasks
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const navigate = useNavigate(); // Initialize useNavigate
    const [open, setOpen] = useState(false); // State to control modal visibility
    const [openView, setOpenView] = useState(false); // State to control view modal visibility
    const [selectedTask, setSelectedTask] = useState(null);
    const [deleted, setDeleted] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleOpen = () => {
        setSelectedTask(null);
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const fetchUserTasks = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://127.0.0.1:8000/api/assigned-tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching user-specific tasks:', err);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserTasks();
    }, [fetchUserTasks]);

    const fetchMyTasks = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://127.0.0.1:8000/api/my-tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyTasks(response.data);
        } catch (err) {
            console.error('Error fetching my tasks:', err);
        }
    }, [navigate]);

    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);


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
                // setDeleted("Task deleted successfully!");
                setDeleted(response.data.message);
                setSnackbarOpen(true); // Open Snackbar on success deletion
                setTasks(tasks.filter((task) => task.id !== taskId));
                setOpenView(false); // Close the view modal after deletion
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

    // Filter tasks based on their status and search query
    const filteredTasks = tasks.filter((task) =>
        (task.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter tasks based on their status
    const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
    const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
    const completedTasks = filteredTasks.filter(task => task.status === 'completed');

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h4"> Tasks </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center',
            }}>
                <Box>
                    <Button onClick={handleOpen} variant="contained" color="primary"> ADD TASK </Button>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <CustomTextField
                        fullWidth
                        label="Search Tasks"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
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
                                    onClick={() => handleViewTask(task)}
                                    sx={{
                                        borderRadius: 3,
                                        display: 'flex',
                                        height: '150px',
                                        width: '250px',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'relative',
                                            backgroundColor: '#d32f2f',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px',
                                            height: '20px',
                                        }} />
                                    <Box sx={{ p: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant='h5'>
                                                {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                                            </Typography>
                                            <Button onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateTask(task)
                                            }}
                                                sx={{ p: 0, minWidth: 0 }}>
                                                <VisibilityIcon sx={{ fontSize: '24px', color: 'red', padding: 0 }} />
                                            </Button>
                                        </Box>
                                        <Typography gutterBottom sx={{
                                            fontSize: '1rem',
                                            color: 'grey',
                                            height: '50px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            // justifyContent: 'center'
                                        }}>
                                            {task.description.length > 30 ? `${task.description.substring(0, 30)}...` : task.description}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Start Date: {task.start_date ? new Date(task.start_date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Due Date: {task.end_date ? new Date(task.end_date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </Typography>
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
                                    onClick={() => handleViewTask(task)}
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        display: 'flex',
                                        height: '150px',
                                        width: '250px',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'relative',
                                            backgroundColor: '#EAAE00',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px',
                                            height: '20px'
                                        }} />
                                    <Box sx={{ p: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant='h5'>
                                                {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                                            </Typography>
                                            <Button onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateTask(task)
                                            }}
                                                sx={{ p: 0, minWidth: 0 }}>
                                                <VisibilityIcon sx={{ fontSize: '24px', color: '#EAAE00', padding: 0 }} />
                                            </Button>
                                        </Box>
                                        <Typography gutterBottom sx={{
                                            fontSize: '1rem',
                                            color: 'grey',
                                            height: '50px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            // justifyContent: 'center'
                                        }}>
                                            {task.description.length > 30 ? `${task.description.substring(0, 30)}...` : task.description}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Start Date: {task.start_date ? new Date(task.start_date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Due Date: {task.end_date ? new Date(task.end_date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </Typography>
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
                                    onClick={() => handleViewTask(task)}
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        display: 'flex',
                                        height: '150px',
                                        width: '250px',
                                        flexDirection: 'column',
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.2)',
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'relative',
                                            backgroundColor: 'green',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px',
                                            height: '20px'
                                        }} />

                                    <Box sx={{ p: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant='h5'>
                                                {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                                            </Typography>
                                            <Button onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateTask(task)
                                            }}
                                                sx={{ p: 0, minWidth: 0 }}>
                                                <VisibilityIcon sx={{ fontSize: '24px', color: 'green', padding: 0 }} />
                                            </Button>
                                        </Box>
                                        <Typography gutterBottom sx={{
                                            fontSize: '1rem',
                                            color: 'grey',
                                            height: '50px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            // justifyContent: 'center'
                                        }}>
                                            {task.description.length > 30 ? `${task.description.substring(0, 30)}...` : task.description}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Start Date: {task.start_date ? new Date(task.start_date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                            Due Date: {task.end_date ? new Date(task.end_date).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <p>No completed tasks available.</p>
                    )}
                </StatusBox>

                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>My Created Tasks</Typography>
                    {myTasks.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {myTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: '-5px 8px 10px 5px rgba(0, 0, 0, 0.1)',
                                        p: 2,
                                        mb: 1,
                                        bgcolor: '#f9f9f9',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {task.title}
                                    </Typography>
                                    <Typography sx={{ color: 'grey' }}>
                                        {task.description}
                                    </Typography>
                                    <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                        Start Date: {task.start_date ? new Date(task.start_date).toLocaleString() : 'N/A'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                                        Due Date: {task.end_date ? new Date(task.end_date).toLocaleString() : 'N/A'}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No tasks created by you.</Typography>
                    )}
                </Box>
            </Box >

            <AddUpdateModal
                open={open}
                handleClose={() => {
                    setSelectedTask(null);
                    handleClose();
                }}
                task={selectedTask}
                setTasks={setTasks} // Pass setTasks down to the modal
                fetchUserTasks={fetchUserTasks}
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
                handleDeleteTask={handleDeleteTask} // Pass the delete function down to the modal
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
                    {deleted}
                </Alert>
            </Snackbar>
        </Box >
    );
}

export default Tasks;