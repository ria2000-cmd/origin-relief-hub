import React, { useState } from "react";
import { X } from "lucide-react";
import {
    Box, Button, IconButton, TextField, Typography, Checkbox,
    FormControlLabel, Link, Divider, Alert, CircularProgress
} from "@mui/material";
import service from "../service/service";

const LoginForm = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginData = {
                email: formData.email,
                password: formData.password
            }

            const response = await service.login(loginData);

            console.log('Full API Response:', response);

            // Your API returns: response.data.data contains {user, token, expiresIn}
            const { user, token, expiresIn } = response.data.data;

            console.log('Extracted user:', user);
            console.log('Extracted token:', token);
            console.log('Extracted expiresIn:', expiresIn);

            const expirationDate = new Date(Date.now() + expiresIn * 1000);
            const tokenData = { token, expiresAt: expirationDate.getTime() };

            // Determine user role - will be undefined/null for portal users
            const userRole = user?.role || user?.authorities?.[0] || null;

            console.log('Determined userRole:', userRole);

            if (formData.rememberMe) {
                localStorage.setItem('authToken', JSON.stringify(tokenData));
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('authToken', JSON.stringify(tokenData));
                sessionStorage.setItem('user', JSON.stringify(user));
            }

            // Call onLoginSuccess - App.js will handle the rest
            if (onLoginSuccess) {
                console.log('Calling onLoginSuccess with:', { token, userRole, user });
                onLoginSuccess(token, userRole, user);
            }

            onClose();
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                p: 2,
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    p: 4,
                    width: "100%",
                    maxWidth: 400,
                    boxShadow: 8,
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Login
                    </Typography>
                    <IconButton onClick={onClose} disabled={loading}>
                        <X size={22} />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        type="email"
                        size="small"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        fullWidth
                        type="password"
                        size="small"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </Box>

                <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        }
                        label="Remember me"
                    />
                    <Link href="#" underline="hover" variant="body2" color="primary">
                        Forgot password?
                    </Link>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="gold"
                    disabled={loading}
                    sx={{ mt: 3, py: 1.3, fontSize: "1rem" }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                </Button>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{" "}
                        <Button
                            onClick={onSwitchToRegister}
                            variant="text"
                            disabled={loading}
                            sx={{ textTransform: "none", fontSize: "0.9rem" }}
                        >
                            Sign up
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginForm;