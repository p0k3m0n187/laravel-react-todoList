import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Tasks() {
    const [tasks, setTasks] = useState([]); // State to store tasks
    const [error, setError] = useState(null); // State to store errors
    const navigate = useNavigate(); // Initialize useNavigate

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
                setError('Failed to fetch tasks. Please try again later.');
            }
        };

        fetchTasks();
    }, [navigate]); // Empty dependency array ensures this runs once when the component mounts

    const handleLogout = () => {
        // Remove token from localStorage and redirect to login page
        console.log("Account Logged Out!");
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteTask = async (taskId) => {
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
                setError(null); // Clear any previous errors
            }
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task. Please try again later.');
        }
    };

    const handleUpdateTask = (taskId) => {
        // Navigate to the Update Task page with taskId
        navigate(`/update-task/${taskId}`);
    };

    // Filter tasks based on their status
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return (
        <div>
            <h1>Tasks</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Pending Tasks */}
            <div>
                <h2>Pending Tasks</h2>
                {pendingTasks.length > 0 ? (
                    <ul>
                        {pendingTasks.map((task) => (
                            <li key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>Start Date: {task.start_date}</p>
                                <p>End Date: {task.end_date}</p>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                <button onClick={() => handleUpdateTask(task.id)}>Update</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No pending tasks available.</p>
                )}
            </div>

            {/* In Progress Tasks */}
            <div>
                <h2>In Progress Tasks</h2>
                {inProgressTasks.length > 0 ? (
                    <ul>
                        {inProgressTasks.map((task) => (
                            <li key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>Start Date: {task.start_date}</p>
                                <p>End Date: {task.end_date}</p>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                <button onClick={() => handleUpdateTask(task.id)}>Update</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks in progress.</p>
                )}
            </div>

            {/* Completed Tasks */}
            <div>
                <h2>Completed Tasks</h2>
                {completedTasks.length > 0 ? (
                    <ul>
                        {completedTasks.map((task) => (
                            <li key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>Start Date: {task.start_date}</p>
                                <p>End Date: {task.end_date}</p>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                <button onClick={() => handleUpdateTask(task.id)}>Update</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No completed tasks available.</p>
                )}
            </div>

            <button onClick={() => navigate('/add-task')}>Add Task</button> {/* Button to navigate to Add Task page */}
            <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
        </div>
    );
}

export default Tasks;
