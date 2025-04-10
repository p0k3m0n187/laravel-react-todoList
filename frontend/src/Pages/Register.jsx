import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BoxCont from '../component/atom/boxCont';
import CustomTextField from '../component/atom/customTextField';
import ButtonGrad from '../component/atom/buttonGrad';
import BoxBorder from '../component/atom/boxBorder';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);  // Error state
    const [submitted, setSubmitted] = useState(false); // Track form submission
    const navigate = useNavigate(); // Initialize useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        // Validate password confirmation
        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        // Basic frontend validation
        if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', {
                firstName,
                lastName,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            if (response.status === 201) {
                alert('Registration successful. You can now login.');
                navigate('/login');
            }
        } catch (err) {
            // Check for backend validation errors
            if (err.response?.data?.errors) {
                const errorMessages = err.response.data.errors;

                // Display password-specific validation error
                if (errorMessages.password) {
                    setError(errorMessages.password[0]);  // Assuming the backend returns an array of error messages for the password field
                } else {
                    setError('There was an error during registration.');
                }
            } else {
                setError('There was an error during registration.');
            }
        }
    };

    return (
        <BoxBorder>
            <BoxCont>

                <BoxCont
                    component="form"
                    onSubmit={handleRegister}>
                    <h2>Register</h2>

                    <CustomTextField
                        type="text"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={submitted && !firstName}
                        helperText={submitted && !firstName ? "First Name is required." : ""}
                    />
                    <CustomTextField
                        type="text"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={submitted && !lastName}
                        helperText={submitted && !lastName ? "Last Name is required." : ""}
                    />
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
                        helperText={
                            submitted && !password
                                ? "Password is required."
                                : submitted && password && !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)
                                    ? "Password must contain alphabets, numbers, and special characters."
                                    : ""
                        }
                        FormHelperTextProps={{
                            style: {
                                color: 'red',  
                            },
                        }}
                    />
                    <CustomTextField
                        type="password"
                        label="Confirm Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        error={submitted && (password !== passwordConfirmation)}
                        helperText={submitted && (password !== passwordConfirmation) ? "Passwords do not match." : ""}
                    />
                    <ButtonGrad type="submit">Register</ButtonGrad>
                </BoxCont>
                <BoxCont sx={{ marginTop: '20px' }}>
                    <p>Already have an account?</p>
                    <ButtonGrad onClick={() => navigate('/login')}>Login</ButtonGrad>
                </BoxCont>
            </BoxCont>
        </BoxBorder>
    );
};

export default Register;
