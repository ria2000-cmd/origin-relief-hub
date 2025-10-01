import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import {
    User,
    Lock,
    Settings
} from 'lucide-react';
import PersonalDetailsTab from './PersonalDetailsTab';
import PasswordChangeTab from './PasswordChangeTab';
import PreferencesTab from './PreferencesTab';
import profileService from '../../service/profile-service';

const ManageProfile = ({ user,
                           preferences,
                           onPreferencesChange,
                           onSavePreferences,
                           preferencesLoading
                       }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');


    const [personalDetails, setPersonalDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        idNumber: '',
        username: ''
    });

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        console.log('user on manage profile', user)
    }, [user]);

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);
        try {
            // Real API call to get user profile
            const userResponse = await profileService.getUserProfile();
            setPersonalDetails(userResponse.data);

        } catch (err) {
            console.error('Failed to load user data:', err);
            setError('Failed to load user data: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Event Handlers
    const handlePersonalDetailsChange = (e) => {
        const { name, value } = e.target;

        // Input sanitization for specific fields
        let sanitizedValue = value;
        if (name === 'idNumber') {
            sanitizedValue = value.replace(/\D/g, ''); // Only digits
        }
        if (name === 'phone') {
            sanitizedValue = value.replace(/[^\d+]/g, ''); // Only digits and +
        }

        setPersonalDetails(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Enhanced Validation Functions
    const validatePersonalDetails = () => {
        const { firstName, lastName, email, phone, idNumber } = personalDetails;

        if (!firstName.trim() || !lastName.trim()) {
            return 'First name and last name are required';
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Valid email is required';
        }
        if (!phone || !/^\+?[0-9]{10,15}$/.test(phone)) {
            return 'Valid phone number is required (10-15 digits)';
        }
        if (!idNumber || !/^\d{13}$/.test(idNumber)) {
            return 'Valid ID number (exactly 13 digits) is required';
        }
        return null;
    };

    const validatePasswordChange = () => {
        const { currentPassword, newPassword, confirmNewPassword } = passwordData;

        if (!currentPassword) {
            return 'Current password is required';
        }
        if (!newPassword || newPassword.length < 8) {
            return 'New password must be at least 8 characters';
        }
        // Enhanced password validation
        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(newPassword)) {
            return 'Password must contain letters, numbers, and special characters';
        }
        if (newPassword !== confirmNewPassword) {
            return 'New passwords do not match';
        }
        if (newPassword === currentPassword) {
            return 'New password must be different from current password';
        }
        return null;
    };

    const handleSavePersonalDetails = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const validationError = validatePersonalDetails();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            // Real API call to update profile
            await profileService.updateUserProfile(personalDetails);
            setSuccess('Personal details updated successfully!');

            // Auto-clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);

        } catch (err) {
            console.error('Failed to update personal details:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update personal details');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const validationError = validatePasswordChange();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            // Prepare payload for backend (exclude confirmNewPassword)
            const passwordPayload = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            };

            // Real API call to change password
            await profileService.changePassword(passwordPayload);
            setSuccess('Password changed successfully!');

            // Clear password form
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });

            // Auto-clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);

        } catch (err) {
            console.error('Failed to change password:', err);

            // Handle specific backend error messages
            const errorMessage = err.response?.data?.message || err.message;

            if (errorMessage.includes('incorrect') || errorMessage.includes('wrong')) {
                setError('Current password is incorrect');
            } else if (errorMessage.includes('same') || errorMessage.includes('different')) {
                setError('New password must be different from current password');
            } else if (errorMessage.includes('weak') || errorMessage.includes('strong')) {
                setError('Password does not meet security requirements');
            } else {
                setError(errorMessage || 'Failed to change password');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClearPassword = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
        // Clear any password-related errors
        if (error && (error.includes('password') || error.includes('Password'))) {
            setError('');
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setSuccess('');
    };

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Manage Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Update your personal information, change password, and manage your preferences
            </Typography>

            {/* Enhanced Alerts with Auto-dismiss */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}
            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccess('')}
                >
                    {success}
                </Alert>
            )}

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                {/* Enhanced Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 64,
                            fontSize: '1rem',
                            color: 'text.secondary'
                        },
                        '& .Mui-selected': {
                            color: '#1e3a8a !important'
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#facc15',
                            height: 3
                        }
                    }}
                >
                    <Tab
                        icon={<User size={18} />}
                        label="Personal Details"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Lock size={18} />}
                        label="Change Password"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Settings size={18} />}
                        label="Preferences"
                        iconPosition="start"
                    />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ p: 4 }}>
                    {activeTab === 0 && (
                        <PersonalDetailsTab
                            user={user}
                            personalDetails={personalDetails}
                            onPersonalDetailsChange={handlePersonalDetailsChange}
                            onSave={handleSavePersonalDetails}
                            onReset={loadUserData}
                            loading={loading}
                        />
                    )}
                    {activeTab === 1 && (
                        <PasswordChangeTab
                            passwordData={passwordData}
                            onPasswordChange={handlePasswordChange}
                            onChangePassword={handleChangePassword}
                            onClear={handleClearPassword}
                            loading={loading}
                        />
                    )}
                    {activeTab === 2 && (
                        <PreferencesTab
                            preferences={preferences}
                            onPreferencesChange={onPreferencesChange}
                            onSavePreferences={onSavePreferences}
                            loading={preferencesLoading}
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageProfile;