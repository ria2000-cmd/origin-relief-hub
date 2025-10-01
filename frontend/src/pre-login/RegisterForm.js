import React, { useState } from "react";
import { X } from "lucide-react";
import {
    Box, Button, IconButton, TextField, Typography, Checkbox,
    FormControlLabel, Divider, Alert, CircularProgress
} from "@mui/material";
import service from "../service/service";

const RegisterForm = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idNumber: '',
        email: '',
        username: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        dateOfBirth: '',
        agreeToTerms: false
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

    const validateForm = () => {
        const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
        if (!fullName || fullName.length > 255) {
            return "Full name is required and must not exceed 255 characters";
        }

        if (!formData.idNumber || !/^\d{13}$/.test(formData.idNumber)) {
            return "ID number must be exactly 13 digits";
        }

        if (!formData.email || formData.email.length > 255) {
            return "Email is required and must not exceed 255 characters";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return "Invalid email format";
        }

        if (!formData.username || formData.username.length > 255) {
            return "Username is required and must not exceed 255 characters";
        }

        if (!formData.phone || !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
            return "Phone number must be 10-15 digits (with optional + prefix)";
        }

        if (!formData.password || formData.password.length < 8) {
            return "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            return "Passwords don't match";
        }

        if (formData.address && formData.address.length > 1000) {
            return "Address must not exceed 1000 characters";
        }

        if (!formData.dateOfBirth) {
            return "Date of birth is required";
        }
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);
        if (birthDate >= today) {
            return "Date of birth must be in the past";
        }

        if (!formData.agreeToTerms) {
            return "Please agree to the Terms and Conditions";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const registrationData = {
                fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
                idNumber: formData.idNumber,
                email: formData.email,
                username: formData.username,
                phone: formData.phone,
                password: formData.password,
                address: formData.address || null,
                dateOfBirth: formData.dateOfBirth
            };

            console.log("Sending registration data:", registrationData);

            const data = await service.register(registrationData);

            onClose();

        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                    maxWidth: 420,
                    boxShadow: 8,
                    maxHeight: "90vh",
                    overflowY: "auto"
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Create an Account
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

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        fullWidth
                        size="small"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={loading}
                        inputProps={{ maxLength: 127 }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        fullWidth
                        size="small"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={loading}
                        inputProps={{ maxLength: 127 }}
                    />
                </Box>

                {/* ID Number */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="ID Number"
                        name="idNumber"
                        fullWidth
                        size="small"
                        required
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        disabled={loading}
                        inputProps={{
                            maxLength: 13,
                            pattern: "\\d{13}"
                        }}
                        helperText="Must be exactly 13 digits"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
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
                        inputProps={{ maxLength: 255 }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        size="small"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={loading}
                        inputProps={{ maxLength: 255 }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Phone Number"
                        name="phone"
                        fullWidth
                        type="tel"
                        size="small"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={loading}
                        helperText="10-15 digits (e.g., +1234567890)"
                        inputProps={{ maxLength: 16 }}
                    />
                </Box>

                {/* Date of Birth */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Date of Birth"
                        name="dateOfBirth"
                        fullWidth
                        type="date"
                        size="small"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={loading}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                {/* Address (Optional) */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Address (Optional)"
                        name="address"
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={loading}
                        inputProps={{ maxLength: 1000 }}
                        helperText={`${formData.address.length}/1000 characters`}
                    />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 2 }}>
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
                        helperText="Minimum 8 characters"
                    />
                </Box>

                {/* Confirm Password */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        fullWidth
                        type="password"
                        size="small"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    }
                    label="I agree to the Terms and Conditions"
                    sx={{ mt: 1, mb: 2 }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="gold"
                    disabled={loading || !formData.agreeToTerms}
                    sx={{ mt: 2, py: 1.3, fontSize: "1rem" }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{" "}
                        <Button
                            onClick={onSwitchToLogin}
                            variant="text"
                            disabled={loading}
                            sx={{ textTransform: "none", fontSize: "0.9rem" }}
                        >
                            Sign in
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterForm;