import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../component/atom/customTextField';
import BoxCont from '../component/atom/boxCont';
import BoxBorder from '../component/atom/boxBorder';
import ButtonGrad from '../component/atom/buttonGrad';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false); // Track form submission

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setError(null);

        // Basic frontend validation
        if (!email || !password) return;

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                alert('Login successful!');
                navigate('/tasks');
            }
        } catch (err) {
            console.error('Error during login:', err);
            if (err.response && err.response.status === 401) {
                setError('Invalid credentials. Please try again.');
            }
        }
    };

    return (
        <BoxBorder>
            <BoxCont>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <BoxCont
                    component="form"
                    onSubmit={handleLogin}>
                    <CustomTextField
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                        error={submitted && !email}
                        helperText={submitted && !email ? "Email is required." : ""}
                    />

                    <CustomTextField
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                        error={submitted && !password}
                        helperText={submitted && !password ? "Password is required." : ""}
                    />

                    <ButtonGrad type="submit">Login</ButtonGrad>
                </BoxCont>
                <BoxCont style={{ marginTop: '20px' }}>
                    <p>Don't have an account?</p>
                    <ButtonGrad onClick={() => navigate('/register')}>Go to Register</ButtonGrad>
                </BoxCont>
            </BoxCont>
        </BoxBorder>
    );
};

export default Login;
