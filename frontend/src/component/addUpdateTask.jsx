import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddUpdateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const { taskId } = useParams(); // Get taskId from URL for update

    // Function to format date to match backend format
    const formatDate = (date) => {
        if (!date) return null;
        const formattedDate = new Date(date);
        return formattedDate.toISOString().slice(0, 16);  // Format to "yyyy-mm-ddTHH:mm"
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    useEffect(() => {
        // Fetch task for update if taskId exists
        if (taskId) {
            const fetchTask = async () => {
                try {
                    const token = localStorage.getItem('token'); // Get token from local storage
                    if (!token) {
                        navigate('/login');
                        return;
                    }

                    const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const task = response.data;
                    setTitle(task.title);
                    setDescription(task.description);
                    setStatus(task.status);
                    setStartDate(task.start_date?.slice(0, 16) || '');
                    setEndDate(task.end_date?.slice(0, 16) || '');
                } catch (err) {
                    console.error('Error fetching task:', err);
                    setError('Failed to fetch task details. Please try again later.');
                }
            };

            fetchTask();
        }
    }, [taskId, navigate]);

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
                // Reset form after submission
                setTitle('');
                setDescription('');
                setStatus('pending');
                setStartDate('');
                setEndDate('');
                navigate('/tasks'); // Navigate back to the task list
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
        <div>
            <h2>{taskId ? 'Update Task' : 'Add Task'}</h2>
            {error && <p style={{ color: 'red' }}>{typeof error === 'object' ? JSON.stringify(error) : error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button type="submit">{taskId ? 'Update Task' : 'Add Task'}</button>
            </form>
        </div>
    );
}
